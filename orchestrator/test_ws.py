import asyncio
import websockets
import json

async def listen():
    url = "ws://localhost:8081"
    print(f"Connecting to WebSocket bridge at {url}...")
    try:
        async with websockets.connect(url) as websocket:
            print("Connected! Waiting for telemetry events...\n")
            while True:
                message = await websocket.recv()
                data = json.loads(message)
                print(f"🔵 RECEIVED EVENT: {data['event']}")
                print(f"   Payload: {json.dumps(data, indent=2)}\n")
    except Exception as e:
        print(f"Connection closed or failed: {e}")

if __name__ == "__main__":
    asyncio.run(listen())
