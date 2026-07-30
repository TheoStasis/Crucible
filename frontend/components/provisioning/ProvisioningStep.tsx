"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProvisioningStepProps {
  text: string;
  status: "pending" | "active" | "completed";
}

export default function ProvisioningStep({ text, status }: ProvisioningStepProps) {
  const isCompleted = status === "completed";
  const isActive = status === "active";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isActive || isCompleted ? 1 : 0.25, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex items-center space-x-3 py-1 font-mono text-xs transition-all duration-300 ${
        isCompleted
          ? "text-neutral-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.07)]"
          : isActive
          ? "text-white"
          : "text-neutral-600"
      }`}
    >
      {/* Icon Area */}
      <div className="flex h-4 w-4 items-center justify-center">
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex h-3.5 w-3.5 items-center justify-center rounded bg-white text-black"
          >
            <Check size={10} strokeWidth={3} />
          </motion.div>
        ) : isActive ? (
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
          </div>
        ) : (
          <div className="h-1 w-1 rounded-full bg-neutral-700" />
        )}
      </div>

      {/* Text Area */}
      <span className="flex-1 select-none truncate">
        {text}
      </span>
    </motion.div>
  );
}
