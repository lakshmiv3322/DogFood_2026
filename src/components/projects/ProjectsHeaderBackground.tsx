"use client";

import React, { useEffect, useRef, useState } from "react";

export function ProjectsHeaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setIsPaused(true);
      return;
    }

    // Pause animation when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleVisibility = () => {
      if (document.hidden) setIsPaused(true);
      else if (containerRef.current) {
        // recheck
        const rect = containerRef.current.getBoundingClientRect();
        setIsPaused(rect.bottom < 0 || rect.top > window.innerHeight);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <div
        className="absolute -top-[50%] -left-[20%] w-[140%] h-[200%] opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 30%, rgba(0, 229, 208, 0.4), transparent 60%), radial-gradient(circle 500px at 70% 40%, rgba(255, 61, 110, 0.2), transparent 70%), radial-gradient(circle 400px at 50% 60%, rgba(35, 48, 88, 0.5), transparent 70%)",
          filter: "blur(60px)",
          animation: isPaused ? "none" : "pulse 8s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}
