import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSessionUser, prisma } from "@/lib/db";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { Badge } from "@/components/ui/Badge";
import ScoreForm from "./ScoreForm";
import { ArrowLeft, ExternalLink, Users, Layers, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ScoreProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "JUDGE") redirect("/login");

  // Query project with details
  const [project, assignedTracks, allJudgeScores] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id },
      include: {
        team: true,
        track: true,
        scores: {
          where: { judgeId: user.id },
        },
      },
    }),
    prisma.judgeTrack.findMany({
      where: { judgeId: user.id },
      select: { trackId: true },
    }),
    prisma.score.findMany({
      where: { judgeId: user.id },
      select: { projectId: true, functionality: true, quality: true },
    }),
  ]);

  if (!project) notFound();

  const trackIds = assignedTracks.map((jt) => jt.trackId);

  // Find next pending project in judge's tracks
  const scoredProjectIds = allJudgeScores.map((s) => s.projectId);
  const nextPendingProject = await prisma.project.findFirst({
    where: {
      trackId: { in: trackIds },
      id: { notIn: [...scoredProjectIds, project.id] },
    },
    orderBy: { id: "asc" },
    select: { id: true },
  });

  const existingScore = project.scores[0] || null;
  const previousScores = allJudgeScores.map(
    (s) => (s.functionality + s.quality) / 2
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header user={user} />

      <main className="flex-1 py-10">
        <Container size="xl">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/dashboard/judge"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary hover:text-accent transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Queue</span>
            </Link>

            <Badge variant="accent" size="sm">
              {project.track.name}
            </Badge>
          </div>

          {/* Split View: Left Project Summary, Right Rubric Form */}
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left Column (5 cols): Project Summary + Repo link */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                      Candidate Submission
                    </span>
                  </div>

                  <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-text-primary leading-tight mb-3">
                    {project.title}
                  </h1>

                  <div className="space-y-2 text-xs font-mono mb-4">
                    <div className="flex items-center gap-2 text-text-tertiary">
                      <Users size={14} className="text-accent" />
                      <span>Team:</span>
                      <strong className="text-text-secondary">{project.team.name}</strong>
                    </div>
                    <div className="flex items-center gap-2 text-text-tertiary">
                      <Layers size={14} className="text-accent" />
                      <span>Track:</span>
                      <strong className="text-text-secondary">{project.track.name}</strong>
                    </div>
                  </div>

                  <div className="rounded-lg bg-bg-2 p-4 border border-border/60">
                    <p className="font-mono text-xs text-text-secondary leading-relaxed">
                      {project.summary}
                    </p>
                  </div>
                </div>

                {project.repoUrl && (
                  <div className="pt-2">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-surface-2 border border-border px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-text-primary hover:border-accent hover:text-accent transition-colors"
                    >
                      <span>Inspect Repository</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (7 cols): Rubric Evaluation Workspace */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-accent" />
                    <h2 className="font-display text-base font-bold uppercase tracking-wider text-text-primary">
                      Rubric Scoring Surface
                    </h2>
                  </div>
                  <span className="font-mono text-[11px] text-text-tertiary uppercase">
                    Blind evaluation
                  </span>
                </div>

                <ScoreForm
                  projectId={project.id}
                  initialFunctionality={existingScore?.functionality ?? 5}
                  initialQuality={existingScore?.quality ?? 5}
                  initialComment={existingScore?.comment ?? ""}
                  nextProjectId={nextPendingProject?.id}
                  previousScores={previousScores}
                />
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
