"use client";

import { useState, useEffect, useRef } from "react";
import MissionHeader from "@/components/dashboard/MissionHeader";
import ExecutionTarget from "@/components/dashboard/ExecutionTarget";
import AgentWarRoom, { LogItem } from "@/components/dashboard/AgentWarRoom";
import CodeEditor from "@/components/dashboard/CodeEditor";

const INITIAL_CODE = `const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

let isCrashed = false;

// Middleware
app.use(express.json());
app.use(cors());

// Healthy endpoint
app.get('/api/health', (req, res) => {
  if (isCrashed) {
    return res.status(500).json({ status: 'error', message: 'Server is in crashed state' });
  }
  res.json({ status: 'ok' });
});

// Target endpoint with intentional bug
app.post('/api/register', (req, res, next) => {
  try {
    if (req.body.crash === true) {
      throw new Error('FATAL: Intentional massive memory error to simulate a server crash');
    }
    res.json({ success: true, message: 'Registered successfully' });
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  isCrashed = true;
  console.error('Server crashed:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: err.stack
  });
});

app.listen(port, () => {
  console.log(\`Victim backend listening on port \${port}\`);
});`;

export default function DemoPage() {
  const [status, setStatus] = useState<"HEALTHY" | "CRASHED" | "RESTORED">("HEALTHY");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [incomingCode, setIncomingCode] = useState<string>("");
  const [displayedCode, setDisplayedCode] = useState<string>(INITIAL_CODE);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [recoveryTime, setRecoveryTime] = useState<string | null>(null);

  const crashTimeRef = useRef<number | null>(null);

  // 1. Raw WebSocket Client Hook
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocketConnected(true);
      setLogs((prev) => [
        ...prev,
        {
          agent: "System",
          msg: `Connected to Orchestrator at ${wsUrl}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    ws.onclose = () => {
      setSocketConnected(false);
      setLogs((prev) => [
        ...prev,
        {
          agent: "System",
          msg: "Disconnected from Orchestrator",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.event === "crash" || parsed.type === "crash") {
          setStatus("CRASHED");
          setRecoveryTime(null);
          crashTimeRef.current = Date.now();
        }
        if (parsed.event === "restored" || parsed.type === "restored") {
          setStatus("RESTORED");
          if (crashTimeRef.current) {
            const elapsed = ((Date.now() - crashTimeRef.current) / 1000).toFixed(1);
            setRecoveryTime(`${elapsed}s`);
            crashTimeRef.current = null;
          }
        }
        if (parsed.event === "log" || parsed.type === "log") {
          const msg = parsed.msg || parsed.message || parsed.log || parsed.payload || "";
          const agent = parsed.agent || "System";
          setLogs((prev) => [
            ...prev,
            {
              agent,
              msg,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
        if (parsed.event === "code" || parsed.type === "code") {
          const codeString = parsed.data || parsed.code || parsed.payload || "";
          setIncomingCode(codeString);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // 2. Typewriter Effect for Source Code X-Ray
  useEffect(() => {
    if (!incomingCode) return;

    setIsTyping(true);
    setDisplayedCode("");
    let index = 0;

    const interval = setInterval(() => {
      index += 5; // type faster for real diff flow
      if (index >= incomingCode.length) {
        setDisplayedCode(incomingCode);
        clearInterval(interval);
        setIsTyping(false);
      } else {
        setDisplayedCode(incomingCode.slice(0, index));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [incomingCode]);

  const handleRegister = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crash: true }),
      });

      if (!res.ok) {
        setStatus("CRASHED");
        setRecoveryTime(null);
        crashTimeRef.current = Date.now();
      }
    } catch (error) {
      console.error("Backend unreachable", error);
      setStatus("CRASHED");
      setRecoveryTime(null);
      crashTimeRef.current = Date.now();
    }
  };

  return (
    <div className="h-screen w-screen bg-[#05070f] text-slate-200 overflow-hidden flex flex-col p-4 select-none relative font-sans">
      
      {/* Calm, Static Observability Background Details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0e17_1px,transparent_1px),linear-gradient(to_bottom,#0c0e17_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40 z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none z-0" />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* Global Mission Header */}
        <MissionHeader
          status={status}
          socketConnected={socketConnected}
          recoveryTime={recoveryTime}
        />

        {/* 2-Column Dashboard Workspace */}
        <main className="flex-1 grid grid-cols-2 gap-6 overflow-hidden min-h-0 pb-4 mt-6">
          
          {/* Left Column (50% width) - Hosted Repository Preview */}
          <div className="flex flex-col overflow-hidden h-full min-h-0">
            <ExecutionTarget
              status={status}
              handleRegister={handleRegister}
            />
          </div>

          {/* Right Column (50% width) - Intelligence Area */}
          <div className="flex flex-col gap-6 overflow-hidden h-full min-h-0">
            
            {/* Upper Right (50% height): Agent War Room */}
            <div className="h-1/2 flex flex-col min-h-0">
              <AgentWarRoom logs={logs} />
            </div>

            {/* Lower Right (50% height): Code Editor */}
            <div className="h-1/2 flex flex-col min-h-0">
              <CodeEditor
                status={status}
                displayedCode={displayedCode}
                isTyping={isTyping}
              />
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
