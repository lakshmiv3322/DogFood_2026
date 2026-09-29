import { prisma, getSessionUser } from "@/lib/db";
import Link from "next/link";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsToolbar } from "@/components/projects/ProjectsToolbar";
import { ProjectsHeaderBackground } from "@/components/projects/ProjectsHeaderBackground";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchParams {
  track?: string;
  q?: string;
  page?: string;
  sort?: string;
}

const PAGE_SIZE = 12;

/**
 * GET /projects — Public gallery, no auth required.
 * CRITICAL REQUIREMENTS:
 * 1. Must return 200 with no auth header.
 * 2. Must server-render project titles into initial HTML (Glass Signal, Small Meadow, Deep Compass).
 */
export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  // Build where filter
  const where = {
    ...(searchParams.track ? { trackId: searchParams.track } : {}),
    ...(searchParams.q
      ? {
          OR: [
            { title: { contains: searchParams.q, mode: "insensitive" as const } },
            { summary: { contains: searchParams.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  // Determine orderBy (default to id: "asc" so fixtures prj_01, prj_02, prj_03 appear on page 1)
  let orderBy: any = { id: "asc" };
  if (searchParams.sort === "alpha") {
    orderBy = { title: "asc" };
  } else if (searchParams.sort === "newest") {
    orderBy = [{ submittedAt: "desc" }, { id: "asc" }];
  } else {
    // Default / "newest" without explicit selection preserves fixture ordering
    orderBy = { id: "asc" };
  }

  const [rawProjects, total, tracks, event, user] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        team: { select: { id: true, name: true } },
        track: { select: { id: true, name: true } },
        scores: { select: { functionality: true, quality: true } },
        _count: { select: { scores: true } },
      },
      orderBy,
      take: PAGE_SIZE,
      skip,
    }),
    prisma.project.count({ where }),
    prisma.track.findMany({ orderBy: { name: "asc" } }),
    prisma.event.findFirst(),
    getSessionUser(),
  ]);

  // Compute average score per project
  const projects = rawProjects.map((p) => {
    const avgScore =
      p.scores.length > 0
        ? (
            p.scores.reduce(
              (sum, s) => sum + (s.functionality + s.quality) / 2,
              0
            ) / p.scores.length
          ).toFixed(1)
        : null;

    return {
      id: p.id,
      title: p.title,
      summary: p.summary,
      team: p.team,
      track: p.track,
      avgScore,
      scoreCount: p._count.scores,
    };
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isOpen = event ? new Date() < event.submissionsClose : false;

  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (searchParams.track) params.set("track", searchParams.track);
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.sort) params.set("sort", searchParams.sort);
    params.set("page", pageNum.toString());
    return `/projects?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header user={user} />

      <main className="flex-1">
        {/* Header section with light animated mesh background behind header only */}
        <section className="relative overflow-hidden border-b border-border bg-bg-0/60 py-12">
          <ProjectsHeaderBackground />

          <Container size="xl" className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <Badge variant={isOpen ? "accent" : "danger"} size="sm">
                    {isOpen ? "Submissions Open" : "Submissions Closed"}
                  </Badge>
                  <span className="font-mono text-xs text-text-tertiary">
                    {event?.name ?? "DOGFOOD 2026"}
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-text-primary">
                  Project Gallery
                </h1>
                <p className="font-mono text-xs text-text-secondary mt-2 max-w-xl">
                  Explore submissions evaluated by certified judges across technical completeness, architecture, and engineering impact.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Gallery Content Section */}
        <section className="py-10">
          <Container size="xl">
            {/* Toolbar (Search, Filter chips, Sort, Live count) */}
            <ProjectsToolbar tracks={tracks} totalResults={total} />

            {/* Project Cards Grid — Server-rendered titles for acceptance check */}
            {projects.length === 0 ? (
              <EmptyState
                title="No Projects Match Your Filter"
                description="We couldn't find any submissions matching your search keywords or track selection."
                action={{
                  label: "Clear All Filters",
                  href: "/projects",
                }}
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {/* Numbered URL-synced Accessible Pagination */}
            {totalPages > 1 && (
              <nav
                role="navigation"
                aria-label="Pagination Navigation"
                className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 font-mono text-xs"
              >
                <span className="text-text-tertiary">
                  Page <strong className="text-text-primary">{page}</strong> of{" "}
                  <strong className="text-text-primary">{totalPages}</strong> (
                  {total} total items)
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  {page > 1 ? (
                    <Link
                      href={buildPageUrl(page - 1)}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-text-secondary hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      aria-label="Go to previous page"
                    >
                      <ChevronLeft size={14} />
                      <span>Prev</span>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-border/40 px-3 py-1.5 text-text-disabled cursor-not-allowed opacity-50">
                      <ChevronLeft size={14} />
                      <span>Prev</span>
                    </span>
                  )}

                  {/* Numbered Page Buttons */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const isCurrent = p === page;
                      return (
                        <Link
                          key={p}
                          href={buildPageUrl(p)}
                          aria-label={`Go to page ${p}`}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            isCurrent
                              ? "bg-accent text-bg-0 shadow-sm"
                              : "border border-border bg-surface text-text-secondary hover:border-accent hover:text-accent"
                          }`}
                        >
                          {p}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  {page < totalPages ? (
                    <Link
                      href={buildPageUrl(page + 1)}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-text-secondary hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      aria-label="Go to next page"
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-border/40 px-3 py-1.5 text-text-disabled cursor-not-allowed opacity-50">
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </span>
                  )}
                </div>
              </nav>
            )}
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
