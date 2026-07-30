"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0b0d12]/75 backdrop-blur-xl border-b border-white/5 py-3.5 shadow-lg"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <motion.div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-8 w-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-white transition-colors group-hover:border-white/20">
            <Terminal size={16} className="text-neutral-400 group-hover:text-white transition-colors" />
          </div>
          <span className="font-semibold text-lg tracking-wider text-white uppercase font-mono group-hover:text-neutral-200 transition-colors">
            Crucible
          </span>
        </motion.div>

        {/* Right: Navigation Links */}
        <nav className="flex items-center space-x-8 text-sm font-mono">
          <button
            onClick={() => scrollToSection("features")}
            className="text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("workflow")}
            className="text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Architecture
          </button>
          <button
            onClick={() => scrollToSection("philosophy")}
            className="text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Philosophy
          </button>
        </nav>
      </div>
    </motion.header>
  );
}
