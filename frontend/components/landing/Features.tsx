"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Eye, AlertCircle, Sparkles, Hammer, ShieldCheck } from "lucide-react";

interface FeatureCard {
  title: string;
  badge: string;
  description: string;
  subtext: string;
  icon: React.ReactNode;
}

const features: FeatureCard[] = [
  {
    title: "Detect",
    badge: "CONTINUOUS OBSERVABILITY",
    description: "Continuously monitor runtime health.",
    subtext: "Sentinel probes intercept application states and identify crashes down to the millisecond without adding request overhead.",
    icon: <Eye className="text-blue-400" size={20} />,
  },
  {
    title: "Diagnose",
    badge: "ROOT CAUSE ANALYSIS",
    description: "AI explains exactly what failed.",
    subtext: "Pinpoint memory faults, database locks, or runtime errors. Our diagnostic engine compiles a localized stack trace and logs.",
    icon: <Sparkles className="text-amber-400" size={20} />,
  },
  {
    title: "Recover",
    badge: "AUTOPATCH INJECTION",
    description: "Restore services with generated patches.",
    subtext: "Auto-generate safe abstract-syntax-tree modifications, verify compatibility in an isolated sandbox, and deploy live.",
    icon: <ShieldCheck className="text-emerald-400" size={20} />,
  },
];

export default function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="features"
      className="relative w-full min-h-[70vh] flex flex-col justify-center bg-[#0b0d12] py-24 px-6 border-b border-white/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full relative z-20 flex flex-col items-center">
        {/* Section Title */}
        <div className="text-center max-w-xl mb-16">
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            Features
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-3 font-sans">
            Designed for Zero System Downtime
          </h2>
          <p className="text-xs text-neutral-400 mt-3 leading-relaxed font-mono">
            A three-stage autonomous pipeline designed to protect and repair production deployments silently.
          </p>
        </div>

        {/* Features Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-between p-6 bg-neutral-950/40 border border-white/5 hover:border-white/10 rounded-2xl shadow-xl select-none min-h-[280px] transition-colors"
            >
              <div className="flex flex-col space-y-4">
                {/* Header: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-white/5">
                    {feature.badge}
                  </span>
                </div>

                {/* Core description */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs font-mono text-neutral-200">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Subtext description */}
              <p className="text-[11px] text-neutral-500 font-mono leading-relaxed mt-4">
                {feature.subtext}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
