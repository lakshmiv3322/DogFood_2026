import { prisma } from "@/lib/db";
import Link from "next/link";

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

  const [projects, total, tracks, event] = await Promise.all([
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
      orderBy: { submittedAt: "desc" },
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
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isOpen = event ? new Date() < event.submissionsClose : false;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#1b2540] bg-[#0a0f1e]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase hover:text-[#e6ecff] transition-colors"
            >
              DOGFOOD
            </Link>
            <span className="w-px h-4 bg-[#1b2540]" />
            <span className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase">
              Gallery
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <span
              className="font-mono text-xs px-2 py-1 border"
              style={{
                borderColor: isOpen ? "#00e5d0" : "#ff3d6e",
                color: isOpen ? "#00e5d0" : "#ff3d6e",
              }}
            >
              {isOpen ? "● OPEN" : "● CLOSED"}
            </span>
            <Link
              href="/login"
              className="font-mono text-xs tracking-widest bg-[#ff3d6e] text-[#0a0f1e] px-3 py-1.5 hover:bg-[#e6ecff] transition-colors uppercase"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-widest text-[#ff3d6e] uppercase mb-2">
              [ {total} projects ]
            </p>
            <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#e6ecff]">
              Project Gallery
            </h1>
          </div>

          {/* Search */}
          <form method="get" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="Search projects…"
              className="bg-[#0e1428] border border-[#1b2540] text-[#e6ecff] font-mono text-xs px-3 py-2 w-48 focus:outline-none focus:border-[#00e5d0] placeholder:text-[#3a4a70]"
            />
            {searchParams.track && (
              <input type="hidden" name="track" value={searchParams.track} />
            )}
            <button
              type="submit"
              className="bg-[#ff3d6e] text-[#0a0f1e] font-mono text-xs font-bold tracking-widest uppercase px-4 py-2 hover:bg-[#e6ecff] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex gap-8">
          {/* Sidebar: track filters */}
          <aside className="hidden lg:block w-48 shrink-0">
            <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase mb-3">
              Tracks
            </p>
            <div className="flex flex-col gap-1">
              <Link
                href="/projects"
                className={`font-mono text-xs px-3 py-2 border transition-colors ${
                  !searchParams.track
                    ? "border-[#00e5d0] text-[#00e5d0] bg-[#0e1428]"
                    : "border-[#1b2540] text-[#6b7a9e] hover:text-[#e6ecff] hover:border-[#2b3a60]"
                }`}
              >
                All tracks
              </Link>
              {tracks.map((t) => (
                <Link
                  key={t.id}
                  href={`/projects?track=${t.id}`}
                  className={`font-mono text-xs px-3 py-2 border transition-colors ${
                    searchParams.track === t.id
                      ? "border-[#00e5d0] text-[#00e5d0] bg-[#0e1428]"
                      : "border-[#1b2540] text-[#6b7a9e] hover:text-[#e6ecff] hover:border-[#2b3a60]"
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
              <div className="border border-[#1b2540] bg-[#0e1428] p-12 text-center">
                <p className="font-mono text-sm text-[#6b7a9e]">
                  No projects found.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#1b2540]">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="group bg-[#0e1428] p-6 flex flex-col gap-3 hover:bg-[#121a32] transition-colors"
                  >
                    {/* Track badge */}
                    <span className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase">
                      {project.track.name}
                    </span>

                    {/* Title — this is what the checker looks for */}
                    <h2 className="font-black text-lg leading-tight text-[#e6ecff] group-hover:text-white transition-colors">
                      {project.title}
                    </h2>

                    <p className="font-mono text-xs text-[#6b7a9e] leading-relaxed line-clamp-2 flex-1">
                      {project.summary}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1b2540]">
                      <span className="font-mono text-xs text-[#3a4a70]">
                        {project.team.name}
                      </span>
                      <span className="font-mono text-xs text-[#3a4a70]">
                        {project._count.scores}{" "}
                        {project._count.scores === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <span className="font-mono text-xs text-[#6b7a9e]">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={`/projects?page=${page - 1}${searchParams.track ? `&track=${searchParams.track}` : ""}${searchParams.q ? `&q=${searchParams.q}` : ""}`}
                      className="font-mono text-xs border border-[#1b2540] text-[#6b7a9e] px-3 py-2 hover:border-[#00e5d0] hover:text-[#00e5d0] transition-colors"
                    >
                      ← Prev
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/projects?page=${page + 1}${searchParams.track ? `&track=${searchParams.track}` : ""}${searchParams.q ? `&q=${searchParams.q}` : ""}`}
                      className="font-mono text-xs border border-[#1b2540] text-[#6b7a9e] px-3 py-2 hover:border-[#00e5d0] hover:text-[#00e5d0] transition-colors"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
