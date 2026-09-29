"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Save,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ScoreFormProps {
  projectId: string;
  initialFunctionality: number;
  initialQuality: number;
  initialComment: string;
  nextProjectId?: string | null;
  previousScores?: number[];
}

export default function ScoreForm({
  projectId,
  initialFunctionality,
  initialQuality,
  initialComment,
  nextProjectId,
  previousScores = [],
}: ScoreFormProps) {
  const router = useRouter();
  const storageKey = `judge_score_draft_${projectId}`;

  const [functionality, setFunctionality] = useState(initialFunctionality);
  const [quality, setQuality] = useState(initialQuality);
  const [comment, setComment] = useState(initialComment);

  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);

  // Restore draft from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.functionality === "number") setFunctionality(parsed.functionality);
        if (typeof parsed.quality === "number") setQuality(parsed.quality);
        if (typeof parsed.comment === "string") setComment(parsed.comment);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  // Autosave draft every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({ functionality, quality, comment, time: Date.now() })
        );
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 1500);
      } catch {
        // ignore
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [functionality, quality, comment, storageKey]);

  // Live weighted total: 50% functionality + 50% quality
  const weightedTotal = ((functionality + quality) / 2).toFixed(1);

  // Guard rail: check if all prior scores are identical
  const hasUniformScores =
    previousScores.length >= 3 &&
    previousScores.every((s) => s === previousScores[0]) &&
    Number(weightedTotal) === previousScores[0];

  const inflight = useRef<AbortController | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitting) return;

    inflight.current?.abort();
    const ctrl = new AbortController();
    inflight.current = ctrl;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/judge/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          functionality,
          quality,
          comment,
        }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit evaluation");
      }

      // Success: clear draft & trigger success toast
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // ignore
      }

      setSuccessToast(true);
      router.refresh();

      // Auto-advance to next pending project or queue
      setTimeout(() => {
        if (nextProjectId) {
          router.push(`/dashboard/judge/score/${nextProjectId}`);
        } else {
          router.push("/dashboard/judge");
        }
      }, 700);
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return;
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during submission."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Keyboard controls for segmented numbers
  const handleKeyDown = (
    e: React.KeyboardEvent,
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number
  ) => {
    if (e.key >= "0" && e.key <= "9") {
      setter(Number(e.key));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setter(Math.max(0, current - 1));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setter(Math.min(10, current + 1));
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Non-blocking Guard Rail Warning */}
      {hasUniformScores && (
        <div className="flex items-start gap-3 rounded-lg border border-warn/40 bg-warn/10 p-3.5 text-xs font-mono text-warn">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Scoring Consistency Notice:</span> All your prior evaluations have received identical total scores ({previousScores[0]} / 10). Please ensure independent calibration across submissions.
          </div>
        </div>
      )}

      {/* Error Banner with Retry */}
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-danger/40 bg-danger/10 p-4 text-xs font-mono text-danger">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="danger"
            onClick={() => handleSubmit()}
            className="gap-1 text-[11px] shrink-0"
          >
            <RefreshCw size={12} />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* Rubric Axis 1: Functionality */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-mono text-xs uppercase font-bold text-text-primary tracking-wider block">
              1. Functionality &amp; Completeness
            </label>
            <p className="font-mono text-[11px] text-text-tertiary">
              Operational stability, working demo, execution completeness (0–10).
            </p>
          </div>
          <span className="font-display text-xl font-bold text-accent">
            {functionality} / 10
          </span>
        </div>

        {/* Segmented 0-10 Button Bar */}
        <div
          role="radiogroup"
          aria-label="Functionality Score"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, setFunctionality, functionality)}
          className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
        >
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={functionality === i}
              onClick={() => setFunctionality(i)}
              className={`h-10 rounded-md font-mono text-xs font-bold transition-all duration-150 ${
                functionality === i
                  ? "bg-accent text-bg-0 shadow-sm scale-105"
                  : "bg-surface-2 text-text-secondary border border-border hover:border-text-tertiary hover:text-text-primary"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Rubric Axis 2: Code Quality & Architecture */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-mono text-xs uppercase font-bold text-text-primary tracking-wider block">
              2. Code Quality &amp; Engineering Architecture
            </label>
            <p className="font-mono text-[11px] text-text-tertiary">
              Maintainability, technical architecture, and documentation (0–10).
            </p>
          </div>
          <span className="font-display text-xl font-bold text-teal">
            {quality} / 10
          </span>
        </div>

        {/* Segmented 0-10 Button Bar */}
        <div
          role="radiogroup"
          aria-label="Quality Score"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, setQuality, quality)}
          className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
        >
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={quality === i}
              onClick={() => setQuality(i)}
              className={`h-10 rounded-md font-mono text-xs font-bold transition-all duration-150 ${
                quality === i
                  ? "bg-[#00e5d0] text-bg-0 shadow-sm scale-105"
                  : "bg-surface-2 text-text-secondary border border-border hover:border-text-tertiary hover:text-text-primary"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Live Weighted Score Display */}
      <div className="rounded-xl border border-accent/40 bg-surface-2 p-5 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider block">
            Weighted Score Total (50% / 50%)
          </span>
          <span className="font-mono text-[11px] text-text-secondary">
            Keys 0–9 set score · Enter to submit
          </span>
        </div>
        <div className="text-right">
          <span className="font-display text-3xl font-black text-accent">
            {weightedTotal}
          </span>
          <span className="font-mono text-xs text-text-tertiary ml-1">/ 10</span>
        </div>
      </div>

      {/* Qualitative Comment Box with Character Counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="comment-input"
            className="font-mono text-xs uppercase font-bold text-text-secondary tracking-wider"
          >
            Qualitative Feedback
          </label>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            {draftSaved && (
              <span className="text-text-tertiary flex items-center gap-1">
                <Save size={10} />
                <span>Draft autosaved</span>
              </span>
            )}
            <span
              className={
                comment.length > 1950 ? "text-danger font-bold" : "text-text-tertiary"
              }
            >
              {comment.length} / 2000
            </span>
          </div>
        </div>

        <textarea
          id="comment-input"
          value={comment}
          maxLength={2000}
          rows={4}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Constructive feedback for the team regarding architectural decisions, UX nuances, or areas for improvement..."
          className="w-full rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs text-text-primary placeholder:text-text-disabled focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-text-tertiary">
          Scores are upserted transactionally with instant rollback protection.
        </span>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={submitting}
            className="w-full sm:w-auto gap-2"
          >
            <span>{nextProjectId ? "Submit & Next" : "Submit Score"}</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Success Toast Overlay */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-success/40 bg-surface px-4 py-3 shadow-lg font-mono text-xs text-success animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} />
          <span>Evaluation saved. Advancing...</span>
        </div>
      )}
    </form>
  );
}
