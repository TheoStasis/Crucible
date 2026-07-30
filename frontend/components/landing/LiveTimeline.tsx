import React, { useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TimelineEvent {
  time: string;
  label: string;
  status: "success" | "warning" | "info";
  icon: React.ReactNode;
  description: string;
}

const events: TimelineEvent[] = [
  {
    time: "12:01:22",
    label: "Repository Imported",
    status: "success",
    icon: <CheckCircle2 size={14} />,
    description: "Compiling code graph and spawning local container on port 3001.",
  },
  {
    time: "12:01:28",
    label: "Health Check Failed",
    status: "warning",
    icon: <AlertTriangle size={14} />,
    description: "Sentinel probes detect HTTP 500 Unhandled Exception (massive memory fault).",
  },
  {
    time: "12:01:29",
    label: "Diagnosis Complete",
    status: "success",
    icon: <CheckCircle2 size={14} />,
    description: "LLM agent isolates AST stack trace and pinpoints root cause bug.",
  },
  {
    time: "12:01:30",
    label: "Patch Generated",
    status: "success",
    icon: <CheckCircle2 size={14} />,
    description: "Hotpatch compiled and validated against sandbox test harness.",
  },
  {
    time: "12:01:31",
    label: "Application Restored",
    status: "success",
    icon: <CheckCircle2 size={14} />,
    description: "Live hotpatch injected. Service back online with 0ms downtime.",
  },
];

export default function LiveTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // In reduced motion mode, make everything visible immediately
      gsap.set(lineRef.current, { scaleY: 1 });
      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.set(card.querySelector(".timeline-dot"), { scale: 1, opacity: 1 });
        gsap.set(card.querySelector(".timeline-body"), { x: 0, opacity: 1 });
        gsap.set(card.querySelector(".timeline-time"), { opacity: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.5,
        },
      });

      // 1. Animate vertical timeline path
      tl.fromTo(
        lineRef.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", duration: 2.0 }
      );

      // 2. Animate nodes, cards, and timestamps sequentially along the timeline path
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const dot = card.querySelector(".timeline-dot");
        const body = card.querySelector(".timeline-body");
        const time = card.querySelector(".timeline-time");

        const position = (idx / cardRefs.current.length) * 2.0;

        tl.fromTo(dot, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25 }, position)
          .fromTo(body, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, position + 0.05)
          .fromTo(time, { opacity: 0 }, { opacity: 1, duration: 0.2 }, position + 0.15);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="live-timeline"
      className="relative w-full min-h-[70vh] flex flex-col justify-center bg-[#0b0d12] py-20 px-6 overflow-hidden border-b border-white/5"
    >
      <div
        ref={containerRef}
        className="max-w-4xl mx-auto w-full relative z-20 flex flex-col md:flex-row gap-10 md:gap-20 items-start"
      >
        {/* Left column: Context Heading */}
        <div className="max-w-xs flex flex-col justify-center">
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            Telemetry Loop
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-3 font-sans">
            5 Seconds to Full Recovery
          </h2>
          <p className="text-xs text-neutral-400 mt-4 leading-relaxed font-mono">
            Crucible works in real-time. When an event fires, our system monitors, isolates, and repairs with zero developer intervention.
          </p>
        </div>

        {/* Right column: Animated Timeline */}
        <div className="flex-grow flex-1 relative pl-8 select-none">
          {/* Vertical Timeline Bar */}
          <div
            ref={lineRef}
            className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-neutral-800 origin-top"
          />

          {/* Timeline Event Cards */}
          <div className="space-y-8">
            {events.map((event, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="relative flex gap-6 items-start group"
              >
                {/* Status Dot / Icon */}
                <div
                  className={`timeline-dot absolute -left-[25px] h-[19px] w-[19px] rounded-full flex items-center justify-center border z-10 transition-colors duration-300 ${
                    event.status === "warning"
                      ? "bg-neutral-950 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 group-hover:border-neutral-500 group-hover:text-white"
                  }`}
                >
                  {event.icon}
                </div>

                {/* Event Details */}
                <div className="timeline-body flex-1 flex flex-col md:flex-row md:items-baseline justify-between gap-2 p-4 bg-neutral-950/40 border border-white/5 rounded-xl hover:bg-neutral-950/60 hover:border-white/10 transition-all duration-300">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono font-bold text-white tracking-wide">
                      {event.label}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {event.description}
                    </span>
                  </div>
                  <span className="timeline-time text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap self-start md:self-auto">
                    {event.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
