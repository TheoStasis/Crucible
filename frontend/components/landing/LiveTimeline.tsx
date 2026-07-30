"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Play, RefreshCw, Terminal, Code } from "lucide-react";

interface TimelineEvent {
  time: string;
  label: string;
  status: "success" | "warning" | "info";
  icon: React.ReactNode;
  description: string;
}

const events: TimelineEvent[] = [
  {
    time: "12:01:22",
    label: "Repository Imported",
    status: "success",
    icon: <CheckCircle2 size={16} />,
    description: "Compiling code graph and spawning local container on port 3001.",
  },
  {
    time: "12:01:28",
    label: "Health Check Failed",
    status: "warning",
    icon: <AlertTriangle size={16} />,
    description: "Sentinel probes detect HTTP 500 Unhandled Exception (massive memory fault).",
  },
  {
    time: "12:01:29",
    label: "Diagnosis Complete",
    status: "success",
    icon: <CheckCircle2 size={16} />,
    description: "LLM agent isolates AST stack trace and pinpoints root cause bug.",
  },
  {
    time: "12:01:30",
    label: "Patch Generated",
    status: "success",
    icon: <CheckCircle2 size={16} />,
    description: "Hotpatch compiled and validated against sandbox test harness.",
  },
  {
    time: "12:01:31",
    label: "Application Restored",
    status: "success",
    icon: <CheckCircle2 size={16} />,
    description: "Live hotpatch injected. Service back online with 0ms downtime.",
  },
];

export default function LiveTimeline() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 1.2, ease: "easeInOut" as const },
    },
  };

  return (
    <section
      id="timeline"
      className="relative w-full min-h-[70vh] flex flex-col justify-center bg-[#0b0d12] py-20 px-6 overflow-hidden border-b border-white/5"
    >
      <div className="max-w-4xl mx-auto w-full relative z-20 flex flex-col md:flex-row gap-10 md:gap-20 items-start">
        {/* Left column: Context Heading */}
        <div className="max-w-xs flex flex-col justify-center">
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            Telemetry Loop
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-3 font-sans">
            5 Seconds to Full Recovery
          </h2>
          <p className="text-xs text-neutral-400 mt-4 leading-relaxed font-mono">
            Crucible works in real-time. When an event fires, our system monitors, isolates, and repairs with zero developer intervention.
          </p>
        </div>

        {/* Right column: Animated Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex-1 relative pl-8 select-none"
        >
          {/* Vertical Timeline Bar */}
          <motion.div
            variants={lineVariants}
            className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-neutral-800 origin-top"
          />

          {/* Timeline Event Cards */}
          <div className="space-y-8">
            {events.map((event, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative flex gap-6 items-start group"
              >
                {/* Status Dot / Icon */}
                <div
                  className={`absolute -left-[25px] h-[19px] w-[19px] rounded-full flex items-center justify-center border z-10 transition-colors duration-300 ${
                    event.status === "warning"
                      ? "bg-neutral-950 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 group-hover:border-neutral-500 group-hover:text-white"
                  }`}
                >
                  {event.icon}
                </div>

                {/* Event Details */}
                <div className="flex-1 flex flex-col md:flex-row md:items-baseline justify-between gap-2 p-4 bg-neutral-950/40 border border-white/5 rounded-xl hover:bg-neutral-950/60 hover:border-white/10 transition-all duration-300">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono font-bold text-white tracking-wide">
                      {event.label}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {event.description}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap self-start md:self-auto">
                    {event.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
