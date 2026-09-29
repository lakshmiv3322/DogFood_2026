"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  FolderGit2,
  SlidersHorizontal,
  Compass,
} from "lucide-react";

interface HeaderProps {
  user?: {
    id?: string;
    name: string;
    role: "ORGANIZER" | "JUDGE" | "PARTICIPANT" | string;
    email?: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const dashboardHref =
    user?.role === "ORGANIZER"
      ? "/dashboard/organizer"
      : user?.role === "JUDGE"
      ? "/dashboard/judge"
      : "/projects";

  const roleBadgeStyle =
    user?.role === "ORGANIZER"
      ? "bg-danger/10 text-danger border-danger/30"
      : user?.role === "JUDGE"
      ? "bg-accent/10 text-accent border-accent/30"
      : "bg-surface-2 text-text-secondary border-border";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-bg-1/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Desktop Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-display text-sm font-bold tracking-wider text-text-primary hover:text-accent transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-bg-0 font-mono font-black text-xs">
              DF
            </div>
            <span>
              DOGFOOD{" "}
              <span className="text-text-tertiary group-hover:text-accent font-normal">
                2026
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider uppercase text-text-secondary">
            <Link
              href="/projects"
              className={`hover:text-text-primary transition-colors ${
                pathname === "/projects" ? "text-accent font-bold" : ""
              }`}
            >
              Projects
            </Link>
            <Link
              href="/projects#tracks"
              className="hover:text-text-primary transition-colors"
            >
              Tracks
            </Link>
            <a
              href="/#judging"
              className="hover:text-text-primary transition-colors"
            >
              How judging works
            </a>
          </nav>
        </div>

        {/* Right side: Role-aware profile / Sign in + ThemeToggle + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-primary hover:bg-bg-3 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <User size={12} />
                </div>
                <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                <span
                  className={`rounded border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${roleBadgeStyle}`}
                >
                  {user.role.toLowerCase()}
                </span>
                <ChevronDown size={14} className="text-text-tertiary" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-surface p-1 shadow-lg z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-border text-xs">
                      <p className="font-semibold text-text-primary truncate">{user.name}</p>
                      <p className="text-[11px] text-text-tertiary truncate">{user.email ?? ""}</p>
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded px-3 py-2 text-xs text-text-secondary hover:bg-bg-3 hover:text-text-primary transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span>Dashboard</span>
                    </Link>

                    <form action="/api/auth/logout" method="post">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 rounded px-3 py-2 text-xs text-danger hover:bg-danger/10 transition-colors"
                      >
                        <LogOut size={14} />
                        <span>Sign out</span>
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signup"
                className="hidden sm:inline-flex items-center justify-center rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-mono font-semibold tracking-wider uppercase text-text-primary hover:border-accent hover:text-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-accent px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase text-bg-0 hover:bg-accent-2 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-border bg-surface p-1.5 text-text-secondary hover:text-text-primary hover:border-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-border bg-bg-1/95 backdrop-blur-md px-4 py-4 space-y-3 font-mono text-xs animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <Link
              href="/projects"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
            >
              <FolderGit2 size={15} className="text-accent" />
              <span>Project Gallery</span>
            </Link>
            <Link
              href="/projects#tracks"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
            >
              <SlidersHorizontal size={15} className="text-accent" />
              <span>Tracks &amp; Categories</span>
            </Link>
            <a
              href="/#judging"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
            >
              <Compass size={15} className="text-accent" />
              <span>How judging works</span>
            </a>
          </div>

          {!user && (
            <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
              <Link
                href="/signup"
                onClick={() => setMobileNavOpen(false)}
                className="w-full text-center rounded-md border border-border bg-surface py-2 text-xs font-mono font-bold uppercase tracking-wider text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                Register Team
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileNavOpen(false)}
                className="w-full text-center rounded-md bg-accent py-2 text-xs font-mono font-bold uppercase tracking-wider text-bg-0 hover:bg-accent-2 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
