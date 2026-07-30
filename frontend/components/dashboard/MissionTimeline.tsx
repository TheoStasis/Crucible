"use client";

import React from "react";

interface MissionTimelineProps {
  status: "HEALTHY" | "CRASHED" | "RESTORED";
  logs: string[];
  isTyping: boolean;
}

export default function MissionTimeline({ status, logs, isTyping }: MissionTimelineProps) {
  // Determine current active lifecycle phase
  // Phase index: 0 = Monitoring, 1 = Failure, 2 = Diagnosis, 3 = Patch, 4 = Recovery, 5 = Healthy
  let currentPhaseIndex = 0;

  if (status === "RESTORED") {
    currentPhaseIndex = 5; // Healthy again
  } else if (status === "CRASHED") {
    // Check logs to see what's happening
    const hasDiagnosis = logs.some((l) => l.includes("[Diagnoser]") || l.includes("Diagnosis"));
    const hasPatch = logs.some((l) => l.includes("[Healer]") || l.includes("Hotpatch") || l.includes("compil"));
    
    if (isTyping || hasPatch) {
      currentPhaseIndex = 3; // Patching state
    } else if (hasDiagnosis) {
      currentPhaseIndex = 2; // Diagnosing state
    } else {
      currentPhaseIndex = 1; // Failure detected
    }
  }

  const steps = [
    { label: "Monitoring", description: "Health polling active" },
    { label: "Failure Detected", description: "Exception intercept" },
    { label: "AI Diagnosis", description: "Root-cause analysis" },
    { label: "Patch Compilation", description: "Safe code rewrite" },
    { label: "Hotpatch Recovery", description: "Nodemon container boot" },
    { label: "System Healthy", description: "Integrity restored" },
  ];

  return (
    <div className="border border-white/5 rounded-2xl bg-[#090b11]/40 backdrop-blur-xl p-4 mb-4 shadow-xl z-20 relative select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {steps.map((step, index) => {
          const isActive = index === currentPhaseIndex;
          const isCompleted = index < currentPhaseIndex;
          
          return (
            <React.Fragment key={index}>
              {/* Step circle & text info */}
              <div className="flex items-center space-x-3 transition-all duration-300">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center border font-mono text-[9px] font-bold transition-all duration-500 ${
                    isActive
                      ? "bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.4)] animate-pulse"
                      : isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-900 border-white/5 text-slate-600"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <div className="text-left font-mono">
                  <div
                    className={`text-xs font-bold transition-colors duration-300 ${
                      isActive ? "text-indigo-300" : isCompleted ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[9px] text-slate-600 tracking-tight leading-none mt-0.5">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block flex-1 h-[1px] relative bg-slate-800">
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-1000 ${
                      isCompleted ? "w-full bg-emerald-500/30" : "w-0 bg-indigo-500/30"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
