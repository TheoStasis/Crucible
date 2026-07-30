import asyncio
import json
import os
import re
import requests
import websockets
from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not found in .env")

# Initialize Async Groq client
client = AsyncGroq(api_key=GROQ_API_KEY)

# Global list of connected websocket clients
connected_clients = set()

async def ws_handler(websocket):
    """Handles incoming WebSocket connections."""
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)

async def broadcast(message_dict):
    """Broadcasts a JSON message to all connected WebSocket clients."""
    if not connected_clients:
        return
    message_json = json.dumps(message_dict)
    for ws in list(connected_clients):
        try:
            await ws.send(message_json)
        except Exception as e:
            print(f"Error sending to client: {e}")

def sanitize_code(raw_output):
    """Aggressively strip ```javascript, ```js, and ``` from Groq output."""
    sanitized = re.sub(r'```(?:javascript|js)?\n?', '', raw_output, flags=re.IGNORECASE)
    sanitized = re.sub(r'```', '', sanitized)
    return sanitized.strip()

async def check_health():
    """Runs synchronous requests.get inside a thread pool so it doesn't block asyncio loop."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, lambda: requests.get("http://localhost:3001/api/health", timeout=1.5))

async def trigger_recovery():
    print("Initiating AI Recovery Sequence...")
    await broadcast({"event": "crash"})
    await broadcast({"event": "log", "agent": "Watcher", "msg": "500 Error Detected."})
    
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "server.js"))
    
    try:
        with open(file_path, "r") as f:
            broken_code = f.read()
    except Exception as e:
        print(f"Failed to read server.js: {e}")
        return

    # Prompt 1: Diagnoser
    try:
        diag_resp = await client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"Analyze this Node.js code, find the intentional crash, and explain the bug in one sentence.\n\nCode:\n{broken_code}"
                }
            ],
            model="llama3-8b-8192", 
        )
        explanation = diag_resp.choices[0].message.content.strip()
    except Exception as e:
        explanation = f"Failed to diagnose: {e}"
        
    await broadcast({"event": "log", "agent": "Diagnoser", "msg": explanation})
    
    # Prompt 2: Healer
    await broadcast({"event": "log", "agent": "Healer", "msg": "Compiling patch..."})
    
    try:
        heal_resp = await client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"Rewrite this entire code to fix the bug. Output ONLY raw javascript. No markdown formatting or backticks.\n\nCode:\n{broken_code}"
                }
            ],
            model="llama3-8b-8192",
        )
        raw_patch = heal_resp.choices[0].message.content
    except Exception as e:
        print(f"Failed to generate patch: {e}")
        return

    sanitized_patch = sanitize_code(raw_patch)
    
    await broadcast({"event": "code", "data": sanitized_patch})
    
    # Write the fixed code to server.js
    try:
        with open(file_path, "w") as f:
            f.write(sanitized_patch)
        print("Patch applied to server.js successfully.")
    except Exception as e:
        print(f"Failed to write patch: {e}")
        return

    # Wait for nodemon to restart the server
    await asyncio.sleep(2)
    
    await broadcast({"event": "restored"})
    
    # Wait a bit longer before resuming polling to prevent instant double-triggers
    await asyncio.sleep(3)

async def poll_health():
    """Continuously pings the backend every 2 seconds."""
    while True:
        try:
            response = await check_health()
            if response.status_code == 500:
                print("500 Error Detected!")
                await trigger_recovery()
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            print(f"Server unreachable or timeout: {e}")
            await trigger_recovery()
        
        await asyncio.sleep(2)

async def main():
    print("Starting Crucible Orchestrator WebSocket server on ws://localhost:8081...")
    async with websockets.serve(ws_handler, "localhost", 8081):
        print("Starting health polling engine...")
        await poll_health()

if __name__ == "__main__":
    asyncio.run(main())
