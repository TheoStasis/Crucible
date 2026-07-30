"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import LiveTimeline from "@/components/landing/LiveTimeline";
import DashboardPreview from "@/components/landing/DashboardPreview";
import Workflow from "@/components/landing/Workflow";
import Features from "@/components/landing/Features";
import Philosophy from "@/components/landing/Philosophy";
import Footer from "@/components/landing/Footer";
import NarrativeBackground from "@/components/landing/NarrativeBackground";

export default function Home() {
  // Ensure the page always starts at the top — prevents browser scroll
  // restoration from landing mid-page after HMR or navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, left: 0 });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0b0d12] text-slate-100 flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Narrative V2 Background Layers */}
      <NarrativeBackground />

      {/* Scroll-reactive navigation */}
      <Navbar />

      {/* Main content flow */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full flex-grow flex flex-col items-center"
      >
        {/* 1. Hero Section (100vh) */}
        <Hero />

        {/* 2. Immediate Live Recovery Timeline (70vh) */}
        <LiveTimeline />

        {/* 3. Real Code Dashboard Preview (90vh) */}
        <DashboardPreview />

        {/* 4. Connected 6-Step Workflow Section (80vh) */}
        <Workflow />

        {/* 5. Benefits Feature Grid Section (70vh) */}
        <Features />

        {/* 6. Philosophy & Micro Flow Section (60vh) */}
        <Philosophy />
      </motion.main>

      {/* Compact footer */}
      <Footer />
    </div>
  );
}