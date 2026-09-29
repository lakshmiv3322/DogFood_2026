import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({
  children,
  size = "xl",
  className = "",
  ...props
}: ContainerProps) {
  const maxW = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  }[size];

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxW} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
