"use client";

import React from "react";
import { Terminal } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full bg-[#0b0d12] py-12 px-6 border-t border-white/5 overflow-hidden select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Logo & License */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="h-6 w-6 rounded-md bg-neutral-900 border border-white/10 flex items-center justify-center text-white">
              <Terminal size={12} className="text-neutral-400" />
            </div>
            <span className="font-semibold text-sm tracking-wider text-white uppercase font-mono">
              Crucible
            </span>
          </div>
          <span className="text-[10px] text-neutral-600 font-mono">
            |
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">
            MIT License © 2026
          </span>
        </div>

        {/* Right: Github & Anchor Links */}
        <div className="flex items-center space-x-6 text-xs font-mono">
          <button
            onClick={() => scrollToSection("workflow")}
            className="text-neutral-500 hover:text-white transition-colors duration-200"
          >
            Architecture
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-neutral-500 hover:text-white transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
