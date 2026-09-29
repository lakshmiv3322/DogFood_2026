"use client";

import React, { useEffect } from "react";
import { Container } from "@/components/shell/Container";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Projects error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-1 p-6">
      <Container size="sm" className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 border border-danger/30 text-danger mb-4">
          <AlertCircle size={28} />
        </div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-text-primary mb-2">
          Unable to Load Projects
        </h1>
        <p className="font-mono text-xs text-text-secondary leading-relaxed mb-6 max-w-md mx-auto">
          We encountered a temporary issue while querying the project registry. Please check your connection and retry.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => reset()}
            className="gap-2"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </Button>
          <a
            href="/"
            className="inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg bg-surface text-text-primary border border-border hover:bg-bg-3"
          >
            Back to Home
          </a>
        </div>
      </Container>
    </div>
  );
}
