"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export interface ToastProps {
  id?: string;
  variant?: "success" | "warn" | "danger" | "info";
  title?: string;
  description: string;
  duration?: number;
  onClose?: () => void;
  open?: boolean;
}

export function Toast({
  variant = "info",
  title,
  description,
  duration = 5000,
  onClose,
  open = true,
}: ToastProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    if (!visible || duration <= 0) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const icons = {
    success: <CheckCircle2 className="text-success shrink-0" size={16} />,
    warn:    <AlertTriangle className="text-warn shrink-0" size={16} />,
    danger:  <AlertCircle className="text-danger shrink-0" size={16} />,
    info:    <Info className="text-accent shrink-0" size={16} />,
  }[variant];

  const borderStyles = {
    success: "border-success/30 bg-surface",
    warn:    "border-warn/30 bg-surface",
    danger:  "border-danger/30 bg-surface",
    info:    "border-accent/30 bg-surface",
  }[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg ${borderStyles} max-w-sm animate-in fade-in slide-in-from-bottom-2`}
    >
      <div className="mt-0.5">{icons}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-display text-xs font-bold text-text-primary mb-0.5">
            {title}
          </h4>
        )}
        <p className="font-mono text-xs text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="rounded p-1 text-text-tertiary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Dismiss toast"
      >
        <X size={14} />
      </button>
    </div>
  );
}
