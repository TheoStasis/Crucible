"use client";

import React from "react";
import { motion } from "framer-motion";

interface ExecutionTargetProps {
  status: "HEALTHY" | "CRASHED" | "RESTORED";
  handleRegister: () => void;
}

export default function ExecutionTarget({ status, handleRegister }: ExecutionTargetProps) {
  return (
    <motion.section
      className="col-span-12 lg:col-span-4 border border-white/5 rounded-2xl bg-[#090b11]/40 backdrop-blur-xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/10"
    >
      <div>
        {/* Pane Title */}
        <div className="flex items-center space-x-3 border-b border-white/5 pb-4 mb-5">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono text-[10px] font-bold">
            01
          </div>
          <div>
            <span className="font-bold text-xs text-white tracking-wider uppercase font-mono">
              Execution Target
            </span>
            <p className="text-[10px] text-slate-500 font-mono">victim-runtime-container</p>
          </div>
        </div>

        {/* Runtime specs */}
        <div className="space-y-4 font-mono text-xs text-slate-400 mb-6">
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-2">
            <span className="text-slate-600">ENVIRONMENT</span>
            <span className="text-slate-200">Docker Sandbox</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-2">
            <span className="text-slate-600">TARGET INSTANCE</span>
            <span className="text-slate-200">127.0.0.1:3001</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-2">
            <span className="text-slate-600">ENDPOINT ROUTE</span>
            <span className="text-slate-200">POST /api/register</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-2">
            <span className="text-slate-600">PAYLOAD SPEC</span>
            <span className="text-indigo-400 font-bold">{"{ crash: true }"}</span>
          </div>
        </div>

        {/* Payload visual inspector */}
        <div className="bg-[#05060b] border border-white/5 rounded-xl p-3.5 mb-6 text-[10px] font-mono leading-relaxed relative">
          <div className="absolute right-3.5 top-3 text-[9px] text-slate-600 uppercase font-bold tracking-wider">
            RAW BODY
          </div>
          <pre className="text-slate-300">
            {JSON.stringify({
              timestamp: new Date().toISOString().split("T")[0],
              payload: {
                action: "register",
                data: {
                  name: "Autopsy Demo",
                  trigger: "manual_chaos"
                },
                crash: true
              }
            }, null, 2)}
          </pre>
        </div>
      </div>

      <div>
        {/* Trigger Button */}
        <button
          onClick={handleRegister}
          disabled={status === "CRASHED"}
          className={`w-full py-4 rounded-xl font-mono text-[10px] tracking-widest uppercase transition-all duration-300 font-bold ${
            status === "CRASHED"
              ? "bg-rose-950/20 text-rose-500 border border-rose-500/30 cursor-not-allowed animate-pulse"
              : status === "RESTORED"
              ? "bg-[#0b2b1a] text-emerald-400 border border-emerald-500/20 hover:bg-[#0e3b23] active:scale-[0.98]"
              : "bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 hover:bg-[#11162e] active:scale-[0.98]"
          }`}
        >
          {status === "CRASHED"
            ? "Autopsy Active"
            : status === "RESTORED"
            ? "System Restored • Re-Trigger"
            : "Trigger Chaos Failure"}
        </button>

        <div className="flex items-center justify-between text-[9px] font-mono text-slate-600 mt-4 pt-4 border-t border-white/5">
          <span>PORT: 3001</span>
          <span>RESPONSE: {status === "CRASHED" ? "HTTP 500 FAILED" : "HTTP 200 OK"}</span>
        </div>
      </div>
    </motion.section>
  );
}
