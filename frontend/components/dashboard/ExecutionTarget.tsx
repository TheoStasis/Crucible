"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExecutionTargetProps {
  status: "HEALTHY" | "CRASHED" | "RESTORED";
  handleRegister: () => void;
}

export default function ExecutionTarget({ status, handleRegister }: ExecutionTargetProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isCrashed = status === "CRASHED";

  return (
    <motion.section
      className="h-full w-full border border-white/5 rounded-2xl bg-[#090b11]/60 backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl transition-all duration-500"
    >
      {/* Mock Browser Header */}
      <div className="bg-[#121520] border-b border-white/5 p-3 flex items-center justify-between shrink-0">
        <div className="flex space-x-2 items-center">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>
        
        {/* Mock URL Bar */}
        <div className="flex-1 max-w-sm mx-4 bg-[#05060b] border border-white/5 rounded-md px-3 py-1.5 flex items-center justify-center">
          <span className="font-mono text-[10px] text-slate-400">
            https://victim-app.local/register
          </span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isCrashed ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
          <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isCrashed ? 'text-rose-500' : 'text-emerald-500'}`}>
            {isCrashed ? "Offline / 500" : "Online"}
          </span>
        </div>
      </div>

      {/* Mock Browser Body */}
      <div className="flex-1 relative overflow-hidden bg-[#05070f] flex items-center justify-center p-4">
        
        <AnimatePresence mode="wait">
          {isCrashed ? (
            <motion.div
              key="crashed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-4 w-full h-full p-8"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-200 font-mono">500 Internal Server Error</h2>
              <p className="text-slate-500 text-sm max-w-sm">
                The server encountered an unexpected condition that prevented it from fulfilling the request.
              </p>
              <div className="mt-8 font-mono text-[10px] text-rose-500/50 bg-rose-950/20 px-4 py-2 rounded border border-rose-500/10">
                FATAL: Intentional massive memory error
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="healthy"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md bg-[#0c0f1a] border border-white/5 rounded-2xl p-8 shadow-2xl my-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white mb-2">Create an Account</h2>
                <p className="text-sm text-slate-400">Join our platform today.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-[#05060b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#05060b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-3 text-sm font-medium transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  {status === "RESTORED" ? "Register (Try Again)" : "Complete Registration"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-[10px] text-slate-500 font-mono flex items-center justify-center space-x-2">
                  <span>Target API:</span>
                  <span className="text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">POST /api/register</span>
                </p>
                <p className="text-[9px] text-slate-600 font-mono mt-3">
                  Payload injected: {`{ crash: true }`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
