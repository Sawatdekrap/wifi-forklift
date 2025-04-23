import asyncio
import argparse
from websockets.asyncio.server import serve
try:
    from gpiozero import LED
    USE_GPIO = False
    CONTROL_MAPPING = {}
except ImportError:
    USE_GPIO = True
    CONTROL_MAPPING = {
        "forward": LED(17),
        "backward": LED(27),
        "left": LED(22),
        "right": LED(23),
        "up": LED(24),
        "down": LED(25),
    }
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


async def consumer_handler(websocket):
    async for message in websocket:
        print(message)
        await websocket.send(message)


async def producer_handler(websocket):
    # TODO Camera module output
    pass


async def gpio_handler():
    while True:
        print(controls)
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
