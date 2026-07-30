"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("https://github.com/crucible-demo/victim-registration-api");
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const handleStartProvisioning = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isProvisioning) return;

    setIsProvisioning(true);
    setTerminalLogs([]);

    // Line 1 (0.4s)
    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        "[1/4] ➜ Cloning target repository " + (repoUrl.trim() || "https://github.com/crucible-demo/victim-registration-api") + "...",
      ]);
    }, 400);

    // Line 2 (1.4s)
    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        "[2/4] ➜ Compiling AST code graph & building isolated micro-container on port 3001...",
      ]);
    }, 1400);

    // Line 3 (2.5s)
    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        "[3/4] ➜ Mounting Telemetry Probes & spawning Groq AI Agent War Room at ws://localhost:8080...",
      ]);
    }, 2500);

    // Line 4 (3.5s)
    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        "[4/4] ➜ Sandbox Provisioned. Redirecting to Live Autopsy Telemetry Dashboard...",
      ]);
    }, 3500);

    // Redirect to /demo at 4.2s
    setTimeout(() => {
      router.push("/demo");
    }, 4200);
  };

  return (
    <div className="min-h-screen w-screen bg-[#05070f] text-slate-200 overflow-x-hidden flex flex-col justify-between p-6 select-none bg-grid-pattern relative">
      
      {/* Glowing Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-indigo-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />

      {/* TOP NAVBAR */}
      <header className="max-w-6xl w-full mx-auto h-16 border border-white/10 rounded-2xl bg-slate-950/60 backdrop-blur-xl px-6 flex items-center justify-between shadow-2xl relative z-20">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-extrabold text-xl tracking-widest text-white uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-mono">
            Crucible
          </span>
          <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/40 px-2 py-0.5 rounded-full ml-2">
            ENTERPRISE PLATFORM
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            Autonomous Self-Healing Infra Engine
          </span>
          <button
            onClick={() => router.push("/demo")}
            className="text-xs font-mono text-slate-300 hover:text-white bg-slate-900 border border-white/10 hover:border-white/20 px-3.5 py-1.5 rounded-xl transition-all"
          >
            Direct Demo Dashboard →
          </button>
        </div>
      </header>

      {/* HERO SECTION & REPO IMPORT */}
      <main className="max-w-4xl w-full mx-auto my-auto py-12 flex flex-col items-center text-center relative z-10">
        
        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-950/80 to-slate-900/80 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-mono text-indigo-300 mb-6 shadow-lg"
        >
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>⚡ AUTOMATED CHAOS ENGINEERING & LIVE AUTOPSY PLATFORM</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight font-sans"
        >
          Self-Healing Infra <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Powered by AI Agents
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm md:text-base text-slate-400 max-w-2xl mt-6 leading-relaxed font-sans"
        >
          Simulate catastrophic runtime server failures. Crucible deploys autonomous LLM agents that capture stack traces, compile hotpatches live, and verify code restoration with zero system downtime.
        </motion.p>

        {/* INTERACTIVE FORM / PROVISIONING TERMINAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-xl mt-10"
        >
          <AnimatePresence mode="wait">
            {!isProvisioning ? (
              /* INPUT FORM */
              <motion.form
                key="form"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleStartProvisioning}
                className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 backdrop-blur-2xl shadow-2xl flex flex-col space-y-3"
              >
                <div className="text-left px-1">
                  <label className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    Target Repository URL
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    required
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/org/victim-repository"
                    className="flex-1 bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-mono text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-950/50 uppercase tracking-wider active:scale-95 whitespace-nowrap"
                  >
                    Import & Sandbox
                  </button>
                </div>
                <div className="text-left px-1 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Supports Node.js Express & Microservices</span>
                  <span>Port 3001 • WS 8080</span>
                </div>
              </motion.form>
            ) : (
              /* FAKE PROVISIONING TERMINAL BOX */
              <motion.div
                key="terminal"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-[#070914] border border-indigo-500/40 rounded-2xl p-5 backdrop-blur-2xl shadow-2xl text-left font-mono"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-300 ml-2 uppercase tracking-wider">
                      PROVISIONING SANDBOX ENVIRONMENT
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      BUILDING...
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 min-h-[140px] font-mono leading-relaxed">
                  {terminalLogs.map((log, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={index === 3 ? "text-emerald-400 font-bold" : "text-cyan-300"}
                    >
                      {log}
                    </motion.p>
                  ))}
                </div>

                {/* Progress Indicator */}
                <div className="w-full bg-slate-900 border border-white/5 rounded-full h-1.5 overflow-hidden mt-4">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4.2, ease: "linear" }}
                    className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 relative z-20">
        <div>
          <span>Crucible Platform © 2026 • Autonomous Self-Healing Infrastructure</span>
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <span>Target Node: localhost:3001</span>
          <span>Orchestrator WS: localhost:8080</span>
        </div>
      </footer>
    </div>
  );
}