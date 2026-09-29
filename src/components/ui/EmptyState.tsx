import React from "react";
import { FolderOpen } from "lucide-react";
import { Button, ButtonProps } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: ButtonProps["variant"];
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 p-12 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-3 text-text-tertiary mb-4">
        {icon || <FolderOpen size={24} aria-hidden />}
      </div>
      <h3 className="font-display text-base font-bold text-text-primary mb-1">
        {title}
      </h3>
      <p className="max-w-sm text-xs text-text-tertiary leading-relaxed mb-6 font-mono">
        {description}
      </p>
      {action && (
        action.href ? (
          <a
            href={action.href}
            className="inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg bg-accent text-bg-0 hover:bg-accent-2 transition-colors"
          >
            {action.label}
          </a>
        ) : (
          <Button
            size="sm"
            variant={action.variant || "primary"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
