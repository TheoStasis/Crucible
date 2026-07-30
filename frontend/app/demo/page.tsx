"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { io, Socket } from "socket.io-client";

export default function DemoPage() {
  const [status, setStatus] = useState<"HEALTHY" | "CRASHED" | "RESTORED">("HEALTHY");
  const [logs, setLogs] = useState<string[]>([]);
  const [incomingCode, setIncomingCode] = useState<string>("");
  const [displayedCode, setDisplayedCode] = useState<string>(
    "// Live telemetry standby...\n// Waiting for connection to backend/server.js"
  );
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // 1. Socket.io Client Hook
  useEffect(() => {
    const socket: Socket = io("ws://localhost:8080", {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socket.on("connect", () => {
      setSocketConnected(true);
      setLogs((prev) => [...prev, "[System] Connected to Orchestrator at ws://localhost:8080"]);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      setLogs((prev) => [...prev, "[System] Disconnected from Orchestrator"]);
    });

    socket.on("crash", () => {
      setStatus("CRASHED");
    });

    socket.on("log", (payload: any) => {
      const message =
        typeof payload === "string"
          ? payload
          : payload?.message || payload?.log || JSON.stringify(payload);
      setLogs((prev) => [...prev, message]);
    });

    socket.on("code", (payload: any) => {
      const codeString =
        typeof payload === "string"
          ? payload
          : payload?.code || String(payload);
      setIncomingCode(codeString);
    });

    socket.on("restored", () => {
      setStatus("RESTORED");
    });

    // Fallback for generic JSON event messages
    socket.on("message", (data: any) => {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (parsed.event === "crash" || parsed.type === "crash") setStatus("CRASHED");
        if (parsed.event === "restored" || parsed.type === "restored") setStatus("RESTORED");
        if (parsed.event === "log" || parsed.type === "log") {
          setLogs((prev) => [
            ...prev,
            parsed.payload || parsed.message || parsed.log || String(parsed),
          ]);
        }
        if (parsed.event === "code" || parsed.type === "code") {
          setIncomingCode(parsed.payload || parsed.code || String(parsed));
        }
      } catch {
        if (typeof data === "string") {
          setLogs((prev) => [...prev, data]);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Auto-scroll War Room logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // 2. Typewriter Effect for Source Code X-Ray
  useEffect(() => {
    if (!incomingCode) return;

    setIsTyping(true);
    setDisplayedCode("");
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setDisplayedCode(incomingCode.slice(0, index));
      if (index >= incomingCode.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);

    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [incomingCode]);

  // Auto-scroll code container while typing
  useEffect(() => {
    if (codeContainerRef.current) {
      codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
    }
  }, [displayedCode]);

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crash: true }),
      });

      if (!res.ok) {
        setStatus("CRASHED");
      }
    } catch (error) {
      console.error("Backend unreachable", error);
      setStatus("CRASHED");
    }
  };

  // Smooth Awwwards-style Ambient Border & Card Lighting
  const paneBorderVariants: Variants = {
    HEALTHY: {
      borderColor: "rgba(255, 255, 255, 0.08)",
      boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
    CRASHED: {
      borderColor: "rgba(244, 63, 94, 0.6)",
      boxShadow: "0 0 50px -10px rgba(244, 63, 94, 0.3)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
    RESTORED: {
      borderColor: "rgba(16, 185, 129, 0.7)",
      boxShadow: "0 0 50px -10px rgba(16, 185, 129, 0.35)",
      transition: { type: "spring", stiffness: 200, damping: 22 },
    },
  };

  const formatLogMessage = (log: string) => {
    if (log.startsWith("[Watcher]")) {
      return (
        <span className="flex items-center space-x-2">
          <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded tracking-wider uppercase">
            WATCHER
          </span>
          <span className="text-slate-300 font-mono">{log.replace("[Watcher]", "").trim()}</span>
        </span>
      );
    }
    if (log.startsWith("[Agent]") || log.startsWith("[LLM]")) {
      return (
        <span className="flex items-center space-x-2">
          <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded tracking-wider uppercase">
            AI AGENT
          </span>
          <span className="text-slate-200 font-mono">
            {log.replace(/\[Agent\]|\[LLM\]/, "").trim()}
          </span>
        </span>
      );
    }
    if (log.startsWith("[Patch]")) {
      return (
        <span className="flex items-center space-x-2">
          <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded tracking-wider uppercase">
            PATCH
          </span>
          <span className="text-emerald-200 font-mono">{log.replace("[Patch]", "").trim()}</span>
        </span>
      );
    }
    if (log.startsWith("[System]")) {
      return (
        <span className="flex items-center space-x-2">
          <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-1.5 py-0.5 rounded tracking-wider uppercase">
            SYSTEM
          </span>
          <span className="text-slate-400 font-mono">{log.replace("[System]", "").trim()}</span>
        </span>
      );
    }
    return <span className="text-slate-300 font-mono">{log}</span>;
  };

  const codeLines = displayedCode.split("\n");

  return (
    <div className="h-screen w-screen bg-[#05070f] text-slate-200 overflow-hidden flex flex-col p-4 select-none bg-grid-pattern relative">
      
      {/* Ambient background blur orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      {status === "CRASHED" && (
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-rose-600/15 blur-[150px] pointer-events-none transition-all duration-700" />
      )}

      {/* TOP AWWWARDS HEADER BAR */}
      <header className="h-14 border border-white/10 rounded-2xl bg-slate-950/60 backdrop-blur-xl px-5 mb-4 flex items-center justify-between shadow-2xl relative z-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  status === "CRASHED" ? "bg-rose-500" : "bg-emerald-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  status === "CRASHED" ? "bg-rose-500" : "bg-emerald-500"
                }`}
              />
            </div>
            <span className="font-extrabold text-lg tracking-widest text-white uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-mono">
              Crucible
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          <span className="text-[11px] text-slate-400 font-mono tracking-wider uppercase hidden sm:inline-block">
            Self-Healing Infra Autopsy Dashboard
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          {/* WebSocket Status Indicator */}
          <div className="flex items-center space-x-2 bg-slate-900/80 border border-white/5 px-3 py-1.5 rounded-xl">
            <span
              className={`h-2 w-2 rounded-full ${
                socketConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="text-slate-400 text-[11px]">
              {socketConnected ? "WS ONLINE" : "WS CONNECTING..."}
            </span>
          </div>

          {/* Node Target Chip */}
          <div className="hidden md:flex items-center space-x-2 bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-indigo-300 text-[11px]">
            <span>NODE: node-prod-ap-south-1</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID: 12 COLUMNS */}
      <main className="flex-1 grid grid-cols-12 gap-4 overflow-hidden relative z-10">
        
        {/* PANE 1: The Victim App (Left 50% - 6 Columns) */}
        <motion.section
          animate={status}
          variants={paneBorderVariants}
          className="col-span-6 border rounded-2xl bg-slate-950/40 backdrop-blur-2xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl transition-colors duration-500"
        >
          {/* Translucent Overlay */}
          <AnimatePresence>
            {status === "CRASHED" && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-50 bg-rose-950/75 flex flex-col items-center justify-center p-8 border border-rose-500/40 rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex flex-col items-center max-w-md text-center space-y-4"
                >
                  <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/50">
                    <svg
                      className="w-7 h-7 animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-900/40 border border-rose-700/40 px-3 py-1 rounded-full">
                      CRITICAL RUNTIME EXCEPTION
                    </span>
                    <h1 className="text-3xl font-extrabold text-white mt-3 tracking-tight font-sans">
                      SYSTEM_FAILURE
                    </h1>
                    <p className="text-xs text-rose-200/80 mt-2 leading-relaxed font-mono">
                      HTTP 500: Unhandled server fault detected. AI Agent War Room is diagnosing and compiling hotpatch...
                    </p>
                  </div>

                  {/* Pulsing loading bar */}
                  <div className="w-full bg-rose-950 border border-rose-800/50 rounded-full h-1.5 overflow-hidden mt-2">
                    <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full w-full animate-pulse" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pane Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                01
              </div>
              <div>
                <span className="font-bold text-sm text-white tracking-wide uppercase font-mono">
                  Crucible Registration Portal
                </span>
                <p className="text-[11px] text-slate-400">Target Application Environment</p>
              </div>
            </div>

            {/* Dynamic Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 ${
                status === "HEALTHY"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : status === "CRASHED"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.25)]"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              }`}
            >
              ● {status}
            </span>
          </div>

          {/* Registration Form UI */}
          <div className="my-auto space-y-6 max-w-md mx-auto w-full py-6">
            <div>
              <span className="text-xs font-mono font-semibold text-indigo-400 tracking-wider uppercase">
                Student Portal
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Fall 2026 Course Select
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select a course module to dispatch registration payload.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-300 font-mono uppercase tracking-wider font-medium">
                Available Course Modules
              </label>
              <div className="relative">
                <select className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono appearance-none cursor-pointer">
                  <option>CSE3001 - Advanced Data Structures</option>
                  <option>CSE4002 - Distributed Systems & Cloud</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={status === "CRASHED"}
              className={`w-full font-bold py-4 rounded-xl font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-xl ${
                status === "RESTORED"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-950/50 border border-emerald-400/40 active:scale-[0.98]"
                  : status === "CRASHED"
                  ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-950/50 border border-indigo-400/20 active:scale-[0.98]"
              }`}
            >
              {status === "RESTORED" ? "System Restored • Register" : "Register Now"}
            </button>
          </div>

          <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Victim Endpoint: http://localhost:3001/api/register</span>
            <span className="text-slate-400">Status Code: {status === "CRASHED" ? "500 Internal Error" : "200 OK"}</span>
          </div>
        </motion.section>

        {/* RIGHT COLUMN (6 Columns split into 2 Rows) */}
        <div className="col-span-6 grid grid-rows-2 gap-4 h-full overflow-hidden">
          
          {/* PANE 2: Agent War Room (Top Right 25%) */}
          <section className="border border-white/10 rounded-2xl bg-slate-950/60 backdrop-blur-2xl p-4 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="flex items-center space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-3 w-[1px] bg-slate-800 mx-1" />
                <span className="text-xs font-bold text-amber-400 tracking-widest uppercase font-mono">
                  Agent War Room
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-500 font-mono bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md">
                  {logs.length} TELEMETRY EVENTS
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xs italic">
                  <span>{">"} Awaiting WebSocket telemetry connection...</span>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg bg-slate-900/40 border border-white/[0.03] hover:border-white/10 transition-colors"
                  >
                    {formatLogMessage(log)}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </section>

          {/* PANE 3: Source Code X-Ray (Bottom Right 25%) */}
          <section className="border border-white/10 rounded-2xl bg-slate-950/60 backdrop-blur-2xl p-4 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase font-mono">
                  Source Code X-Ray
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {isTyping && (
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-md animate-pulse">
                    AI PATCHING...
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2.5 py-0.5 rounded-md border border-white/5">
                  backend/server.js
                </span>
              </div>
            </div>

            <div
              ref={codeContainerRef}
              className="flex-1 overflow-y-auto bg-[#070913] rounded-xl p-4 border border-white/5 font-mono text-xs relative flex"
            >
              {/* Code Line Numbers */}
              <div className="select-none text-slate-600 pr-4 text-right font-mono text-[11px] leading-relaxed border-r border-white/5 mr-4 min-w-[2rem]">
                {codeLines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code Output */}
              <div className="flex-1 overflow-x-auto">
                <pre className="text-emerald-300/90 whitespace-pre-wrap leading-relaxed">
                  <code>{displayedCode}</code>
                  {isTyping && (
                    <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle shadow-[0_0_8px_#22d3ee]" />
                  )}
                </pre>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
