"use client";

import React, { useEffect, useRef } from "react";

interface CodeEditorProps {
  status: "HEALTHY" | "CRASHED" | "RESTORED";
  displayedCode: string;
  isTyping: boolean;
}

export default function CodeEditor({ status, displayedCode, isTyping }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedCode]);

  // Splits the code and formats lines as a real git diff
  const renderDiffLines = () => {
    const lines = displayedCode.split("\n");
    return lines.map((line, index) => {
      let lineClass = "text-slate-300";
      let prefix = " ";
      let bgClass = "hover:bg-white/[0.02]";

      // Custom diff markers detection
      if (line.trim().startsWith("-")) {
        lineClass = "text-rose-400 font-bold";
        prefix = "-";
        bgClass = "bg-rose-950/20 border-l-2 border-rose-500/50";
        line = line.replace(/^\s*-\s*/, ""); // strip prefix if present
      } else if (line.trim().startsWith("+")) {
        lineClass = "text-emerald-400 font-bold";
        prefix = "+";
        bgClass = "bg-emerald-950/20 border-l-2 border-emerald-500/50";
        line = line.replace(/^\s*\+\s*/, ""); // strip prefix
      } else if (status === "CRASHED" && line.includes("throw new Error")) {
        // Highlight original bug in red during active crash
        lineClass = "text-rose-400 font-bold";
        prefix = "-";
        bgClass = "bg-rose-950/20 border-l-2 border-rose-500/50";
      }

      return (
        <div key={index} className={`flex items-start font-mono text-xs leading-relaxed py-0.5 px-4 transition-colors ${bgClass}`}>
          {/* Line number */}
          <span className="select-none text-slate-600 text-right pr-4 border-r border-white/5 mr-4 min-w-[1.5rem]">
            {index + 1}
          </span>
          {/* Git prefix */}
          <span className={`select-none mr-2 font-bold w-2 ${lineClass}`}>
            {prefix}
          </span>
          {/* Code text */}
          <span className={`flex-1 whitespace-pre-wrap ${lineClass}`}>
            {line}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="border border-white/5 rounded-2xl bg-[#090b11]/40 backdrop-blur-xl p-5 flex flex-col shadow-xl flex-1 relative overflow-hidden min-h-[300px]">
      {/* Editor top bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
          </div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md">
            backend/server.js
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isTyping && (
            <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md animate-pulse">
              AI HOTPATCHING...
            </span>
          )}
          <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase font-bold">
            JavaScript Editor
          </span>
        </div>
      </div>

      {/* Editor body workspace */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-[#05060b] rounded-xl py-4 border border-white/5 relative flex flex-col select-text"
      >
        <div className="flex-1 min-w-0">
          {renderDiffLines()}
          {isTyping && (
            <div className="flex items-center px-4 py-1">
              <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse align-middle shadow-[0_0_8px_#22d3ee]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
