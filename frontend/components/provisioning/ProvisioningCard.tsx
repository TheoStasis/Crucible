"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import RepositorySummary from "./RepositorySummary";
import ProvisioningTimeline from "./ProvisioningTimeline";

type ProvisioningState = "idle" | "preparing" | "provisioning" | "completed" | "redirecting";

export default function ProvisioningCard() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("github.com/crucible-demo/victim-registration-api");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentState, setCurrentState] = useState<ProvisioningState>("idle");
  const [repoName, setRepoName] = useState("");
  const [statusText, setStatusText] = useState("Idle");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any running timeouts on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // 1. Simple validation check
    const normalizedUrl = repoUrl.toLowerCase().trim();
    if (!normalizedUrl.includes("github.com/")) {
      setErrorMsg("Enter a valid GitHub repository URL");
      return;
    }

    // 2. Extract repository name
    try {
      // split by github.com/ and take everything after it
      const afterGithub = normalizedUrl.split("github.com/")[1];
      const parts = afterGithub.split("/").filter(Boolean);
      if (parts.length < 2) {
        setErrorMsg("Enter a valid GitHub repository URL (include owner and repo name)");
        return;
      }
      // Parts: [owner, repoName, ...]
      const extractedRepo = parts[1].replace(".git", "");
      setRepoName(extractedRepo);
    } catch (err) {
      setErrorMsg("Enter a valid GitHub repository URL");
      return;
    }

    // 3. Move to preparing state
    setCurrentState("preparing");
    setStatusText("Preparing Sandbox...");

    // Send reset message to orchestrator WebSocket to re-arm the bug
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ action: "reset" }));
        ws.close();
      };
    } catch (err) {
      console.error("Failed to reset backend state", err);
    }

    // Transition smoothly to provisioning timeline card after 800ms
    timerRef.current = setTimeout(() => {
      setCurrentState("provisioning");
    }, 800);
  };

  const handleTimelineComplete = () => {
    setCurrentState("completed");
    setStatusText("Environment Ready");

    timerRef.current = setTimeout(() => {
      setCurrentState("redirecting");
      router.push("/demo");
    }, 800);
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      className="w-full max-w-md mt-10 p-5 bg-[#0b0d12]/90 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md flex flex-col hover:border-white/20 transition-colors select-none text-left"
    >
      <div className="flex items-center space-x-2 px-1 pb-3 border-b border-white/5 mb-3">
        <span className={`h-2 w-2 rounded-full transition-colors duration-300 ${
          currentState === "idle" ? "bg-neutral-600" :
          currentState === "preparing" ? "bg-amber-500 animate-pulse" :
          "bg-emerald-500"
        }`} />
        <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
          {currentState === "idle" ? "Import Engine" : "Provisioning Core"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {currentState === "idle" || currentState === "preparing" ? (
          <motion.form
            key="import-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleImport}
            className="flex flex-col space-y-3.5"
          >
            <div className="flex flex-col space-y-1">
              <label htmlFor="repo-input" className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                GitHub Repository URL
              </label>
              <input
                id="repo-input"
                type="text"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                disabled={currentState === "preparing"}
                className={`bg-neutral-950/80 border rounded-lg py-2.5 px-4 text-xs font-mono text-neutral-300 placeholder-neutral-600 focus:outline-none transition-colors ${
                  errorMsg
                    ? "border-red-500/50 focus:border-red-500/80"
                    : "border-white/5 focus:border-white/10"
                }`}
                placeholder="github.com/company/project"
              />
              {errorMsg && (
                <span className="text-[10px] font-mono text-red-500 mt-1">
                  {errorMsg}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={currentState === "preparing"}
              className="w-full bg-white hover:bg-neutral-200 text-black py-2.5 rounded-lg text-xs font-mono font-medium tracking-wide uppercase transition-colors active:scale-[0.98] disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {currentState === "preparing" ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-neutral-500 animate-ping" />
                  <span>Preparing Sandbox...</span>
                </>
              ) : (
                <span>[ Import Repository ]</span>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="provisioning-console"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            {/* Header / Sandbox Info */}
            <RepositorySummary repoName={repoName} statusText={statusText} />

            {/* Steps Timeline Progress */}
            <ProvisioningTimeline
              repoName={repoName}
              onComplete={handleTimelineComplete}
              onStatusChange={setStatusText}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
