"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled runtime error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <Container size="sm" className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 border border-danger/30 text-danger mb-6">
            <AlertCircle size={32} />
          </div>

          <span className="font-mono text-xs font-bold uppercase tracking-widest text-danger">
            [ System Exception 500 ]
          </span>

          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-text-primary mt-2 mb-4">
            Application Error
          </h1>

          <p className="font-mono text-xs sm:text-sm text-text-secondary leading-relaxed mb-8 max-w-md mx-auto">
            An unexpected error occurred during page execution. Our monitoring pipeline has recorded the event.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => reset()}
              className="gap-2"
            >
              <RefreshCw size={16} />
              <span>Retry Request</span>
            </Button>
            <Link href="/">
              <Button size="lg" variant="secondary">
                Return Home
              </Button>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
