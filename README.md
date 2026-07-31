# 🔥 Crucible — Autonomous Self-Healing Infrastructure

**Team ICEMEN** · Track 4 — Open Innovation / Emerging Technologies

> **One-sentence pitch:** Crucible is a live chaos-engineering platform that intentionally crashes a running backend, autonomously detects the failure, diagnoses the root cause with an LLM-driven agent pipeline, generates a source-level patch, and hot-restarts the service — typically in under 10 seconds — while streaming the entire incident lifecycle to a real-time dashboard.

---

## 🚨 The Problem

Campus portals and other bursty internal services (course registration, ticketing, exam windows) tend to fall over exactly when load spikes — and recovery usually means someone on-call manually reading stack traces at 2 AM. Crucible explores how far you can push an **autonomous, self-healing recovery loop** so that a class of runtime failures gets diagnosed and patched without a human in the loop at all.

**Target users:** University IT admins, DevOps/SRE teams, and anyone running a high-availability service on a small ops budget.

---

## 🧠 How It Works — The Agent Pipeline

Crucible runs a small **agent swarm**, each with a single responsibility, coordinated through a finite-state incident lifecycle:

```
[Reset/Import] → [Trigger Chaos Failure] → [Watcher Detects Outage]
       → [Diagnoser Explains the Bug] → [Healer Generates a Patch]
       → [Hotpatch Written to Disk] → [Auto-Restart] → [Recovery Confirmed]
```

| Agent | Role |
|---|---|
| **Watcher** | Polls `/api/health` on a tight interval, detects the outage, and kicks off the recovery state machine. |
| **Diagnoser** | Pulls the live (broken) source file, sends it to an LLM (Llama 3.1 via Groq), and produces a human-readable incident writeup streamed live to the dashboard. |
| **Healer** | Asks the LLM to rewrite the offending source file so the failure class can't recur, while preserving existing logic/behavior. |
| **Hotpatcher** | Writes the new source directly to disk inside the running sandbox; the process supervisor (`nodemon`) picks up the change and hot-restarts with no full redeploy. |

### Demo Flow

1. Hit **"Complete Registration"** on the dashboard — this sends `crash: true` to `/api/register`.
2. The Express backend throws a fatal exception, goes offline, and starts returning `500`.
3. The **Watcher** notices the failed health check within seconds and flags the incident.
4. The **Diagnoser** fetches the broken file and streams a live root-cause analysis to the dashboard log panel.
5. The **Healer** produces a rewritten version of the file and hands it off for hotpatching.
6. The new code is written straight to `server.js`; the dashboard shows a typewriter-style live diff of the incoming patch.
7. `nodemon` detects the file change and performs a zero-downtime restart.
8. The **Watcher** confirms `/api/health` is back to `200 OK`; the dashboard flips to **Healthy** and logs the recovery duration (typically **5–10 seconds**).

---

## 🏗️ Architecture

```
                          ┌───────────────────────────┐
                          │      Next.js Frontend      │
                          │   (Dashboard / Live Logs)  │
                          └───────────────────────────┘
                                 │             ▲
                         API HTTP│             │ WebSocket
                         Requests│             │ (live incident stream)
                                 ▼             ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │ Containerized Runtime (local / Railway)                                │
  │                                                                        │
  │     ┌───────────────┐    /api/*    ┌────────────────────────┐         │
  │     │  Gateway.js   │ ───────────► │ Node.js / Express        │         │
  │     │ (Traffic      │              │ Backend  (Port 3001)     │         │
  │     │  Multiplexer, │ ── WS ────►  │ "The Victim Service"     │         │
  │     │  Port 80)     │              └────────────────────────┘         │
  │     └───────────────┘                     ▲                            │
  │            ▲                              │ Health Checks              │
  │            │ WebSocket                    │                            │
  │            ▼                              ▼                            │
  │     ┌─────────────────────────────────────────────────────────────┐    │
  │     │ Python Orchestrator (daemon.py, Port 5001)                  │    │
  │     │  • Async WebSocket server — streams state to the dashboard  │    │
  │     │  • Health-poll loop (Watcher)                                │    │
  │     │  • LLM client — Groq / Llama 3.1 (Diagnoser + Healer)        │    │
  │     │  • Disk hotpatch writer                                      │    │
  │     └─────────────────────────────────────────────────────────────┘    │
  └────────────────────────────────────────────────────────────────────────┘
```

