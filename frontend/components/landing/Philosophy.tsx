"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Search, Hammer, CheckCircle, ChevronRight } from "lucide-react";

type FlowStep = "CRASH" | "DIAGNOSIS" | "PATCH" | "RECOVERED";

export default function Philosophy() {
  const [activeStep, setActiveStep] = useState<FlowStep>("CRASH");

  useEffect(() => {
    const sequence: FlowStep[] = ["CRASH", "DIAGNOSIS", "PATCH", "RECOVERED"];
    let idx = 0;

    const interval = setInterval(() => {
      idx = (idx + 1) % sequence.length;
      setActiveStep(sequence[idx]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="philosophy"
      className="relative w-full min-h-[60vh] flex flex-col justify-center bg-[#0b0d12] py-20 px-6 border-b border-white/5 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto w-full relative z-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Left Column: Context text */}
        <div className="md:col-span-6 flex flex-col justify-center">
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            Philosophy
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-3 font-sans leading-tight">
            Engineering Systems <br />
            <span className="text-neutral-400 font-normal">That Heal Themselves</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-4 leading-relaxed font-mono">
            Traditional monitoring only alerts you when things break. Crucible shifts the paradigm: we believe infrastructure should observe its own failures, isolate the faults, synthesize dynamic patches, and heal itself silently.
          </p>
        </div>

        {/* Right Column: Tiny Animated Flow */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-neutral-950/35 border border-white/5 rounded-2xl select-none relative min-h-[220px]">
          
          <div className="absolute top-4 left-5 flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-600 animate-pulse" />
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">LOOP SIMULATOR</span>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4 mt-6">
            
            {/* Step 1: Crash */}
            <div className="flex flex-col items-center space-y-2">
              <motion.div
                animate={{
                  scale: activeStep === "CRASH" ? 1.08 : 1,
                  borderColor: activeStep === "CRASH" ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.05)",
                }}
                className={`h-11 w-11 rounded-full bg-neutral-900 border flex items-center justify-center transition-colors duration-300 ${
                  activeStep === "CRASH" ? "text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]" : "text-neutral-500"
                }`}
              >
                <AlertCircle size={16} />
              </motion.div>
              <span className={`text-[9px] font-mono font-bold tracking-wider uppercase transition-colors duration-300 ${
                activeStep === "CRASH" ? "text-red-400" : "text-neutral-600"
              }`}>
                Crash
              </span>
            </div>

            {/* Link 1 */}
            <ChevronRight size={12} className={`transition-colors duration-300 ${
              activeStep === "DIAGNOSIS" ? "text-neutral-300 animate-pulse" : "text-neutral-700"
            }`} />

            {/* Step 2: Diagnosis */}
            <div className="flex flex-col items-center space-y-2">
              <motion.div
                animate={{
                  scale: activeStep === "DIAGNOSIS" ? 1.08 : 1,
                  borderColor: activeStep === "DIAGNOSIS" ? "rgba(245, 158, 11, 0.4)" : "rgba(255, 255, 255, 0.05)",
                }}
                className={`h-11 w-11 rounded-full bg-neutral-900 border flex items-center justify-center transition-colors duration-300 ${
                  activeStep === "DIAGNOSIS" ? "text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]" : "text-neutral-500"
                }`}
              >
                <Search size={16} />
              </motion.div>
              <span className={`text-[9px] font-mono font-bold tracking-wider uppercase transition-colors duration-300 ${
                activeStep === "DIAGNOSIS" ? "text-amber-400" : "text-neutral-600"
              }`}>
                Diagnosis
              </span>
            </div>

            {/* Link 2 */}
            <ChevronRight size={12} className={`transition-colors duration-300 ${
              activeStep === "PATCH" ? "text-neutral-300 animate-pulse" : "text-neutral-700"
            }`} />

            {/* Step 3: Patch */}
            <div className="flex flex-col items-center space-y-2">
              <motion.div
                animate={{
                  scale: activeStep === "PATCH" ? 1.08 : 1,
                  borderColor: activeStep === "PATCH" ? "rgba(168, 85, 247, 0.4)" : "rgba(255, 255, 255, 0.05)",
                }}
                className={`h-11 w-11 rounded-full bg-neutral-900 border flex items-center justify-center transition-colors duration-300 ${
                  activeStep === "PATCH" ? "text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.25)]" : "text-neutral-500"
                }`}
              >
                <Hammer size={16} />
              </motion.div>
              <span className={`text-[9px] font-mono font-bold tracking-wider uppercase transition-colors duration-300 ${
                activeStep === "PATCH" ? "text-purple-400" : "text-neutral-600"
              }`}>
                Patch
              </span>
            </div>

            {/* Link 3 */}
            <ChevronRight size={12} className={`transition-colors duration-300 ${
              activeStep === "RECOVERED" ? "text-neutral-300 animate-pulse" : "text-neutral-700"
            }`} />

            {/* Step 4: Recovered */}
            <div className="flex flex-col items-center space-y-2">
              <motion.div
                animate={{
                  scale: activeStep === "RECOVERED" ? 1.08 : 1,
                  borderColor: activeStep === "RECOVERED" ? "rgba(34, 211, 238, 0.4)" : "rgba(255, 255, 255, 0.05)",
                }}
                className={`h-11 w-11 rounded-full bg-neutral-900 border flex items-center justify-center transition-colors duration-300 ${
                  activeStep === "RECOVERED" ? "text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]" : "text-neutral-500"
                }`}
              >
                <CheckCircle size={16} />
              </motion.div>
              <span className={`text-[9px] font-mono font-bold tracking-wider uppercase transition-colors duration-300 ${
                activeStep === "RECOVERED" ? "text-cyan-400" : "text-neutral-600"
              }`}>
                Recovered
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
