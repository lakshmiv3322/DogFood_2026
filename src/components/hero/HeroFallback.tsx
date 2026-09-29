import React from "react";

export function HeroFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 229, 208, 0.18), transparent 70%), radial-gradient(circle 400px at 85% 30%, rgba(35, 48, 88, 0.4), transparent 80%), radial-gradient(circle 350px at 15% 60%, rgba(22, 31, 61, 0.5), transparent 70%), rgb(var(--bg-1))",
      }}
    >
      {/* Subtle procedural geometric grid line accents */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(var(--text-primary)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--text-primary)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
