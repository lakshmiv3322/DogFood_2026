"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("DialogContent must be used within Dialog");

  const contentRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!ctx.open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") ctx.onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [ctx.open, ctx]);

  if (!ctx.open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={() => ctx.onOpenChange(false)}
      />

      {/* Modal Box */}
      <div
        ref={contentRef}
        className={`relative z-10 w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg animate-in fade-in zoom-in-95 ${className}`}
      >
        <button
          onClick={() => ctx.onOpenChange(false)}
          className="absolute right-4 top-4 rounded-md p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>{children}</div>;
}

export function DialogTitle({
  children,
  className = "",
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`font-display text-lg font-bold text-text-primary ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className = "",
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-xs text-text-tertiary ${className}`}>{children}</p>;
}

export function DialogFooter({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-6 flex items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}
