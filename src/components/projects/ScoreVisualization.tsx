"use client";

import React, { useEffect, useState } from "react";
import { Star, ShieldAlert } from "lucide-react";

interface ScoreVisualizationProps {
  funcAvg: number | null;
  qualAvg: number | null;
  overallAvg: number | null;
  reviewCount: number;
}

export function ScoreVisualization({
  funcAvg,
  qualAvg,
  overallAvg,
  reviewCount,
}: ScoreVisualizationProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      setAnimated(true);
    } else {
      const t = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(t);
    }
  }, []);

  if (reviewCount === 0 || overallAvg === null) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/60 p-8 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-bg-3 text-text-tertiary mb-3">
          <ShieldAlert size={20} />
        </div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary mb-1">
          Not Yet Reviewed
        </h3>
        <p className="font-mono text-xs text-text-tertiary max-w-xs mx-auto">
          Judges have not submitted evaluations for this project yet. Scores will appear once reviews are completed.
        </p>
      </div>
    );
  }

  // Radius for radial progress: circumference = 2 * PI * 40 = 251.3
  const circumference = 251.3;
  const strokeDashoffset = animated
    ? circumference - (overallAvg / 10) * circumference
    : circumference;

  const funcPercent = animated ? Math.min(100, (funcAvg ?? 0) * 10) : 0;
  const qualPercent = animated ? Math.min(100, (qualAvg ?? 0) * 10) : 0;

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-8 justify-between">
        {/* Overall Radial Meter */}
        <div className="flex items-center gap-5">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="rgb(var(--border))"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="rgb(var(--accent-1))"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 800ms cubic-bezier(0.33, 1, 0.68, 1)",
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-display text-2xl font-black text-text-primary">
                {overallAvg.toFixed(1)}
              </span>
              <span className="font-mono text-[9px] text-text-tertiary uppercase">/ 10</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-accent mb-1">
              <Star size={14} className="fill-accent text-accent" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Consensus Score
              </span>
            </div>
            <p className="font-mono text-xs text-text-secondary">
              Based on <strong className="text-text-primary">{reviewCount}</strong>{" "}
              {reviewCount === 1 ? "independent review" : "independent reviews"}
            </p>
          </div>
        </div>

        {/* Dual Axis Bars (Functionality & Code Quality) */}
        <div className="w-full sm:w-64 space-y-3.5 border-t sm:border-t-0 sm:border-l border-border/60 pt-4 sm:pt-0 sm:pl-6">
          {/* Functionality */}
          <div>
            <div className="flex justify-between font-mono text-xs mb-1">
              <span className="text-text-secondary">Functionality</span>
              <span className="text-accent font-bold">{(funcAvg ?? 0).toFixed(1)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-bg-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                style={{ width: `${funcPercent}%` }}
              />
            </div>
          </div>

          {/* Quality */}
          <div>
            <div className="flex justify-between font-mono text-xs mb-1">
              <span className="text-text-secondary">Architecture &amp; Quality</span>
              <span className="text-teal font-bold">{(qualAvg ?? 0).toFixed(1)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-bg-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00e5d0] transition-all duration-700 ease-out"
                style={{ width: `${qualPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
