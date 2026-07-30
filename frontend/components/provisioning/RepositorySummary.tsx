"use client";

import React from "react";
import { GitBranch, Shield, Cpu, RefreshCw } from "lucide-react";

interface RepositorySummaryProps {
  repoName: string;
  statusText: string;
}

export default function RepositorySummary({ repoName, statusText }: RepositorySummaryProps) {
  return (
    <div className="w-full border-b border-white/5 pb-4 mb-4 text-left font-mono">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
          Repository Details
        </span>
        <div className="flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] text-neutral-400">Isolated Sandbox</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[11px] text-neutral-400 bg-neutral-950/40 border border-white/5 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 flex items-center space-x-1">
            <GitBranch size={10} className="text-neutral-600" />
            <span>Repository:</span>
          </span>
          <span className="text-white font-medium truncate max-w-[120px]" title={repoName}>
            {repoName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-500 flex items-center space-x-1">
            <Shield size={10} className="text-neutral-600" />
            <span>Branch:</span>
          </span>
          <span className="text-neutral-300">main</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-500 flex items-center space-x-1">
            <Cpu size={10} className="text-neutral-600" />
            <span>Runtime:</span>
          </span>
          <span className="text-neutral-300">Node 22</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-500 flex items-center space-x-1">
            <RefreshCw size={10} className="text-neutral-600" />
            <span>Status:</span>
          </span>
          <span className="text-white font-medium animate-pulse">{statusText}</span>
        </div>
      </div>
    </div>
  );
}
