import { prisma, getSessionUser } from "@/lib/db";
import Link from "next/link";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { Badge } from "@/components/ui/Badge";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchParams {
  track?: string;
  q?: string;
  page?: string;
}

const PAGE_SIZE = 12;

/**
 * GET /projects — Public gallery, no auth required.
 * Check #1: must return 200 with no auth header
 * Check #2: must contain a known fixture project title
 */
export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const [projects, total, tracks, event, user] = await Promise.all([
    prisma.project.findMany({
      where: {
        ...(searchParams.track ? { trackId: searchParams.track } : {}),
        ...(searchParams.q
          ? {
              OR: [
                { title: { contains: searchParams.q, mode: "insensitive" } },
                { summary: { contains: searchParams.q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        team: { select: { name: true } },
        track: { select: { id: true, name: true } },
        _count: { select: { scores: true } },
      },
      orderBy: { id: "asc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.project.count({
      where: {
        ...(searchParams.track ? { trackId: searchParams.track } : {}),
        ...(searchParams.q
          ? {
              OR: [
                { title: { contains: searchParams.q, mode: "insensitive" } },
                { summary: { contains: searchParams.q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    }),
    prisma.track.findMany({ orderBy: { name: "asc" } }),
    prisma.event.findFirst(),
    getSessionUser(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isOpen = event ? new Date() < event.submissionsClose : false;

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      {/* Role-aware shell header */}
      <Header user={user} />

      <main className="flex-1 py-10">
        <Container size="xl">
          {/* Page header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={isOpen ? "accent" : "danger"} size="sm">
                  {isOpen ? "Submissions Open" : "Submissions Closed"}
                </Badge>
                <span className="font-mono text-xs text-text-tertiary">
                  {total} projects submitted
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-text-primary">
                Project Gallery
              </h1>
            </div>

            {/* Search */}
            <form method="get" className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchParams.q ?? ""}
                  placeholder="Search projects…"
                  className="bg-surface-2 border border-border text-text-primary font-mono text-xs pl-8 pr-3 py-2 w-52 rounded-lg focus:outline-none focus:border-accent placeholder:text-text-disabled"
                />
                <Search
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary"
                  aria-hidden
                />
              </div>
              {searchParams.track && (
                <input type="hidden" name="track" value={searchParams.track} />
              )}
              <button
                type="submit"
                className="bg-accent text-bg-0 font-mono text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-lg hover:bg-accent-2 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
              >
                Search
              </button>
            </form>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar: track filters */}
            <aside className="lg:w-56 shrink-0">
              <p className="font-mono text-xs font-semibold tracking-wider text-text-tertiary uppercase mb-3">
                Tracks &amp; Categories
              </p>
              <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
                <Link
                  href="/projects"
                  className={`font-mono text-xs px-3 py-2 rounded-md transition-colors shrink-0 ${
                    !searchParams.track
                      ? "bg-accent/15 text-accent font-bold border border-accent/30"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-3 border border-transparent"
                  }`}
                >
                  All tracks ({total})
                </Link>
                {tracks.map((t) => (
                  <Link
                    key={t.id}
                    href={`/projects?track=${t.id}`}
                    className={`font-mono text-xs px-3 py-2 rounded-md transition-colors shrink-0 ${
                      searchParams.track === t.id
                        ? "bg-accent/15 text-accent font-bold border border-accent/30"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-3 border border-transparent"
                    }`}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </aside>

            {/* Project grid */}
            <div className="flex-1 min-w-0">
              {projects.length === 0 ? (
                <div className="border border-dashed border-border bg-surface/50 rounded-xl p-12 text-center">
                  <p className="font-mono text-sm text-text-tertiary">
                    No projects found for the selected criteria.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="group rounded-xl border border-border bg-surface p-5 flex flex-col gap-3 hover:bg-bg-3 hover:border-accent/40 hover:shadow-md transition-all duration-200"
                    >
                      {/* Track badge */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold tracking-wider text-accent uppercase">
                          {project.track.name}
                        </span>
                        <span className="font-mono text-[11px] text-text-tertiary">
                          {project._count.scores} {project._count.scores === 1 ? "review" : "reviews"}
                        </span>
                      </div>

                      {/* Title — directly server-rendered HTML for acceptance check */}
                      <h2 className="font-display font-bold text-lg leading-tight text-text-primary group-hover:text-accent transition-colors">
                        {project.title}
                      </h2>

                      <p className="font-mono text-xs text-text-tertiary leading-relaxed line-clamp-3 flex-1">
                        {project.summary}
                      </p>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/50 text-xs font-mono text-text-disabled">
                        <span className="truncate">{project.team.name}</span>
                        <span className="text-accent group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-mono text-xs text-text-tertiary">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <Link
                        href={`/projects?page=${page - 1}${searchParams.track ? `&track=${searchParams.track}` : ""}${searchParams.q ? `&q=${searchParams.q}` : ""}`}
                        className="font-mono text-xs border border-border text-text-secondary px-3 py-1.5 rounded hover:border-accent hover:text-accent transition-colors"
                      >
                        ← Prev
                      </Link>
                    )}
                    {page < totalPages && (
                      <Link
                        href={`/projects?page=${page + 1}${searchParams.track ? `&track=${searchParams.track}` : ""}${searchParams.q ? `&q=${searchParams.q}` : ""}`}
                        className="font-mono text-xs border border-border text-text-secondary px-3 py-1.5 rounded hover:border-accent hover:text-accent transition-colors"
                      >
                        Next →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
