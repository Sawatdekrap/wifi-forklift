import asyncio
import argparse
import csv
import json
import time
from io import BytesIO
from websockets.asyncio.server import serve


gpio_mapping = {}
with open("mapping.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        gpio_mapping[row["control"]] = int(row["gpio"])
print("GPIO mapping:")
for control, gpio in gpio_mapping.items():
    print(f"{control}: {gpio}")

try:
    from gpiozero import LED
    from picamera2 import Picamera2
    from PIL import Image
    USE_GPIO = True
    CONTROL_MAPPING = {
        control: LED(gpio) for control, gpio in gpio_mapping.items()
    }

    USE_CAMERA = True
    camera = Picamera2()
    camera.configure(camera.create_video_configuration(
        main={"size": (320, 240), "format": "RGB888"},
        encode="main",
        buffer_count=4
    ))
    camera.start()
    time.sleep(1)
except ImportError:
    USE_GPIO = False
    USE_CAMERA = False
    CONTROL_MAPPING = {}
    print("Not running on a Raspberry Pi - GPIO and camera functionality disabled")

# https://websockets.readthedocs.io/en/stable/howto/patterns.html

controls = {
    "forward": False,
    "backward": False,
    "left": False,
    "right": False,
    "up": False,
    "down": False,
}
assert set(gpio_mapping.keys()) == set(controls.keys()), "GPIO mapping and control keys must match"


async def consumer_handler(websocket):
    async for message in websocket:
        print("Input: ", message)
        try:
            message = json.loads(message)
        except json.JSONDecodeError:
            print("Invalid JSON message")
            continue
        for control in controls:
            controls[control] = message.get(control, False)


async def producer_handler(websocket):
    if not USE_CAMERA:
        return

    stream = BytesIO()

    while True:
        # Capture frame
        frame = camera.capture_array()
        print(f"Captured frame shape: {frame.shape}")

        # Convert to JPEG using PIL with optimized settings
        image = Image.fromarray(frame)
        image.save(stream, format='JPEG', quality=70, optimize=True)
        stream_size = stream.getbuffer().nbytes
        print(f"Encoded stream size: {stream_size} bytes")

        # Send frame
        stream.seek(0)
        data = stream.read()
        print(f"Read data size: {len(data)} bytes")
        await websocket.send(data)
        stream.truncate(0)
        stream.seek(0)

        await asyncio.sleep(0.5)


async def gpio_handler():
    step = 0
    while True:
        if step % 10 == 0:
            print("Output: ", controls)

        step += 1
        if USE_GPIO:
            for control, control_value in controls.items():
                if control_value:
                    CONTROL_MAPPING[control].on()
                else:
                    CONTROL_MAPPING[control].off()

        await asyncio.sleep(0.1)


async def handler(websocket):
    print("New connection from", websocket.remote_address)
    await asyncio.gather(consumer_handler(websocket), producer_handler(websocket), gpio_handler())


async def main(host, port):
    print(f"Starting server at ws://{host}:{port}")
    try:
        async with serve(handler, host, port) as server:
            await server.serve_forever()
    except Exception as e:
        if USE_CAMERA:
            camera.stop()
        raise e


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='WebSocket server for forklift controls')
    parser.add_argument('--host', default='localhost', help='Host to bind the server to (default: localhost)')
    parser.add_argument('--port', type=int, default=8765, help='Port to bind the server to (default: 8765)')
    args = parser.parse_args()

    asyncio.run(main(args.host, args.port))
