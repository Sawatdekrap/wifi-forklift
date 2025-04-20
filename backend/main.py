import asyncio
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


async def main():
    async with serve(handler, "localhost", 8765) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
