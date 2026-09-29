"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface Track {
  id: string;
  name: string;
}

interface ProjectsToolbarProps {
  tracks: Track[];
  totalResults: number;
}

export function ProjectsToolbar({ tracks, totalResults }: ProjectsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get("q") ?? "";
  const currentTrack = searchParams.get("track") ?? "";
  const currentSort = searchParams.get("sort") ?? "newest";

  const [searchTerm, setSearchTerm] = useState(currentQ);

  // Sync internal search input with URL when navigated externally
  useEffect(() => {
    setSearchTerm(currentQ);
  }, [currentQ]);

  // Debounced 200ms URL sync for search input
  useEffect(() => {
    if (searchTerm === currentQ) return;
    const timer = setTimeout(() => {
      updateUrl({ q: searchTerm || null, page: "1" });
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`/projects?${params.toString()}`);
    });
  };

  const handleTrackSelect = (trackId: string | null) => {
    updateUrl({ track: trackId, page: "1" });
  };

  const handleSortChange = (sortVal: string) => {
    updateUrl({ sort: sortVal, page: "1" });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push("/projects");
    });
  };

  const hasActiveFilters = Boolean(currentQ || currentTrack || (currentSort && currentSort !== "newest"));

  return (
    <div className="space-y-4 mb-8">
      {/* Top row: Search, Sort & Results live count */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input with progressive enhancement fallback form */}
        <form
          method="get"
          action="/projects"
          onSubmit={(e) => {
            e.preventDefault();
            updateUrl({ q: searchTerm || null, page: "1" });
          }}
          className="relative flex-1 max-w-md"
        >
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
            aria-hidden
          />
          <input
            type="text"
            name="q"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, keywords, or summary..."
            className="w-full rounded-lg border border-border bg-surface-2 pl-10 pr-9 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-disabled transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                updateUrl({ q: null, page: "1" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          {currentTrack && <input type="hidden" name="track" value={currentTrack} />}
          {currentSort && <input type="hidden" name="sort" value={currentSort} />}
        </form>

        {/* Right side: Sort Dropdown & Result Count */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          {/* Result Count with aria-live */}
          <div
            aria-live="polite"
            className="font-mono text-xs text-text-tertiary whitespace-nowrap"
          >
            {isPending ? (
              <span className="text-accent animate-pulse">Filtering...</span>
            ) : (
              <span>
                <strong className="text-text-primary">{totalResults}</strong>{" "}
                {totalResults === 1 ? "project" : "projects"} found
              </span>
            )}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-text-tertiary shrink-0" aria-hidden />
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-text-secondary focus:border-accent focus:outline-none"
              aria-label="Sort projects"
            >
              <option value="newest">Sort: Newest</option>
              <option value="score">Sort: Top Scored</option>
              <option value="alpha">Sort: A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Track filter chips */}
      <div id="tracks" className="flex flex-wrap items-center gap-2 pt-1 scroll-mt-24">
        <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider flex items-center gap-1.5 mr-1">
          <SlidersHorizontal size={12} />
          <span>Tracks:</span>
        </span>

        <button
          type="button"
          onClick={() => handleTrackSelect(null)}
          className={`rounded-md px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
            !currentTrack
              ? "bg-accent text-bg-0 border border-accent shadow-sm"
              : "bg-surface-2 text-text-tertiary border border-border hover:border-text-tertiary hover:text-text-primary"
          }`}
        >
          All
        </button>

        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTrackSelect(t.id)}
            className={`rounded-md px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
              currentTrack === t.id
                ? "bg-accent text-bg-0 border border-accent shadow-sm"
                : "bg-surface-2 text-text-tertiary border border-border hover:border-text-tertiary hover:text-text-primary"
            }`}
          >
            {t.name}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-auto font-mono text-[11px] text-danger hover:underline inline-flex items-center gap-1"
          >
            <X size={12} />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
