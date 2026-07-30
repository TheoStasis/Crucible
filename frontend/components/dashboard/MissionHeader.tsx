"use client";

import React, { useState, useEffect } from "react";

interface MissionHeaderProps {
  status: "HEALTHY" | "CRASHED" | "RESTORED";
  socketConnected: boolean;
  recoveryTime: string | null; // e.g. "3.2s"
}

export default function MissionHeader({ status, socketConnected, recoveryTime }: MissionHeaderProps) {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="h-14 border border-white/5 rounded-2xl bg-[#090b11]/80 backdrop-blur-xl px-5 mb-4 flex items-center justify-between shadow-2xl relative z-20">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status === "CRASHED" ? "bg-rose-500" : "bg-emerald-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                status === "CRASHED" ? "bg-rose-500" : "bg-emerald-500"
              }`}
            />
          </div>
          <span className="font-extrabold text-sm tracking-wider text-white uppercase font-mono">
            CRUCIBLE
          </span>
        </div>
        <span className="text-slate-600 font-mono text-[10px] font-bold">//</span>
        <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest hidden sm:inline-block">
          Mission Control
        </span>
      </div>

      {/* Observability Metadata */}
      <div className="flex items-center space-x-6 text-[10px] font-mono text-slate-500">
        <div className="hidden lg:flex items-center space-x-1.5">
          <span className="text-slate-600">REPO:</span>
          <span className="text-slate-300 font-bold">victim-registration-api</span>
        </div>
        <div className="hidden md:flex items-center space-x-1.5">
          <span className="text-slate-600">RUNTIME:</span>
          <span className="text-slate-300 font-bold">Node.js v22</span>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5">
          <span className="text-slate-600">ENV:</span>
          <span className="text-slate-300 font-bold">Sandbox</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-600">AI:</span>
          <span className="text-emerald-400 font-bold">CONNECTED</span>
        </div>
        <div className="flex items-center space-x-1.5 border-l border-white/5 pl-4">
          <span className="text-slate-600">UPTIME:</span>
          <span className="text-slate-300 font-bold">{formatUptime(uptime)}</span>
        </div>
        {recoveryTime && (
          <div className="flex items-center space-x-1.5 border-l border-white/5 pl-4 animate-fade-in">
            <span className="text-rose-400">RECOVERY:</span>
            <span className="text-emerald-400 font-bold">{recoveryTime}</span>
          </div>
        )}
      </div>

      {/* Socket Indicator */}
      <div className="flex items-center space-x-2 text-[10px] font-mono">
        <div className="flex items-center space-x-1.5 bg-slate-900 border border-white/5 px-2.5 py-1 rounded-lg">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              socketConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}
          />
          <span className="text-slate-400">
            {socketConnected ? "WS ONLINE" : "WS CONNECTING..."}
          </span>
        </div>
      </div>
    </header>
  );
}
