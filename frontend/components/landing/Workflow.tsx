"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitPullRequest, Eye, ShieldAlert, Cpu, Hammer, ShieldCheck } from "lucide-react";

interface Step {
  id: number;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    label: "Import Repository",
    description: "Provide repository URL. Crucible provisions an isolated micro-container sandbox.",
    icon: <GitPullRequest size={16} />,
  },
  {
    id: 2,
    label: "Monitor Runtime",
    description: "Sentinel probes hook into API endpoints and telemetry sockets to watch behavior.",
    icon: <Eye size={16} />,
  },
  {
    id: 3,
    label: "Detect Failure",
    description: "Instantaneous alert triggers when endpoint faults (like memory crash) occur.",
    icon: <ShieldAlert size={16} />,
  },
  {
    id: 4,
    label: "Analyze Root Cause",
    description: "Dynamic parser feeds system telemetry and stack traces into the LLM sandbox.",
    icon: <Cpu size={16} />,
  },
  {
    id: 5,
    label: "Generate Patch",
    description: "AI Agent compiles, isolates, and verifies code corrections in the test suite.",
    icon: <Hammer size={16} />,
  },
  {
    id: 6,
    label: "Restore Service",
    description: "Silently hotpatches the runtime, restoring server operations in milliseconds.",
    icon: <ShieldCheck size={16} />,
  },
];

export default function Workflow() {
  // Line animation variants
  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 1.5, ease: "easeInOut" as const, delay: 0.3 },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="workflow"
      className="relative w-full min-h-[80vh] flex flex-col justify-center bg-[#0b0d12] py-20 px-6 border-b border-white/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full relative z-20 flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-xl mb-16">
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            Architecture
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-3 font-sans">
            The Autonomous Recovery Pipeline
          </h2>
          <p className="text-xs text-neutral-400 mt-3 leading-relaxed font-mono">
            How Crucible traces crashes, inspects abstract syntax trees, and deploys verified patches.
          </p>
        </div>

        {/* 6-Step Workflow Nodes Grid */}
        <div className="w-full relative">
          
          {/* Decorative Connecting Lines (Desktop Only) */}
          <div className="hidden lg:block absolute left-10 right-10 top-[28px] h-[2px] z-0 pointer-events-none">
            <svg className="w-full h-[4px] overflow-visible">
              <motion.line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />
              <motion.line
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={pathVariants}
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
            </svg>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10"
          >
            {steps.map((step) => (
              <motion.div
                key={step.id}
                variants={cardVariants}
                className="flex flex-col items-center lg:items-start space-y-4 group select-none text-center lg:text-left"
              >
                {/* Node circle */}
                <div className="h-14 w-14 rounded-full bg-neutral-950 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:border-white/30 group-hover:text-white transition-all duration-300 relative shadow-xl">
                  {step.icon}
                  {/* Step counter */}
                  <span className="absolute -top-1.5 -right-1.5 bg-neutral-900 border border-white/5 text-[9px] font-mono h-5 w-5 rounded-full flex items-center justify-center text-neutral-500 font-bold">
                    {step.id}
                  </span>
                </div>

                {/* Text details */}
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider group-hover:text-neutral-200 transition-colors">
                    {step.label}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
