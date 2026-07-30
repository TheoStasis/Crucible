"use client";

import React, { useEffect, useState, useRef } from "react";
import ProvisioningStep from "./ProvisioningStep";

interface ProvisioningTimelineProps {
  repoName: string;
  onComplete: () => void;
  onStatusChange: (status: string) => void;
}

interface StepConfig {
  activeText: string;
  completedText: string;
}

export default function ProvisioningTimeline({
  repoName,
  onComplete,
  onStatusChange,
}: ProvisioningTimelineProps) {
  const steps: StepConfig[] = [
    {
      activeText: "Initializing isolated workspace...",
      completedText: "Workspace initialized",
    },
    {
      activeText: `Cloning ${repoName}...`,
      completedText: "Repository cloned",
    },
    {
      activeText: "Analyzing code dependency graph...",
      completedText: "Dependency graph generated",
    },
    {
      activeText: "Building sandbox runtime...",
      completedText: "Building runtime",
    },
    {
      activeText: "Starting telemetry probes...",
      completedText: "Starting telemetry probes",
    },
    {
      activeText: "Parsing AST structures...",
      completedText: "Loading AST",
    },
    {
      activeText: "Connecting AI recovery agents...",
      completedText: "Connecting AI agents",
    },
    {
      activeText: "Verifying sandbox environment...",
      completedText: "Environment Ready",
    },
    {
      activeText: "Launching Mission Control...",
      completedText: "Launching Mission Control...",
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const runNextStep = () => {
      if (currentStepIndex < steps.length) {
        // Notify parent of current running state
        onStatusChange(steps[currentStepIndex].activeText);

        // Calculate a natural delay between 400ms and 600ms
        const delay = Math.floor(Math.random() * 200) + 400;

        timeoutRef.current = setTimeout(() => {
          if (currentStepIndex === steps.length - 1) {
            // Final launch step: notify parent of completion after 600ms-800ms
            onStatusChange(steps[currentStepIndex].completedText);
            const redirectDelay = Math.floor(Math.random() * 200) + 600;
            timeoutRef.current = setTimeout(() => {
              onComplete();
            }, redirectDelay);
          } else {
            setCurrentStepIndex((prev) => prev + 1);
          }
        }, delay);
      }
    };

    runNextStep();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentStepIndex]);

  return (
    <div className="flex flex-col space-y-2 mt-4 text-left w-full">
      {steps.map((step, idx) => {
        let status: "pending" | "active" | "completed" = "pending";
        if (currentStepIndex > idx) {
          status = "completed";
        } else if (currentStepIndex === idx) {
          status = "active";
        }

        const text = status === "completed" ? step.completedText : step.activeText;

        // Only show steps that are active, completed, or the next upcoming pending step to prevent a huge block on mount
        if (idx > currentStepIndex + 2) return null;

        return (
          <ProvisioningStep
            key={idx}
            text={text}
            status={status}
          />
        );
      })}
    </div>
  );
}
