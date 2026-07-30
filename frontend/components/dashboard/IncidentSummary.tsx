"use client";

import React from "react";

interface IncidentSummaryProps {
  status: "HEALTHY" | "CRASHED" | "RESTORED";
  logs: string[];
}

export default function IncidentSummary({ status, logs }: IncidentSummaryProps) {
  // Determine current detailed status label and AI confidence
  let incidentLabel = "None Detected";
  let severity = "Nominal";
  let confidence = "--";
  let statusText = "Active Monitoring";

  if (status === "CRASHED") {
    incidentLabel = "Unhandled Exception";
    severity = "CRITICAL";
    statusText = "Diagnosing File...";
    confidence = "94%";
    
    // Check if healers or AI models are already outputting hotpatch code
    const hasPatch = logs.some((l) => l.includes("[Healer]") || l.includes("Hotpatch") || l.includes("compil"));
    if (hasPatch) {
      statusText = "Deploying Hotpatch";
      confidence = "98%";
    }
  } else if (status === "RESTORED") {
    incidentLabel = "Unhandled Exception (Resolved)";
    severity = "Cured";
    statusText = "System Restored";
    confidence = "100%";
  }

  return (
    <div className="border border-white/5 rounded-2xl bg-[#090b11]/40 backdrop-blur-xl p-4 flex flex-col justify-between shadow-xl min-w-[200px] h-full">
      {/* Title */}
      <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5 mb-2.5">
        <span className="text-[10px] font-bold text-rose-400 tracking-wider font-mono uppercase">
          Incident Status
        </span>
      </div>

      {/* Stats list */}
      <div className="space-y-2.5 font-mono text-[10px] text-slate-400">
        <div className="flex flex-col">
          <span className="text-slate-600 text-[8px] uppercase tracking-wide">Incident Type</span>
          <span className={`text-[11px] font-bold mt-0.5 ${status === "CRASHED" ? "text-rose-400" : status === "RESTORED" ? "text-emerald-400" : "text-slate-300"}`}>
            {incidentLabel}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-600 text-[8px] uppercase tracking-wide">Severity Level</span>
          <span
            className={`font-extrabold text-[10px] mt-0.5 ${
              severity === "CRITICAL" ? "text-rose-500 animate-pulse" : severity === "Cured" ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            {severity}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-600 text-[8px] uppercase tracking-wide">Affected File</span>
          <span className="text-slate-300 mt-0.5">backend/server.js</span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-600 text-[8px] uppercase tracking-wide">AI Engine Confidence</span>
          <span className="text-slate-300 font-bold mt-0.5">{confidence}</span>
        </div>
      </div>
    </div>
  );
}
