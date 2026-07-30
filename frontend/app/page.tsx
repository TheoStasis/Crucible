"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<"HEALTHY" | "CRASHED">("HEALTHY");
  const [logs, setLogs] = useState<string[]>([]);
  const [code, setCode] = useState<string>("// Live telemetry standby...\n// Waiting for connection to backend/server.js");

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

  return (
    <main className="h-screen w-screen bg-slate-950 text-slate-300 overflow-hidden grid grid-cols-12 gap-4 p-4 font-mono">
      
      {/* PANE 1: The Victim App (Left - 6 columns) */}
      <section className="col-span-6 border border-slate-800 rounded-xl bg-slate-900/40 p-6 relative flex flex-col justify-between">
        
        {/* Basic Error State Overlay */}
        {status === "CRASHED" && (
          <div className="absolute inset-0 z-50 bg-red-950/90 flex items-center justify-center border border-red-500">
            <h1 className="text-4xl font-black text-red-500 animate-pulse tracking-widest">SYSTEM_FAILURE</h1>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <span className="font-bold text-xl text-indigo-400 uppercase tracking-widest">Crucible Registration</span>
          <span className={`px-3 py-1 rounded text-xs font-bold ${status === "HEALTHY" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
            {status}
          </span>
        </div>

        <div className="my-auto space-y-6 max-w-sm mx-auto w-full">
          <h2 className="text-xl font-semibold text-white">Fall 2026 Course Select</h2>
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase tracking-wider">Available Courses</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm focus:outline-none focus:border-indigo-500">
              <option>CSE3001 - Advanced Data Structures</option>
              <option>CSE4002 - Distributed Systems & Cloud</option>
            </select>
          </div>
          <button 
            onClick={handleRegister}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded transition-all active:scale-95 uppercase tracking-widest text-sm shadow-lg shadow-indigo-900/20"
          >
            Register Now
          </button>
        </div>
        <div className="text-center text-xs text-slate-600 border-t border-slate-800 pt-4">Target: node-prod-ap-south-1</div>
      </section>

      {/* RIGHT COLUMN (6 columns split into 2 rows) */}
      <div className="col-span-6 grid grid-rows-2 gap-4 h-full">
        
        {/* PANE 2: Agent War Room */}
        <section className="border border-slate-800 rounded-xl bg-slate-950 p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-xs font-bold text-amber-500 tracking-widest uppercase">Agent War Room</span>
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 text-xs">
            <p className="text-slate-600">{">"} Awaiting WebSocket connection...</p>
            {logs.map((log, index) => (
              <p key={index} className="text-slate-300">{log}</p>
            ))}
          </div>
        </section>

        {/* PANE 3: Source Code X-Ray */}
        <section className="border border-slate-800 rounded-xl bg-slate-950 p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-xs font-bold text-cyan-500 tracking-widest uppercase">Source Code X-Ray</span>
            <span className="text-xs text-slate-600">backend/server.js</span>
          </div>
          <div className="flex-1 overflow-y-auto bg-black/50 rounded p-4 border border-slate-800/50">
            <pre className="text-xs text-emerald-500/80 whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        </section>

      </div>
    </main>
  );
}