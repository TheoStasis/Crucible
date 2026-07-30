import React, { useEffect, useRef } from "react";
import { GitPullRequest, Eye, ShieldAlert, Cpu, Hammer, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Step {
  id: number;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    label: "Import Repository",
    description: "Provide repository URL. Crucible provisions an isolated micro-container sandbox.",
    icon: <GitPullRequest size={16} />,
  },
  {
    id: 2,
    label: "Monitor Runtime",
    description: "Sentinel probes hook into API endpoints and telemetry sockets to watch behavior.",
    icon: <Eye size={16} />,
  },
  {
    id: 3,
    label: "Detect Failure",
    description: "Instantaneous alert triggers when endpoint faults (like memory crash) occur.",
    icon: <ShieldAlert size={16} />,
  },
  {
    id: 4,
    label: "Analyze Root Cause",
    description: "Dynamic parser feeds system telemetry and stack traces into the LLM sandbox.",
    icon: <Cpu size={16} />,
  },
  {
    id: 5,
    label: "Generate Patch",
    description: "AI Agent compiles, isolates, and verifies code corrections in the test suite.",
    icon: <Hammer size={16} />,
  },
  {
    id: 6,
    label: "Restore Service",
    description: "Silently hotpatches the runtime, restoring server operations in milliseconds.",
    icon: <ShieldCheck size={16} />,
  },
];

export default function Workflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(lineRef.current, { attr: { x2: "100%" } });
      stepRefs.current.forEach((step) => {
        if (!step) return;
        gsap.set(step, { y: 0, opacity: 1 });
        const iconContainer = step.querySelector(".icon-container");
        const stepNum = step.querySelector(".step-num");
        gsap.set([iconContainer, stepNum], { borderColor: "rgba(255,255,255,0.3)", color: "#fff" });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const line = lineRef.current;
      if (!line) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 35%",
          scrub: 0.5,
        },
      });

      // 1. Draw connecting line
      tl.fromTo(
        line,
        { attr: { x2: "0%" } },
        { attr: { x2: "100%" }, ease: "none", duration: 2.0 }
      );

      // 2. Animate nodes sequentially
      stepRefs.current.forEach((step, idx) => {
        if (!step) return;
        const iconContainer = step.querySelector(".icon-container");
        const stepNum = step.querySelector(".step-num");
        const position = (idx / stepRefs.current.length) * 2.0;

        tl.fromTo(
          step,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power1.out" },
          position
        ).to(
          [iconContainer, stepNum],
          {
            borderColor: "rgba(255,255,255,0.35)",
            color: "#ffffff",
            duration: 0.15,
          },
          position + 0.1
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="workflow"
      className="relative w-full min-h-[80vh] flex flex-col justify-center bg-[#0b0d12] py-20 px-6 border-b border-white/5 overflow-hidden"
    >
      <div
        ref={containerRef}
        className="max-w-6xl mx-auto w-full relative z-20 flex flex-col items-center"
      >
        {/* Title */}
        <div className="text-center max-w-xl mb-16">
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            Architecture
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-3 font-sans">
            The Autonomous Recovery Pipeline
          </h2>
          <p className="text-xs text-neutral-400 mt-3 leading-relaxed font-mono">
            How Crucible traces crashes, inspects abstract syntax trees, and deploys verified patches.
          </p>
        </div>

        {/* 6-Step Workflow Nodes Grid */}
        <div className="w-full relative">
          {/* Decorative Connecting Lines (Desktop Only) */}
          <div className="hidden lg:block absolute left-10 right-10 top-[28px] h-[2px] z-0 pointer-events-none">
            <svg className="w-full h-[4px] overflow-visible">
              <line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />
              <line
                ref={lineRef}
                x1="0"
                y1="2"
                x2="0%"
                y2="2"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                className="flex flex-col items-center lg:items-start space-y-4 group select-none text-center lg:text-left"
              >
                {/* Node circle */}
                <div className="icon-container h-14 w-14 rounded-full bg-neutral-950 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:border-white/30 group-hover:text-white transition-all duration-300 relative shadow-xl">
                  {step.icon}
                  {/* Step counter */}
                  <span className="step-num absolute -top-1.5 -right-1.5 bg-neutral-900 border border-white/5 text-[9px] font-mono h-5 w-5 rounded-full flex items-center justify-center text-neutral-500 font-bold transition-all duration-300">
                    {step.id}
                  </span>
                </div>

                {/* Text details */}
                <div className="flex flex-col space-y-1.5">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider group-hover:text-neutral-200 transition-colors">
                    {step.label}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