- **Frontend** — Next.js, TypeScript, Tailwind CSS, Framer Motion. Renders the live incident dashboard, streaming diagnosis logs, and the patch diff viewer.
- **Backend ("victim service")** — Node.js/Express, the sandboxed target service that gets crashed and patched. Supervised by `nodemon` so file overwrites trigger an instant restart.
- **Orchestrator** — Python (`asyncio` + `websockets`), the brain of the operation: polls health, calls the LLM, and writes patches to disk.
- **Gateway** — a lightweight Node proxy that multiplexes public HTTP/WebSocket traffic to the backend (`3001`) and orchestrator (`5001`) behind a single port, for simple single-container deployment.

---

## ⚠️ Safety Model (current vs. planned)

The riskiest part of "let an LLM rewrite your running server" is obviously the LLM writing something worse than what it fixed. Right now, safety is scoped intentionally:

- **Current:** Crucible is run against a deliberately small, sandboxed victim service with a controllable, reproducible failure mode — not a general production app. This keeps the blast radius of a bad patch limited and the demo deterministic.
- **Planned (not yet implemented):** an automated regression-testing gate (e.g. via **Keploy**) that replays a recorded API test suite against every candidate patch before it's allowed to take live traffic, plus a bounded retry budget — if the Healer can't produce a passing patch within a few attempts, the system rolls back to the last known-good commit and pages a human instead of continuing to guess.

We think that gate is the single most important thing standing between "cute demo" and "something you'd actually trust in production," and it's next on the roadmap.

---

## 🚀 Running Locally

Open three terminals:

### 1. Express Backend (the victim service)
```bash
cd backend
npm install
npm start
```
Runs at `http://localhost:3001`

### 2. Python Orchestrator
Create a `.env` file under `/orchestrator`:
```env
GROQ_API_KEY=your-gsk-key-here
```
Then:
```bash
cd orchestrator
python -m venv .venv
source .venv/bin/activate       # macOS/Linux
# .venv\Scripts\activate        # Windows

pip install -r requirements.txt
python daemon.py
```
Starts the WebSocket orchestrator on `ws://localhost:5001`

### 3. Dashboard
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:3000`

---

## 🐳 Docker / Production

Crucible ships as a single container bundling the gateway, backend, and orchestrator.

```bash
docker build -t crucible .
docker run -p 8080:80 -e GROQ_API_KEY="your-gsk-key-here" crucible
```

The container listens on `8080` (mapped to the internal Gateway on port `80`), which multiplexes traffic to the backend and orchestrator internally.

### Environment Variables

| Variable | Required By | Description |
|---|---|---|
| `GROQ_API_KEY` | Backend / Orchestrator | Groq Cloud API key for LLM inference (`gsk_...`) |
| `NEXT_PUBLIC_API_URL` | Frontend | Public URL of the deployed app |
| `NEXT_PUBLIC_WS_URL` | Frontend | WebSocket URL of the deployed app |

---

## 🗺️ Roadmap

- [ ] Automated regression-test gate before any patch takes live traffic (Keploy or equivalent)
- [ ] Bounded retry + automatic rollback to last stable Git commit on repeated Healer failure
- [ ] Broader failure-class coverage beyond the current demo scenario
- [ ] Framework-agnostic patch targets (beyond the current Express sandbox)

---

## 📚 References

- *Site Reliability Engineering*, Niall Richard Murphy et al. (O'Reilly Media)
- Next.js & Framer Motion documentation
- Groq API documentation

---

*Built for hackathons by Team ICEMEN.*