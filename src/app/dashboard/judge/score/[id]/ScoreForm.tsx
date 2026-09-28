"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ScoreForm({
  projectId,
  initialFunctionality,
  initialQuality,
  initialComment,
}: {
  projectId: string;
  initialFunctionality: number;
  initialQuality: number;
  initialComment: string;
}) {
  const router = useRouter();

  // Committed (server-confirmed) values
  const [committed, setCommitted] = useState({
    functionality: initialFunctionality,
    quality: initialQuality,
    comment: initialComment,
  });

  // Optimistic (local-only) values that the user is editing
  const [functionality, setFunctionality] = useState(initialFunctionality);
  const [quality, setQuality] = useState(initialQuality);
  const [comment, setComment] = useState(initialComment);

  const [submitting, setSubmitting] = useState(false);
  const [optimisticSaved, setOptimisticSaved] = useState(false); // shown instantly
  const [error, setError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Track in-flight request so a retry doesn't race the previous call
  const inflight = useRef<AbortController | null>(null);

  const showToast = (msg: string) => {
    setError(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Cancel any in-flight request
    inflight.current?.abort();
    const ctrl = new AbortController();
    inflight.current = ctrl;

    // --- Optimistic update: mark as saved immediately ---
    setOptimisticSaved(true);
    setError("");

    const prev = { ...committed };
    // Treat local state as committed (optimistic)
    setCommitted({ functionality, quality, comment });

    setSubmitting(true);

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
        throw new Error(data.error || "Failed to submit score");
      }

      // Confirmed — stay on page (already showing success); refresh server data
      router.refresh();
      setTimeout(() => {
        router.push("/dashboard/judge");
      }, 800);
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return; // cancelled, don't touch state

      // --- Rollback optimistic update ---
      setCommitted(prev);
      setFunctionality(prev.functionality);
      setQuality(prev.quality);
      setComment(prev.comment);
      setOptimisticSaved(false);

      const msg = err instanceof Error ? err.message : "An error occurred";
      showToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Functionality score */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="font-mono text-xs uppercase tracking-widest text-[#e6ecff]">
            1. Functionality (0 - 10)
          </label>
          <span className="font-mono text-sm font-bold text-[#00e5d0]">
            {functionality} / 10
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={functionality}
          onChange={(e) => {
            setFunctionality(Number(e.target.value));
            setOptimisticSaved(false);
          }}
          className="accent-[#00e5d0] bg-[#121a32] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#6b7a9e]">
          <span>Broken / Incomplete</span>
          <span>Fully Functional</span>
        </div>
      </div>

      {/* Quality score */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="font-mono text-xs uppercase tracking-widest text-[#e6ecff]">
            2. Code Quality &amp; Architecture (0 - 10)
          </label>
          <span className="font-mono text-sm font-bold text-[#00e5d0]">
            {quality} / 10
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={quality}
          onChange={(e) => {
            setQuality(Number(e.target.value));
            setOptimisticSaved(false);
          }}
          className="accent-[#00e5d0] bg-[#121a32] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#6b7a9e]">
          <span>Poor Structure</span>
          <span>Exceptional Quality</span>
        </div>
      </div>

      {/* Comments */}
      <div className="flex flex-col gap-2">
        <label className="font-mono text-xs uppercase tracking-widest text-[#e6ecff]">
          Evaluation Notes &amp; Feedback
          <span className="text-[#3a4a70] normal-case font-normal ml-2">
            (max 2000 chars)
          </span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setOptimisticSaved(false);
          }}
          maxLength={2000}
          placeholder="Specific feedback on technical execution, originality, and strengths..."
          rows={4}
          className="w-full bg-[#0a0f1e] border border-[#1b2540] text-[#e6ecff] font-mono text-xs p-3 focus:outline-none focus:border-[#00e5d0] placeholder:text-[#3a4a70]"
        />
        <p className="font-mono text-[10px] text-[#3a4a70] text-right">
          {comment.length} / 2000
        </p>
      </div>

      {/* Error toast — visible on failure, auto-hides after 5s */}
      {toastVisible && error && (
        <div className="p-3 border border-[#ff3d6e] bg-[#ff3d6e]/10 text-[#ff3d6e] font-mono text-xs flex items-start justify-between gap-3">
          <span>⚠ {error} — your previous values have been restored.</span>
          <button
            type="button"
            onClick={() => setToastVisible(false)}
            className="text-[#ff3d6e] hover:text-[#e6ecff] transition-colors shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Optimistic success indicator */}
      {optimisticSaved && !error && (
        <div className="p-3 border border-[#00e5d0] bg-[#00e5d0]/10 text-[#00e5d0] font-mono text-xs">
          ✓ Score saved — confirming with server…
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#00e5d0] text-[#0a0f1e] font-mono font-bold text-xs tracking-widest uppercase py-3 px-6 hover:bg-[#e6ecff] transition-colors disabled:opacity-50"
      >
        {submitting ? "Saving…" : "Submit Score →"}
      </button>
    </form>
  );
}
