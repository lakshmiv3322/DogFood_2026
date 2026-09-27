"use client";

import { useState } from "react";
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
  const [functionality, setFunctionality] = useState(initialFunctionality);
  const [quality, setQuality] = useState(initialQuality);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/judge/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          functionality: Number(functionality),
          quality: Number(quality),
          comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit score");
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => {
        router.push("/dashboard/judge");
      }, 800);
    } catch (err: any) {
      setError(err.message || "An error occurred");
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
            1. Functionality (1 - 5)
          </label>
          <span className="font-mono text-sm font-bold text-[#00e5d0]">
            {functionality} / 5
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={functionality}
          onChange={(e) => setFunctionality(Number(e.target.value))}
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
            2. Code Quality & Architecture (1 - 5)
          </label>
          <span className="font-mono text-sm font-bold text-[#00e5d0]">
            {quality} / 5
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
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
          Evaluation Notes & Feedback
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Specific feedback on technical execution, originality, and strengths..."
          rows={4}
          className="w-full bg-[#0a0f1e] border border-[#1b2540] text-[#e6ecff] font-mono text-xs p-3 focus:outline-none focus:border-[#00e5d0] placeholder:text-[#3a4a70]"
        />
      </div>

      {error && (
        <div className="p-3 border border-[#ff3d6e] bg-[#ff3d6e]/10 text-[#ff3d6e] font-mono text-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 border border-[#00e5d0] bg-[#00e5d0]/10 text-[#00e5d0] font-mono text-xs">
          Score saved successfully! Redirecting...
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#00e5d0] text-[#0a0f1e] font-mono font-bold text-xs tracking-widest uppercase py-3 px-6 hover:bg-[#e6ecff] transition-colors disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Submit Score →"}
      </button>
    </form>
  );
}
