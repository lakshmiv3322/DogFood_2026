import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      team: true,
      track: true,
      event: true,
      scores: {
        include: { judge: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
      comments: {
        include: { user: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) notFound();

  const avgScore =
    project.scores.length > 0
      ? (
          project.scores.reduce(
            (sum, s) => sum + (s.functionality + s.quality) / 2,
            0
          ) / project.scores.length
        ).toFixed(2)
      : null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[#1b2540] bg-[#0a0f1e]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase hover:text-[#e6ecff] transition-colors"
          >
            DOGFOOD
          </Link>
          <span className="w-px h-4 bg-[#1b2540]" />
          <Link
            href="/projects"
            className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase hover:text-[#e6ecff] transition-colors"
          >
            Gallery
          </Link>
          <span className="w-px h-4 bg-[#1b2540]" />
          <span className="font-mono text-xs tracking-widest text-[#aebad6] uppercase truncate">
            {project.title}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: project details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <span className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase">
                {project.track.name}
              </span>
              <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#e6ecff] mt-2 mb-4 leading-none">
                {project.title}
              </h1>
              <p className="font-mono text-sm text-[#aebad6] leading-relaxed">
                {project.summary}
              </p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-px bg-[#1b2540]">
              {[
                { label: "Team", value: project.team.name },
                { label: "Track", value: project.track.name },
                {
                  label: "Submitted",
                  value: new Date(project.submittedAt).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" }
                  ),
                },
                {
                  label: "Reviews",
                  value: project.scores.length.toString(),
                },
              ].map((item) => (
                <div key={item.label} className="bg-[#0e1428] px-5 py-4">
                  <p className="font-mono text-xs text-[#6b7a9e] tracking-widest uppercase mb-1">
                    {item.label}
                  </p>
                  <p className="font-mono text-sm text-[#e6ecff]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Team Members */}
            {project.team.members && project.team.members.length > 0 && (
              <div>
                <p className="font-mono text-xs text-[#6b7a9e] tracking-widest uppercase mb-1">
                  Team Members
                </p>
                <p className="font-mono text-xs text-[#aebad6]">
                  {project.team.members.join(", ")}
                </p>
              </div>
            )}

            {/* Repo link */}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#1b2540] text-[#6b7a9e] font-mono text-xs tracking-widest uppercase px-4 py-3 hover:border-[#00e5d0] hover:text-[#00e5d0] transition-colors w-fit"
            >
              View Repository →
            </a>

            {/* Privacy Notice */}
            <div className="border border-[#1b2540] bg-[#0a0f1e] p-3 text-[11px] font-mono text-[#6b7a9e] leading-relaxed">
              <span className="text-[#aebad6] uppercase font-bold mr-1">Privacy Notice:</span>
              Participant emails (team members) and repository URLs are visible to other participants and judges for the duration of the event.
            </div>

            {/* Comments */}
            {project.comments.length > 0 && (
              <div>
                <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase mb-3">
                  [ Comments ]
                </p>
                <div className="flex flex-col gap-2">
                  {project.comments.map((c) => (
                    <div
                      key={c.id}
                      className="border border-[#1b2540] bg-[#0e1428] px-4 py-3"
                    >
                      <p className="font-mono text-xs text-[#00e5d0] uppercase mb-1">
                        {c.user.name} · {c.user.role.toLowerCase()}
                      </p>
                      <p className="font-mono text-xs text-[#aebad6] leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: score panel */}
          <div className="flex flex-col gap-4">
            {avgScore && (
              <div className="border border-[#00e5d0] bg-[#0e1428] p-6">
                <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase mb-2">
                  Average Score
                </p>
                <p className="font-black text-5xl text-[#00e5d0]">{avgScore}</p>
                <p className="font-mono text-xs text-[#3a4a70] mt-1">out of 5</p>
              </div>
            )}

            {project.scores.length > 0 && (
              <div className="border border-[#1b2540] bg-[#0e1428] p-5">
                <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase mb-4">
                  Score Breakdown
                </p>
                <div className="flex flex-col gap-3">
                  {project.scores.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-col gap-1 pb-3 border-b border-[#1b2540] last:border-0 last:pb-0"
                    >
                      <p className="font-mono text-xs text-[#e6ecff]">
                        {s.judge.name}
                      </p>
                      <div className="flex gap-4">
                        <span className="font-mono text-xs text-[#6b7a9e]">
                          Func:{" "}
                          <span className="text-[#00e5d0]">
                            {s.functionality}
                          </span>
                        </span>
                        <span className="font-mono text-xs text-[#6b7a9e]">
                          Quality:{" "}
                          <span className="text-[#00e5d0]">{s.quality}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/projects"
              className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase hover:text-[#e6ecff] transition-colors"
            >
              ← Back to Gallery
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
