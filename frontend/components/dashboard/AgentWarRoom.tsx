"use client";

import React, { useEffect, useRef } from "react";

export interface LogItem {
  agent: string;
  msg: string;
  timestamp: string;
}

interface AgentWarRoomProps {
  logs: LogItem[];
}

export default function AgentWarRoom({ logs }: AgentWarRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getAgentConfig = (agent: string) => {
    switch (agent.toLowerCase()) {
      case "watcher":
        return {
          icon: "👁",
          label: "WATCHER",
          badgeClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          sub: "Health monitoring",
        };
      case "diagnoser":
        return {
          icon: "🧠",
          label: "DIAGNOSER",
          badgeClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          sub: "Root cause analysis",
        };
      case "healer":
        return {
          icon: "🔧",
          label: "HEALER",
          badgeClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          sub: "Patch generation",
        };
      default:
        return {
          icon: "⚙",
          label: "SYSTEM",
          badgeClass: "text-slate-400 bg-slate-500/10 border-slate-500/20",
          sub: "Infrastructure",
        };
    }
  };

  return (
    <div className="border border-white/5 rounded-2xl bg-[#090b11]/40 backdrop-blur-xl p-5 flex flex-col shadow-xl h-full flex-1 min-h-[220px]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 tracking-wider uppercase font-mono">
            Agent War Room
          </span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono tracking-wider">
          {logs.length} EVENTS RECORDED
        </span>
      </div>

      {/* Terminal logs list */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin select-text"
      >
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xs italic">
            <span>{">"} Awaiting WebSocket telemetry connection...</span>
          </div>
        ) : (
          logs.map((log, index) => {
            const config = getAgentConfig(log.agent);
            return (
              <div
                key={index}
                className="p-3 rounded-xl bg-[#05060b]/60 border border-white/[0.02] hover:border-white/5 transition-all duration-300 flex items-start space-x-3.5"
              >
                {/* Agent Type Badge */}
                <div className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg border font-mono text-[9px] font-bold min-w-[85px] text-center shrink-0 ${config.badgeClass}`}>
                  <span className="text-xs leading-none mb-0.5">{config.icon}</span>
                  <span className="tracking-wider">{config.label}</span>
                </div>

                {/* Msg text */}
                <div className="flex-1 text-xs font-mono leading-relaxed text-slate-300">
                  <span className="text-[9px] text-slate-600 block mb-1">
                    {log.timestamp} // {config.sub}
                  </span>
                  <span>{log.msg}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
