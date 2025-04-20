import asyncio
import argparse
from websockets.asyncio.server import serve


# https://websockets.readthedocs.io/en/stable/howto/patterns.html


async def consumer_handler(websocket):
    async for message in websocket:
        print(message)
        await websocket.send(message)


async def producer_handler(websocket):
    # TODO Camera module output
    pass


async def handler(websocket):
    await asyncio.gather(consumer_handler(websocket), producer_handler(websocket))


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
