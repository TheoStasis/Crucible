"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { GitBranch, Shield, Zap, RefreshCw } from "lucide-react";

// Lazy-load Hyperspeed WebGL background
const Hyperspeed = dynamic(() => import("./Hyperspeed"), { ssr: false });

export default function Hero() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("github.com/crucible-demo/victim-registration-api");

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/demo");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative w-screen h-screen min-h-[650px] overflow-hidden flex flex-col justify-center items-center bg-[#05070f] z-10">
      {/* 1. WebGL Hyperspeed Background */}
      <div className="absolute inset-0 z-0">
        <Hyperspeed />
      </div>

      {/* 2. Radial Dark Mask Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-radial-gradient z-10 pointer-events-none" />

      {/* 3. Bottom Gradient Fade to transition into the timeline section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0b0d12] to-transparent z-10 pointer-events-none" />

      {/* 4. Foreground Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-3xl px-6 text-center flex flex-col items-center select-none"
      >
        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-sans"
        >
          Autonomous Incident Recovery <br />
          <span className="text-neutral-400 font-normal">for Modern Applications</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-neutral-400 max-w-xl mt-6 text-sm md:text-base leading-relaxed"
        >
          Observe failures. Diagnose root causes. Generate patches. Recover automatically.
        </motion.p>

        {/* Command Palette CTA */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleNavigate}
          className="w-full max-w-md mt-10 p-2 bg-[#0b0d12]/90 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md flex flex-col space-y-2 hover:border-white/20 transition-colors"
        >
          <div className="flex items-center space-x-2 px-3 pt-2">
            <span className="h-2 w-2 rounded-full bg-neutral-600" />
            <span className="h-2 w-2 rounded-full bg-neutral-600" />
            <span className="text-[10px] text-neutral-500 font-mono">IMPORT ENGINE</span>
          </div>
          <div className="flex flex-col space-y-2 p-1">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-neutral-950/80 border border-white/5 rounded-lg py-2.5 px-4 text-xs font-mono text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-white/10 transition-colors"
              placeholder="github.com/company/project"
            />
            <button
              type="submit"
              className="w-full bg-white hover:bg-neutral-200 text-black py-2.5 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-colors active:scale-[0.98]"
            >
              [ Import Repository ]
            </button>
          </div>
        </motion.form>

        {/* Capability Badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mt-10 max-w-xl"
        >
          <div className="flex items-center space-x-2 bg-neutral-950/40 border border-white/5 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-neutral-400">
            <Shield size={12} className="text-neutral-500" />
            <span>Local Sandbox</span>
          </div>
          <div className="flex items-center space-x-2 bg-neutral-950/40 border border-white/5 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-neutral-400">
            <GitBranch size={12} className="text-neutral-500" />
            <span>AI Diagnosis</span>
          </div>
          <div className="flex items-center space-x-2 bg-neutral-950/40 border border-white/5 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-neutral-400">
            <Zap size={12} className="text-neutral-500" />
            <span>Live Recovery</span>
          </div>
          <div className="flex items-center space-x-2 bg-neutral-950/40 border border-white/5 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-neutral-400">
            <RefreshCw size={12} className="text-neutral-500" />
            <span>WebSocket Telemetry</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
