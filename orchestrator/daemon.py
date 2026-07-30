import asyncio
import json
import os
import re
import requests
import websockets
from dotenv import load_dotenv
from groq import AsyncGroq

# Load environment variables
load_dotenv()

# Initialize Async Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not found in .env")

client = AsyncGroq(api_key=GROQ_API_KEY)

# Global set of connected websocket clients
connected_clients = set()

async def ws_handler(websocket):
    """Handles incoming WebSocket connections and client actions."""
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                if data.get("action") == "reset":
                    print("Received reset request from client. Re-arming the bug...")
                    backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
                    source = os.path.join(backend_dir, "server.broken.js")
                    dest = os.path.join(backend_dir, "server.js")
                    try:
                        import shutil
                        shutil.copyfile(source, dest)
                        print("Bug re-armed successfully.")
                        # Broadcast log to all clients
                        await broadcast({"event": "log", "agent": "System", "msg": "Victim server re-armed and reset to broken state."})
                    except Exception as e:
                        print(f"Failed to copy file: {e}")
            except Exception as e:
                print(f"Error handling message: {e}")
    except websockets.ConnectionClosed:
        pass
    finally:
        connected_clients.remove(websocket)

async def broadcast(message_dict):
    """Broadcasts a JSON message to all connected WebSocket clients."""
    if not connected_clients:
        return
    message_json = json.dumps(message_dict)
    
    # Send to all connected clients
    for ws in list(connected_clients):
        try:
            await ws.send(message_json)
        except Exception as e:
            print(f"Error sending to client: {e}")

def sanitize_code(raw_output):
    """Robustly extract JavaScript code from Groq output, ignoring conversational text."""
    # Try to extract code block if it exists (handles ```javascript ... ``` and trailing text)
    match = re.search(r'```(?:javascript|js)?\n(.*?)```', raw_output, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    
    # Fallback if no backticks were used, just strip whitespace
    return raw_output.strip()

async def check_health():
    """Runs synchronous requests.get inside a thread pool to prevent blocking asyncio loop."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        None, 
        lambda: requests.get("http://localhost:3001/api/health", timeout=1.5)
    )

async def trigger_recovery():
    print("Initiating AI Recovery Sequence...")
    # When crash detected
    await broadcast({"event": "crash"})
    
    # During Prompt 1
    await broadcast({"event": "log", "agent": "Watcher", "msg": "500 Error Detected."})
    
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "server.js"))
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            broken_code = f.read()
    except Exception as e:
        print(f"Failed to read server.js: {e}")
        return

    # Prompt 1: Diagnoser
    try:
        prompt1 = f"Analyze this Node.js code, find the intentional crash, and explain the bug in one sentence.\n\nCode:\n{broken_code}"
        diag_resp = await client.chat.completions.create(
            messages=[{"role": "user", "content": prompt1}],
            model="llama-3.1-8b-instant",
        )
        explanation = diag_resp.choices[0].message.content.strip()
    except Exception as e:
        explanation = f"Failed to diagnose: {e}"
        
    # After Prompt 1
    await broadcast({"event": "log", "agent": "Diagnoser", "msg": explanation})
    
    # During Prompt 2 (Before Prompt 2 is sent)
    await broadcast({"event": "log", "agent": "Healer", "msg": "Compiling patch..."})
    
    # Prompt 2: Healer
    try:
        prompt2 = f"Rewrite this entire code to fix the bug. Output ONLY raw javascript. No markdown formatting or backticks.\n\nCode:\n{broken_code}"
        heal_resp = await client.chat.completions.create(
            messages=[{"role": "user", "content": prompt2}],
            model="llama-3.1-8b-instant",
        )
        raw_patch = heal_resp.choices[0].message.content
    except Exception as e:
        print(f"Failed to generate patch: {e}")
        return

    # Apply strict regex sanitizer
    sanitized_patch = sanitize_code(raw_patch)
    
    # After Prompt 2
    await broadcast({"event": "code", "data": sanitized_patch})
    
    # Overwrite the file with the sanitized code
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(sanitized_patch)
        print("Patch applied to server.js successfully.")
    except Exception as e:
        print(f"Failed to write patch: {e}")
        return

    # Wait for nodemon to restart the server
    await asyncio.sleep(2)
    
    # After writing the file and waiting 2 seconds for nodemon to restart
    await broadcast({"event": "restored"})
    
    # Wait a bit longer before resuming polling to prevent immediate re-triggering while nodemon is still booting
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
        
        await asyncio.sleep(2)

async def main():
    # Initialize asynchronous websockets server on localhost:8080
    print("Starting Crucible Orchestrator WebSocket server on ws://localhost:8080...")
    
    # Start WS server (accepts CORS from localhost:3000 by default)
    async with websockets.serve(ws_handler, "localhost", 8080):
        print("Starting health polling engine...")
        await poll_health()

if __name__ == "__main__":
    asyncio.run(main())
