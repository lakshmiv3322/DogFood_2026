"use client";

import React, { useEffect, useState } from "react";
import { Share2, Check, ExternalLink, Calendar, Users, Layers, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProjectSidePanelProps {
  project: {
    id: string;
    title: string;
    summary: string;
    repoUrl?: string | null;
    submittedAt: string;
    teamName: string;
    trackName: string;
    reviewCount: number;
    avgScore: string | null;
  };
}

export function ProjectSidePanel({ project }: ProjectSidePanelProps) {
  const [formattedDate, setFormattedDate] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const d = new Date(project.submittedAt);
      setFormattedDate(
        d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      setFormattedDate(project.submittedAt);
    }
  }, [project.submittedAt]);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${project.title} — DOGFOOD 2026`,
          text: project.summary,
          url: window.location.href,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0">
      {/* Desktop Sticky Panel / Mobile Collapsible Card */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:sticky lg:top-24 space-y-6">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-4">
            Project Overview
          </h3>

          <div className="space-y-4 font-mono text-xs">
            {/* Team */}
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <span className="flex items-center gap-2 text-text-tertiary">
                <Users size={14} />
                <span>Team</span>
              </span>
              <span className="font-semibold text-text-primary truncate max-w-[150px]">
                {project.teamName}
              </span>
            </div>

            {/* Track */}
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <span className="flex items-center gap-2 text-text-tertiary">
                <Layers size={14} />
                <span>Category</span>
              </span>
              <span className="font-semibold text-accent truncate max-w-[150px]">
                {project.trackName}
              </span>
            </div>

            {/* Submission Date formatted in viewer's locale */}
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <span className="flex items-center gap-2 text-text-tertiary">
                <Calendar size={14} />
                <span>Submitted</span>
              </span>
              <span className="text-text-secondary text-[11px]">
                {formattedDate || "—"}
              </span>
            </div>

            {/* Reviews */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-text-tertiary">
                <Award size={14} />
                <span>Status</span>
              </span>
              <span className="text-text-secondary">
                {project.reviewCount > 0 ? `${project.reviewCount} reviews` : "Pending review"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-surface-2 border border-border px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-text-primary hover:border-accent hover:text-accent transition-colors"
            >
              <span>Repository</span>
              <ExternalLink size={14} />
            </a>
          )}

          <Button
            variant="secondary"
            size="md"
            onClick={handleShare}
            className="w-full gap-2 text-xs"
          >
            {copied ? (
              <>
                <Check size={14} className="text-success" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Share Project</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
