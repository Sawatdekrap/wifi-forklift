import asyncio
import argparse
import csv
import json
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
    from picamera import PiCamera
    USE_GPIO = True
    USE_CAMERA = True
    CONTROL_MAPPING = {
        control: LED(gpio) for control, gpio in gpio_mapping.items()
    }
except ImportError:
    USE_GPIO = False
    USE_CAMERA = False
    CONTROL_MAPPING = {}
    print("Not running on a Raspberry Pi - GPIO functionality disabled")

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

    camera = PiCamera()
    camera.resolution = (1280, 720)
    stream = BytesIO()
    while True:
        camera.capture(stream, format="jpeg")
        stream.seek(0)
        await websocket.send(stream.read())
        stream.truncate(0)
        stream.seek(0)
        await asyncio.sleep(0.1)

async def gpio_handler():
    while True:
        print("Output: ", controls)
        if USE_GPIO:
            for control, control_value in controls.items():
                if control_value:
                    CONTROL_MAPPING[control].on()
                else:
                    CONTROL_MAPPING[control].off()

        await asyncio.sleep(0.1)


async def handler(websocket):
    await asyncio.gather(consumer_handler(websocket), producer_handler(websocket), gpio_handler())


async def main(host, port):
    print(f"Starting server at ws://{host}:{port}")
    async with serve(handler, host, port) as server:
        await server.serve_forever()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='WebSocket server for forklift controls')
    parser.add_argument('--host', default='localhost', help='Host to bind the server to (default: localhost)')
    parser.add_argument('--port', type=int, default=8765, help='Port to bind the server to (default: 8765)')
    args = parser.parse_args()

    asyncio.run(main(args.host, args.port))
