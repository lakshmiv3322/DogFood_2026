"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Users,
  Award,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface QueueProject {
  id: string;
  title: string;
  summary: string;
  repoUrl?: string | null;
  trackName: string;
  teamName: string;
  hasScore: boolean;
  funcScore?: number;
  qualScore?: number;
  comment?: string;
  updatedAt?: string;
}

interface JudgeQueueViewProps {
  projects: QueueProject[];
  judgeName: string;
}

export function JudgeQueueView({ projects, judgeName }: JudgeQueueViewProps) {
  const [filter, setFilter] = useState<"pending" | "done" | "all">("pending");
  const [selectedId, setSelectedId] = useState<string>(
    () => projects.find((p) => !p.hasScore)?.id ?? projects[0]?.id ?? ""
  );

  const reviewedCount = projects.filter((p) => p.hasScore).length;
  const totalCount = projects.length;
  const pendingCount = totalCount - reviewedCount;
  const percent = totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0;

  // Estimated time remaining: estimate ~3 minutes per pending submission
  const estMinutesRemaining = pendingCount * 3;

  const filteredProjects = useMemo(() => {
    if (filter === "pending") return projects.filter((p) => !p.hasScore);
    if (filter === "done") return projects.filter((p) => p.hasScore);
    return projects;
  }, [projects, filter]);

  const selectedProject = projects.find((p) => p.id === selectedId) ?? filteredProjects[0];

  const circumference = 251.3;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="space-y-8">
      {/* Top Header & Progress Ring Strip */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                Evaluation Queue
              </span>
              <span className="text-text-disabled">·</span>
              <span className="font-mono text-xs text-text-tertiary">{judgeName}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-text-primary">
              Judging Workspace
            </h1>
            <p className="font-mono text-xs text-text-secondary mt-1">
              Select an assigned project from the queue to start or revise your evaluation rubric.
            </p>
          </div>

          {/* Progress Ring & Estimated Time */}
          <div className="flex items-center gap-5 border-t sm:border-t-0 sm:border-l border-border/60 pt-4 sm:pt-0 sm:pl-6 shrink-0">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
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
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-text-primary">
                {percent}%
              </span>
            </div>

            <div className="font-mono text-xs">
              <div className="font-bold text-text-primary">
                {reviewedCount} of {totalCount} scored
              </div>
              <div className="text-text-tertiary flex items-center gap-1.5 mt-0.5 text-[11px]">
                <Clock size={12} className="text-accent" />
                <span>
                  {pendingCount === 0
                    ? "Queue complete"
                    : `~${estMinutesRemaining} mins remaining`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Queue & Preview Workspace */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Queue with Filter Tabs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-lg border border-border">
            <button
              onClick={() => setFilter("pending")}
              className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors ${
                filter === "pending"
                  ? "bg-accent text-bg-0 shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter("done")}
              className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors ${
                filter === "done"
                  ? "bg-accent text-bg-0 shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Reviewed ({reviewedCount})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-colors ${
                filter === "all"
                  ? "bg-accent text-bg-0 shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              All ({totalCount})
            </button>
          </div>

          {/* Project List */}
          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center font-mono text-xs text-text-tertiary">
                No projects match this queue filter.
              </div>
            ) : (
              filteredProjects.map((p) => {
                const isSelected = selectedProject?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left rounded-xl border p-4 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isSelected
                        ? "border-accent bg-surface-2 shadow-sm"
                        : "border-border bg-surface hover:border-text-tertiary hover:bg-bg-3"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[10px] uppercase font-bold text-accent truncate">
                        {p.trackName}
                      </span>
                      {p.hasScore ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-success font-semibold">
                          <CheckCircle2 size={12} />
                          <span>Scored</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-warn font-semibold">
                          <Clock size={12} />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-sm font-bold text-text-primary truncate mb-1">
                      {p.title}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary pt-2 border-t border-border/40">
                      <span className="truncate">{p.teamName}</span>
                      {p.hasScore && p.funcScore !== undefined && p.qualScore !== undefined && (
                        <span className="text-text-primary font-bold">
                          {((p.funcScore + p.qualScore) / 2).toFixed(1)} / 10
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Project Preview (7 cols) */}
        <div className="lg:col-span-7">
          {selectedProject ? (
            <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="accent" size="sm">
                    {selectedProject.trackName}
                  </Badge>
                  {selectedProject.hasScore ? (
                    <Badge variant="success" size="sm">
                      Evaluation Completed
                    </Badge>
                  ) : (
                    <Badge variant="warn" size="sm">
                      Awaiting Score
                    </Badge>
                  )}
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-text-primary leading-tight mb-2">
                  {selectedProject.title}
                </h2>

                <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary mb-4">
                  <Users size={14} className="text-accent" />
                  <span>Team:</span>
                  <strong className="text-text-secondary">{selectedProject.teamName}</strong>
                </div>

                <p className="font-mono text-xs sm:text-sm text-text-secondary leading-relaxed bg-bg-2 p-4 rounded-lg border border-border/60">
                  {selectedProject.summary}
                </p>
              </div>

              {/* Existing Score Details (if already reviewed) */}
              {selectedProject.hasScore && (
                <div className="rounded-lg border border-border/80 bg-surface-2 p-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-text-tertiary">
                    <span>Functionality:</span>
                    <strong className="text-accent">{selectedProject.funcScore} / 10</strong>
                  </div>
                  <div className="flex justify-between text-text-tertiary">
                    <span>Quality &amp; Architecture:</span>
                    <strong className="text-teal">{selectedProject.qualScore} / 10</strong>
                  </div>
                  {selectedProject.comment && (
                    <div className="pt-2 border-t border-border/40 text-[11px] text-text-secondary italic">
                      "{selectedProject.comment}"
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href={`/dashboard/judge/score/${selectedProject.id}`}
                  className="w-full sm:flex-1"
                >
                  <Button variant="primary" size="lg" className="w-full gap-2">
                    <span>{selectedProject.hasScore ? "Edit Evaluation" : "Score Project"}</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>

                {selectedProject.repoUrl && (
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-surface-2 border border-border px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-text-primary hover:border-accent hover:text-accent transition-colors"
                  >
                    <span>Repo</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center font-mono text-xs text-text-tertiary">
              Select a project from the queue on the left to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
