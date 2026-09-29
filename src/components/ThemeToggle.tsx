"use client";

import { useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "dark" | "light" | "system";

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.setAttribute("data-theme", resolved);
}

function setCookie(theme: Theme) {
  document.cookie = `theme=${theme};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

export function ThemeToggle() {
  // Cycle: dark → light → system → dark
  const cycle = () => {
    const current = document.documentElement.getAttribute("data-theme-pref") as Theme ?? "dark";
    const next: Theme = current === "dark" ? "light" : current === "light" ? "system" : "dark";
    document.documentElement.setAttribute("data-theme-pref", next);
    applyTheme(next);
    setCookie(next);
  };

  // Listen for system preference changes when in "system" mode
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const pref = document.documentElement.getAttribute("data-theme-pref") as Theme;
      if (pref === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const pref = (typeof document !== "undefined"
    ? (document.documentElement.getAttribute("data-theme-pref") as Theme)
    : "dark") ?? "dark";

  return (
    <button
      onClick={cycle}
      aria-label={`Switch theme (current: ${pref})`}
      title={`Theme: ${pref} — click to cycle`}
      className="rounded-md p-2 text-text-secondary hover:text-text-primary hover:bg-bg-3 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      {pref === "dark" && <Moon size={16} aria-hidden />}
      {pref === "light" && <Sun size={16} aria-hidden />}
      {pref === "system" && <Monitor size={16} aria-hidden />}
    </button>
  );
}
