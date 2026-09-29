import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "warn" | "danger" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
  }[size];

  const variantClasses = {
    default: "bg-surface-2 text-text-secondary border-border",
    accent:  "bg-accent/10 text-accent border-accent/30",
    success: "bg-success/10 text-success border-success/30",
    warn:    "bg-warn/10 text-warn border-warn/30",
    danger:  "bg-danger/10 text-danger border-danger/30",
    outline: "bg-transparent text-text-tertiary border-border",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono uppercase tracking-wider font-semibold ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
