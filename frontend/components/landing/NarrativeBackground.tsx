"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define layout coordinates for each narrative section (positioned horizontally to span the screen layout)
const layouts = {
  // Timeline: Scattered, observing normal flow
  timeline: [
    { id: "entry", label: "Entry Point", x: 120, y: 150, type: "entry" },
    { id: "api", label: "API Route", x: 280, y: 180, type: "api" },
    { id: "ctrl", label: "Controller", x: 420, y: 220, type: "ctrl" },
    { id: "service", label: "Service", x: 560, y: 160, type: "service" },
    { id: "util", label: "Utility", x: 700, y: 250, type: "util" },
    { id: "ai", label: "AI Analysis Node", x: 850, y: 190, type: "ai" },
  ],
  // Dashboard: Broken/crashed state (Nodes drift apart, lines disconnect or stretch)
  dashboard: [
    { id: "entry", label: "Entry Point", x: 100, y: 130, type: "entry" },
    { id: "api", label: "API Route", x: 240, y: 260, type: "api" }, // drifted down
    { id: "ctrl", label: "Controller", x: 480, y: 100, type: "ctrl" }, // drifted up
    { id: "service", label: "Service", x: 520, y: 300, type: "service" }, // drifted down
    { id: "util", label: "Utility", x: 740, y: 140, type: "util" },
    { id: "ai", label: "AI Analysis Node", x: 890, y: 260, type: "ai" },
  ],
  // Workflow: AI node moves in to triage and analyze connections
  workflow: [
    { id: "entry", label: "Entry Point", x: 150, y: 180, type: "entry" },
    { id: "api", label: "API Route", x: 300, y: 180, type: "api" },
    { id: "ctrl", label: "Controller", x: 450, y: 180, type: "ctrl" },
    { id: "service", label: "Service", x: 600, y: 180, type: "service" },
    { id: "util", label: "Utility", x: 750, y: 180, type: "util" },
    { id: "ai", label: "AI Analysis Node", x: 450, y: 320, type: "ai" }, // centered below to analyze
  ],
  // Philosophy: Stabilized network, fully reconnected & symmetric
  philosophy: [
    { id: "entry", label: "Entry Point", x: 150, y: 200, type: "entry" },
    { id: "api", label: "API Route", x: 300, y: 140, type: "api" },
    { id: "ctrl", label: "Controller", x: 450, y: 200, type: "ctrl" },
    { id: "service", label: "Service", x: 600, y: 140, type: "service" },
    { id: "util", label: "Utility", x: 750, y: 200, type: "util" },
    { id: "ai", label: "AI Analysis Node", x: 450, y: 260, type: "ai" },
  ],
};

// Define node connection keys
const connections = [
  { from: "entry", to: "api" },
  { from: "api", to: "ctrl" },
  { from: "ctrl", to: "service" },
  { from: "service", to: "util" },
  { from: "ctrl", to: "ai" },
  { from: "ai", to: "service" },
];

export default function NarrativeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initial nodes data source
  const nodes = layouts.timeline;

  // 1. Mouse Follower (Throttled using requestAnimationFrame to prevent layout thrashing)
  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMoving = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY; // Align spotlight relative to scroll height
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateSpotlight);
      }
    };

    const updateSpotlight = () => {
      // Smooth interpolation (lerp)
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      spotlight.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;

      if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
        requestAnimationFrame(updateSpotlight);
      } else {
        isMoving = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 2. GSAP ScrollTrigger to Morph Graph Layout when entering sections
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const svg = svgRef.current;
    if (!svg) return;

    // Helper to update connection lines during morph
    const updateLines = () => {
      connections.forEach((conn) => {
        const fromNode = svg.querySelector(`[data-id="${conn.from}"] circle.core`);
        const toNode = svg.querySelector(`[data-id="${conn.to}"] circle.core`);
        const line = svg.querySelector(`[data-conn="${conn.from}-${conn.to}"]`);

        if (fromNode && toNode && line) {
          const fromX = fromNode.getAttribute("cx");
          const fromY = fromNode.getAttribute("cy");
          const toX = toNode.getAttribute("cx");
          const toY = toNode.getAttribute("cy");

          if (fromX && fromY && toX && toY) {
            line.setAttribute("x1", fromX);
            line.setAttribute("y1", fromY);
            line.setAttribute("x2", toX);
            line.setAttribute("y2", toY);
          }
        }
      });
    };

    const morphTo = (layoutKey: keyof typeof layouts) => {
      const targetLayout = layouts[layoutKey];

      // Tween each node's cx and cy coordinates smoothly
      targetLayout.forEach((targetNode) => {
        const coreCircle = svg.querySelector(`[data-id="${targetNode.id}"] circle.core`);
        const glowCircle = svg.querySelector(`[data-id="${targetNode.id}"] circle.glow`);
        const labelText = svg.querySelector(`[data-id="${targetNode.id}"] text`);

        if (coreCircle && glowCircle && labelText) {
          gsap.to([coreCircle, glowCircle], {
            attr: { cx: targetNode.x, cy: targetNode.y },
            duration: 0.9,
            ease: "power2.out",
            onUpdate: updateLines, // Sync connection lines on every tick
          });

          gsap.to(labelText, {
            attr: { x: targetNode.x + 10, y: targetNode.y + 4 },
            duration: 0.9,
            ease: "power2.out",
          });
        }
      });
    };

    // Setup scroll triggers
    const setupTrigger = (selector: string, layoutKey: keyof typeof layouts) => {
      ScrollTrigger.create({
        trigger: selector,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => morphTo(layoutKey),
        onEnterBack: () => morphTo(layoutKey),
      });
    };

    setupTrigger("#live-timeline", "timeline");
    setupTrigger("#dashboard-preview", "dashboard");
    setupTrigger("#workflow", "workflow");
    setupTrigger("#philosophy", "philosophy");

    // Initialize line coordinates on mount
    updateLines();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0b0d12]"
    >
      {/* Layer 3: CAD Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      {/* Layer 4: Interactive Mouse Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-radial-gradient opacity-40 blur-[80px] pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* Layer 2: Semantic Repository SVG Graph */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Node Connections (Lines) */}
        {connections.map((conn) => (
          <line
            key={`${conn.from}-${conn.to}`}
            data-conn={`${conn.from}-${conn.to}`}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeDasharray="2 3"
            opacity="0.4"
          />
        ))}

        {/* Dynamic Nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            data-id={node.id}
            className="transition-all duration-300"
          >
            {/* Soft background glow */}
            <circle
              className="glow"
              cx={node.x}
              cy={node.y}
              r={16}
              fill="url(#glow)"
              opacity={0.15}
            />
            {/* Inner node core */}
            <circle
              className="core"
              cx={node.x}
              cy={node.y}
              r={3.5}
              fill={node.type === "ai" ? "#c084fc" : "#ffffff"}
            />
            {/* Label markup */}
            <text
              x={node.x + 10}
              y={node.y + 4}
              fill="#94a3b8"
              fontSize="8"
              fontFamily="monospace"
              className="opacity-60 select-none"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
