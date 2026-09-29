"use client";

import React, { useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface FeedbackCardProps {
  judgeLabel: string;
  funcScore: number;
  qualScore: number;
  comment: string;
}

export function FeedbackCard({
  judgeLabel,
  funcScore,
  qualScore,
  comment,
}: FeedbackCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = comment.length > 220;
  const displayedComment = isLong && !expanded ? `${comment.slice(0, 220)}...` : comment;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-colors">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent border border-accent/30 font-mono text-xs font-bold">
            <MessageSquare size={13} />
          </div>
          <span className="font-mono text-xs font-semibold text-text-primary uppercase tracking-wider">
            {judgeLabel}
          </span>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-text-tertiary">
            Func: <strong className="text-accent">{funcScore}</strong>
          </span>
          <span className="text-text-tertiary">
            Quality: <strong className="text-teal">{qualScore}</strong>
          </span>
        </div>
      </div>

      <p className="font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
        {displayedComment}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2.5 font-mono text-[11px] text-accent hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              <span>Show less</span>
              <ChevronUp size={12} />
            </>
          ) : (
            <>
              <span>Read more</span>
              <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
