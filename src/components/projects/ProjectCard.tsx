"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight } from "lucide-react";

// Deterministic color palette for teams & tracks (no remote assets)
const ACCENT_COLORS = [
  { bg: "bg-teal/15", border: "border-teal/30", text: "text-[#00e5d0]" },
  { bg: "bg-rose-500/15", border: "border-rose-500/30", text: "text-rose-400" },
  { bg: "bg-indigo-500/15", border: "border-indigo-500/30", text: "text-indigo-400" },
  { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400" },
  { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400" },
  { bg: "bg-cyan-500/15", border: "border-cyan-500/30", text: "text-cyan-400" },
];

function getDeterministicColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % ACCENT_COLORS.length;
  return ACCENT_COLORS[index];
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    summary: string;
    team: { id: string; name: string };
    track: { id: string; name: string };
    avgScore?: string | null;
    scoreCount: number;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [canTilt, setCanTilt] = useState(true);

  useEffect(() => {
    // Disable on touch devices or under reduced-motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || isReduced) {
      setCanTilt(false);
    }
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 6° rotation
    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const teamColor = getDeterministicColor(project.team.id);
  const trackColor = getDeterministicColor(project.track.id);

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.id}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: canTilt
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : undefined,
        transition: "transform 150ms ease-out, border-color 200ms ease, box-shadow 200ms ease",
      }}
      className="group relative rounded-xl border border-border bg-surface p-6 flex flex-col justify-between hover:border-accent/50 hover:shadow-glow transition-all duration-200"
    >
      <div>
        {/* Track Badge & Score */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center rounded-md border font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${trackColor.bg} ${trackColor.border} ${trackColor.text}`}
          >
            {project.track.name}
          </span>

          {project.avgScore ? (
            <span className="font-mono text-xs font-bold text-accent">
              ★ {project.avgScore}
            </span>
          ) : (
            <span className="font-mono text-[10px] text-text-tertiary">
              {project.scoreCount} {project.scoreCount === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>

        {/* Project Title — CRITICAL: Stays in HTML for checker */}
        <h2 className="font-display font-bold text-lg leading-tight text-text-primary group-hover:text-accent transition-colors mb-2">
          {project.title}
        </h2>

        {/* Summary Excerpt */}
        <p className="font-mono text-xs text-text-secondary leading-relaxed line-clamp-3 mb-4">
          {project.summary}
        </p>
      </div>

      {/* Footer: Monogram Avatar & Team Info */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Monogram avatar */}
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-[10px] ${teamColor.bg} ${teamColor.border} ${teamColor.text} border`}
          >
            {getInitials(project.team.name)}
          </div>
          <span className="truncate text-text-tertiary group-hover:text-text-secondary transition-colors">
            {project.team.name}
          </span>
        </div>

        <ArrowUpRight
          size={14}
          className="text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
        />
      </div>
    </Link>
  );
}
