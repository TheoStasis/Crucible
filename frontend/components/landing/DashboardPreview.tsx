"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, AlertCircle, CheckCircle, Code, Server } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ServiceStatus = "HEALTHY" | "CRASHED" | "PATCHING" | "RESTORED";

interface LogEntry {
  source: "watcher" | "agent" | "system" | "patch";
  message: string;
  time: string;
}

export default function DashboardPreview() {
  const [status, setStatus] = useState<ServiceStatus>("HEALTHY");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleStartedRef = useRef(false);

  // States cycle: Healthy -> Crashed -> Patching -> Restored
  useEffect(() => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 60%",
      onEnter: () => {
        if (!cycleStartedRef.current) {
          cycleStartedRef.current = true;
          runCycle();
        }
      },
    });

    const timers: NodeJS.Timeout[] = [];

    const runCycle = () => {
      // Step 1: Healthy
      setStatus("HEALTHY");
      setLogs([
        { source: "system", message: "Crucible monitoring agent active on port 3001.", time: "12:00:01" },
        { source: "system", message: "HTTP GET /api/health - 200 OK", time: "12:00:15" },
        { source: "watcher", message: "Runtime memory metrics nominal.", time: "12:00:30" },
      ]);

      // Step 2: Crash (after 4s)
      timers.push(
        setTimeout(() => {
          setStatus("CRASHED");
          setLogs((prev) => [
            ...prev,
            { source: "system", message: "CRITICAL: HTTP POST /api/register - Unhandled server exception.", time: "12:00:34" },
            { source: "watcher", message: "Process exited unexpectedly. Sentinel probe triggered.", time: "12:00:34" },
            { source: "system", message: "Dumping stack trace to AST compiler...", time: "12:00:35" },
          ]);

          // Step 3: Patching (after 3s)
          timers.push(
            setTimeout(() => {
              setStatus("PATCHING");
              setLogs((prev) => [
                ...prev,
                { source: "agent", message: "AI Agent War Room spawned. Compiling AST code graph...", time: "12:00:38" },
                { source: "agent", message: "Pinpointed division-by-zero memory leak in server.js:L19.", time: "12:00:39" },
                { source: "patch", message: "Compiling code hotpatch. Executing safety verification harness...", time: "12:00:40" },
              ]);

              // Step 4: Restored (after 4s)
              timers.push(
                setTimeout(() => {
                  setStatus("RESTORED");
                  setLogs((prev) => [
                    ...prev,
                    { source: "patch", message: "Verification success. Hotpatch injected cleanly.", time: "12:00:44" },
                    { source: "system", message: "Restarting isolated micro-container. Service health check: OK", time: "12:00:45" },
                  ]);
                }, 4000)
              );
            }, 3000)
          );
        }, 4000)
      );
    };

    return () => {
      trigger.kill();
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Keep logs scrolled to bottom INSIDE the log box — never the page
  useEffect(() => {
    const container = logsContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [logs]);

  const getStatusColor = (s: ServiceStatus) => {
    switch (s) {
      case "HEALTHY":
        return "text-emerald-400 bg-emerald-950/30 border-emerald-500/20";
      case "CRASHED":
        return "text-red-400 bg-red-950/30 border-red-500/20";
      case "PATCHING":
        return "text-amber-400 bg-amber-950/30 border-amber-500/20";
      case "RESTORED":
        return "text-cyan-400 bg-cyan-950/30 border-cyan-500/20";
    }
  };

  return (
    <section
      ref={containerRef}
      id="dashboard-preview"
      className="relative w-full min-h-[90vh] flex flex-col justify-center bg-[#0b0d12] py-20 px-6 border-b border-white/5"
    >
      <div className="max-w-6xl mx-auto w-full relative z-20 flex flex-col items-center">
        {/* Title Block */}
        <div className="text-center max-w-xl mb-12">
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            Autopsy Console
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-3 font-sans">
            Real-Time Diagnostic Interface
          </h2>
          <p className="text-xs text-neutral-400 mt-3 leading-relaxed font-mono">
            This component matches the live telemetry view rendered during incident response, detailing runtime metrics and AST code changes.
          </p>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-950/30 border border-white/5 p-6 rounded-2xl backdrop-blur-xl shadow-3xl select-none">
          
          {/* 1. Environment Details (Left Panel - 5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-white/5 rounded-xl bg-neutral-950/40 p-5 min-h-[400px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-7 w-7 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-white">
                  <Server size={14} className="text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Crucible Node
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-mono">node-prod-ap-south-1</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider rounded border uppercase transition-colors duration-300 ${getStatusColor(status)}`}>
                ● {status}
              </span>
            </div>

            {/* Status Panel Content */}
            <div className="my-auto py-6 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-center text-neutral-400">
                {status === "HEALTHY" && <Shield className="text-emerald-400" size={24} />}
                {status === "CRASHED" && <AlertCircle className="text-red-400 animate-pulse" size={24} />}
                {status === "PATCHING" && <Server className="text-amber-400 animate-spin" size={24} />}
                {status === "RESTORED" && <CheckCircle className="text-cyan-400" size={24} />}
              </div>

              <div className="max-w-[280px]">
                <h4 className="text-xs font-mono font-bold text-white">
                  {status === "HEALTHY" && "SYSTEM OPERATING NOMINALLY"}
                  {status === "CRASHED" && "RUNTIME EXCEPTION DETECTED"}
                  {status === "PATCHING" && "AI WAR ROOM DEPLOYING PATCH"}
                  {status === "RESTORED" && "SERVICE RESTORED & VERIFIED"}
                </h4>
                <p className="text-[10px] text-neutral-500 font-mono mt-1 leading-relaxed">
                  {status === "HEALTHY" && "HTTP Port 3001 is processing incoming course select payloads."}
                  {status === "CRASHED" && "HTTP 500 triggered. Isolation sentinel has shut down traffic flow."}
                  {status === "PATCHING" && "Compiling dynamic patch and executing unit checks in safety sandbox."}
                  {status === "RESTORED" && "Code patch verified successfully. Re-routing client requests."}
                </p>
              </div>
            </div>

            {/* Footer details */}
            <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[9px] font-mono text-neutral-500">
              <span>TARGET API: /api/register</span>
              <span>VER: v0.1.0-alpha</span>
            </div>
          </div>

          {/* 2. Logs and AST Diff (Right Panel - 7 Columns split horizontally) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Top Right: Agent Logs Console */}
            <div className="flex-1 flex flex-col border border-white/5 rounded-xl bg-neutral-950/40 p-4 h-[200px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
                <div className="flex items-center space-x-2">
                  <Terminal size={12} className="text-neutral-500" />
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                    Telemetry Stream
                  </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-600">LIVE FEED</span>
              </div>

              <div ref={logsContainerRef} className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[10px]">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-neutral-400">
                    <span className="text-neutral-600 select-none">[{log.time}]</span>
                    <span className={`uppercase font-bold text-[8px] px-1 py-0.5 rounded border leading-none self-center ${
                      log.source === "system" ? "text-neutral-500 bg-neutral-900 border-neutral-800" :
                      log.source === "watcher" ? "text-amber-400 bg-amber-950/20 border-amber-900/30" :
                      log.source === "agent" ? "text-purple-400 bg-purple-950/20 border-purple-900/30" :
                      "text-emerald-400 bg-emerald-950/20 border-emerald-900/30"
                    }`}>
                      {log.source}
                    </span>
                    <span className="text-neutral-300 leading-normal">{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Bottom Right: Code X-Ray Panel */}
            <div className="flex-1 flex flex-col border border-white/5 rounded-xl bg-[#05070f] p-4 h-[220px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
                <div className="flex items-center space-x-2">
                  <Code size={12} className="text-neutral-500" />
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                    AST Code Patch Diff
                  </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-white/5">
                  server.js
                </span>
              </div>

              <div className="flex-1 overflow-y-auto font-mono text-[10px] leading-relaxed text-neutral-400">
                <pre className="p-2 bg-neutral-950/60 rounded-lg border border-white/5 overflow-x-auto">
                  {status === "HEALTHY" && (
                    <code className="text-neutral-500">// Standby. Awaiting telemetry incident...</code>
                  )}
                  {status === "CRASHED" && (
                    <code className="text-red-400/80">
                      {"17: app.post('/api/register', (req, res, next) => {\n"}
                      {"18:   try {\n"}
                      <span className="bg-red-950/50 text-red-300 block w-full px-1">
                        {"19:     if (req.body.crash === true) {\n"}
                        {"20:       throw new Error('FATAL: Memory leak simulated');\n"}
                        {"21:     }"}
                      </span>
                      {"22:     res.json({ success: true });\n"}
                      {"23:   } catch (err) {\n"}
                      {"24:     next(err);\n"}
                      {"25:   }\n"}
                      {"26: });"}
                    </code>
                  )}
                  {(status === "PATCHING" || status === "RESTORED") && (
                    <code>
                      {"17: app.post('/api/register', (req, res, next) => {\n"}
                      {"18:   try {\n"}
                      <span className="bg-red-950/20 text-red-500/70 line-through block w-full px-1">
                        {"-     if (req.body.crash === true) {\n"}
                        {"-       throw new Error('FATAL: Memory leak simulated');\n"}
                        {"-     }"}
                      </span>
                      <span className="bg-emerald-950/40 text-emerald-400 block w-full px-1">
                        {"+     // Safe guard injected by Crucible AI Agent\n"}
                        {"+     if (req.body.crash === true) {\n"}
                        {"+       return res.status(400).json({ success: false, error: 'Request rejected' });\n"}
                        {"+     }"}
                      </span>
                      {"22:     res.json({ success: true });\n"}
                      {"23:   } catch (err) {\n"}
                      {"24:     next(err);\n"}
                      {"25:   }\n"}
                      {"26: });"}
                    </code>
                  )}
                </pre>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
