# Crucible — Hackathon Explanation

> **One-line pitch:** Crucible is a live chaos engineering and AI auto-healing platform that intentionally crashes a real backend server, diagnoses the bug using an LLM, and writes a working patch — all in under 10 seconds, streamed live to a dashboard.

---

## What We Built

Most debugging tools help developers find bugs *after the fact*. We built something different.

**Crucible** is a real-time incident response system that:

1. **Intentionally breaks** a running Node.js server
2. **Automatically detects** the crash (no human involved)
3. **Diagnoses the root cause** using a live AI model (Llama 3.1 via Groq)
4. **Generates and applies a hotpatch** directly to the source file
5. **Reboots the server** and confirms recovery — all in one seamless loop

This is not a mock or simulation. Every part of the stack is real and running on localhost during the demo.

---

## The Demo Flow (What Judges See)

```
Landing Page → Import Repository → Mission Control Dashboard
```

1. **Landing page** — The user pastes a GitHub repo URL and clicks "Import Repository"
2. **Provisioning screen** — A fake sandbox spins up (with real-looking steps)
3. **Mission Control Dashboard** loads with:
   - A live WebSocket connection to the orchestrator
   - A code editor showing the actual `server.js` file
   - An Agent War Room showing live AI logs
   - A Mission Lifecycle timeline
4. User clicks **"Trigger Chaos Failure"** — this hits the backend with `{ crash: true }`
5. The backend throws an unhandled exception and returns HTTP 500
6. The **Watcher agent** detects the 500 within 2 seconds
7. The **Diagnoser agent** (Llama 3.1) analyzes `server.js` and explains the bug in plain English
8. The **Healer agent** (Llama 3.1) rewrites the entire file with the bug fixed
9. The patched code streams live into the dashboard code editor (typewriter effect)
10. nodemon detects the file change and reboots the server automatically
11. Dashboard transitions to **"System Healthy"** — recovery complete

The whole cycle takes **roughly 8–15 seconds**.

---

## Architecture

```
┌─────────────────┐        HTTP POST          ┌──────────────────────┐
│  Next.js        │ ─── /api/register ──────► │  Node.js Backend     │
│  Frontend       │     { crash: true }        │  (Express, port 3001)│
│  (port 3000)    │                            │                      │
│                 │◄── WebSocket events ──────►│  /api/health         │
└─────────────────┘    ws://localhost:8080      └──────────────────────┘
         │                    │                          ▲
         │                    │                          │ polls every 2s
         │             ┌──────┴──────────────────────────┤
         │             │  Python Orchestrator (daemon.py) │
         │             │  - WebSocket server :8080         │
         │             │  - Health poller                  │
         │             │  - Groq / Llama 3.1 calls        │
         │             │  - File writer (hotpatch)         │
         └─────────────└──────────────────────────────────┘
```

**Three services run simultaneously:**

| Service | Tech | Port | Role |
|---------|------|------|------|
| Frontend | Next.js 16, TypeScript, Tailwind, Framer Motion | 3000 | UI + WebSocket client |
| Backend | Node.js, Express, nodemon | 3001 | Victim server (intentionally broken) |
| Orchestrator | Python, asyncio, websockets, Groq SDK | 8080 | Brain — watches, diagnoses, heals |

---

## Key Files to Show

| File | What It Does |
|------|-------------|
| `backend/server.js` | The victim server. Contains the intentional bug (`crash: true` path). nodemon watches this file. |
| `backend/server.broken.js` | The *permanently broken* template. Copied back to `server.js` each time the demo resets. |
| `orchestrator/daemon.py` | The entire AI orchestration loop — health polling, LLM calls, file patching, WebSocket broadcasting. |
| `frontend/app/demo/page.tsx` | The Mission Control dashboard page. Connects to WebSocket, drives all state transitions. |
| `frontend/components/dashboard/` | Modular dashboard components: Header, Timeline, Agent War Room, Code Editor, Incident Summary. |
| `frontend/components/provisioning/ProvisioningCard.tsx` | On import, sends `{ action: "reset" }` to the orchestrator to re-arm the bug before each demo. |

---

## The AI Part (Most Important for Judges)

We use **Groq's API** (ultra-fast LLM inference) with **Llama 3.1 8B Instant**.

Two sequential prompts are fired:

**Prompt 1 — Diagnoser:**
```
Analyze this Node.js code, find the intentional crash,
and explain the bug in one sentence.
```
→ Output is broadcast as a log message in the Agent War Room.

**Prompt 2 — Healer:**
```
Rewrite this entire code to fix the bug.
Output ONLY raw JavaScript. No markdown.
```
→ The rewritten file is written directly to `backend/server.js`.  
→ nodemon picks it up and restarts the server automatically.

The AI literally *writes and deploys its own fix* with no human in the loop.

---

## How to Run It

**Three terminals, in order:**

```bash
# Terminal 1 — Backend
cd backend
npm install
npm start

# Terminal 2 — Orchestrator
cd orchestrator
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
python daemon.py

# Terminal 3 — Frontend
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000`.

**To reset the demo** (re-arm the bug):
```bash
# Windows
cd backend
reset.bat
```
Or just click "Import Repository" on the landing page — it resets automatically via WebSocket.

---

## Why This Is Hard / What Makes It Interesting

- **Full autonomous loop** — no human triggers the fix. The AI detects, diagnoses, patches, and reboots.
- **Real file system mutation** — the Python daemon writes directly to `server.js`. This is a real hotpatch.
- **Live streaming** — the patched code appears character-by-character in the dashboard using a typewriter effect streamed over WebSocket.
- **Self-resetting** — every demo run re-arms the exact same bug so it can be shown repeatedly.
- **No Docker, no cloud** — everything runs locally in 3 terminal windows.

---

## Tech Stack Summary

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, nodemon |
| Orchestrator | Python 3, asyncio, websockets, requests |
| AI Model | Llama 3.1 8B Instant (via Groq Cloud) |
| Real-time | Native WebSocket (no Socket.IO) |

---

*Built for hackathon by Team Crucible.*
