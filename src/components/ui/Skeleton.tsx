import React from "react";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export function Skeleton({
  variant = "rectangular",
  className = "",
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "h-4 w-full rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  }[variant];

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`animate-pulse bg-bg-3/60 ${variantStyles} ${className}`}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
