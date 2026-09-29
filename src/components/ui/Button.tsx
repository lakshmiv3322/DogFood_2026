import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider transition-all duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeClasses = {
      sm: "text-[11px] px-3 py-1.5 rounded-md gap-1.5",
      md: "text-xs px-4 py-2.5 rounded-lg gap-2",
      lg: "text-sm px-6 py-3.5 rounded-lg gap-2.5",
    }[size];

    const variantClasses = {
      primary:
        "bg-accent text-bg-0 hover:bg-accent-2 shadow-sm hover:shadow-glow",
      secondary:
        "bg-surface text-text-primary border border-border hover:bg-bg-3 hover:border-text-tertiary",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-3",
      danger:
        "bg-danger text-white hover:bg-danger/90 shadow-sm",
      outline:
        "bg-transparent border border-accent text-accent hover:bg-accent/10",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading && (
          <Loader2 className="animate-spin shrink-0" size={size === "sm" ? 12 : 14} aria-hidden />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
