import { prisma, getSessionUser } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, user] = await Promise.all([
    prisma.project.findUnique({
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
    }),
    getSessionUser(),
  ]);

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
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header user={user} />

      <main className="flex-1 py-10">
        <Container size="xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft size={14} aria-hidden />
            <span>Back to Gallery</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: project details */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <Badge variant="accent" size="sm" className="mb-2">
                  {project.track.name}
                </Badge>
                <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-text-primary mt-1 mb-4 leading-tight">
                  {project.title}
                </h1>
                <p className="font-mono text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* Meta cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Team", value: project.team.name },
                  { label: "Track", value: project.track.name },
                  {
                    label: "Submitted",
                    value: new Date(project.submittedAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    ),
                  },
                  {
                    label: "Reviews",
                    value: `${project.scores.length} completed`,
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-border bg-surface p-4">
                    <p className="font-mono text-[11px] text-text-tertiary tracking-wider uppercase mb-1">
                      {item.label}
                    </p>
                    <p className="font-mono text-xs font-semibold text-text-primary">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Team Members */}
              {project.team.members && project.team.members.length > 0 && (
                <div className="rounded-lg border border-border bg-surface p-4">
                  <p className="font-mono text-[11px] text-text-tertiary tracking-wider uppercase mb-1">
                    Team Members
                  </p>
                  <p className="font-mono text-xs text-text-secondary">
                    {project.team.members.join(", ")}
                  </p>
                </div>
              )}

              {/* Repo link */}
              {project.repoUrl && (
                <div>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase text-text-primary hover:border-accent hover:text-accent transition-colors"
                  >
                    <span>View Repository</span>
                    <ExternalLink size={14} aria-hidden />
                  </a>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="rounded-lg border border-border bg-bg-2 p-3 text-[11px] font-mono text-text-tertiary leading-relaxed">
                <span className="text-text-secondary uppercase font-bold mr-1">Privacy Notice:</span>
                Participant emails (team members) and repository URLs are visible to other participants and judges for the duration of the event.
              </div>

              {/* Comments */}
              {project.comments.length > 0 && (
                <div className="mt-4">
                  <p className="font-mono text-xs font-semibold tracking-wider text-text-tertiary uppercase mb-3">
                    Evaluation Comments ({project.comments.length})
                  </p>
                  <div className="flex flex-col gap-3">
                    {project.comments.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-lg border border-border bg-surface p-4"
                      >
                        <p className="font-mono text-xs text-accent uppercase mb-1">
                          {c.user.name} · {c.user.role.toLowerCase()}
                        </p>
                        <p className="font-mono text-xs text-text-secondary leading-relaxed">
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
                <div className="rounded-xl border border-accent/40 bg-surface p-6 shadow-sm">
                  <p className="font-mono text-xs tracking-wider text-text-tertiary uppercase mb-2">
                    Average Score
                  </p>
                  <p className="font-display font-black text-5xl text-accent">{avgScore}</p>
                  <p className="font-mono text-xs text-text-tertiary mt-1">out of 10</p>
                </div>
              )}

              {project.scores.length > 0 && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <p className="font-mono text-xs font-semibold tracking-wider text-text-tertiary uppercase mb-4">
                    Score Breakdown
                  </p>
                  <div className="flex flex-col gap-3">
                    {project.scores.map((s) => (
                      <div
                        key={s.id}
                        className="flex flex-col gap-1 pb-3 border-b border-border/50 last:border-0 last:pb-0"
                      >
                        <p className="font-mono text-xs font-semibold text-text-primary">
                          {s.judge.name}
                        </p>
                        <div className="flex gap-4 text-xs font-mono">
                          <span className="text-text-tertiary">
                            Func: <span className="text-accent font-bold">{s.functionality}</span>
                          </span>
                          <span className="text-text-tertiary">
                            Quality: <span className="text-accent font-bold">{s.quality}</span>
                          </span>
                        </div>
                      </div>
                    ))}
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
