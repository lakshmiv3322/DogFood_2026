import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma, getSessionUser } from "@/lib/db";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { Badge } from "@/components/ui/Badge";
import { ScoreVisualization } from "@/components/projects/ScoreVisualization";
import { ProjectSidePanel } from "@/components/projects/ProjectSidePanel";
import { FeedbackCard } from "@/components/projects/FeedbackCard";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Users,
  Shield,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    select: { title: true, summary: true, track: { select: { name: true } } },
  });

  if (!project) {
    return {
      title: "Project Not Found — DOGFOOD 2026",
    };
  }

  return {
    title: `${project.title} — DOGFOOD 2026`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${project.track.name} — DOGFOOD 2026`,
      description: project.summary,
    },
  };
}

function formatPublicMember(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.includes("@")) {
    const local = trimmed.split("@")[0];
    const initials = local
      .split(/[._-]/)
      .filter(Boolean)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("");
    return `${initials || local.slice(0, 2).toUpperCase()} (Participant)`;
  }
  return trimmed;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const [project, user] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id },
      include: {
        team: true,
        track: true,
        scores: {
          include: { judge: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    getSessionUser(),
  ]);

  if (!project) notFound();

  // Find prev/next projects within the same track
  const [prevProject, nextProject] = await Promise.all([
    prisma.project.findFirst({
      where: { trackId: project.trackId, id: { lt: project.id } },
      orderBy: { id: "desc" },
      select: { id: true, title: true },
    }),
    prisma.project.findFirst({
      where: { trackId: project.trackId, id: { gt: project.id } },
      orderBy: { id: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  const reviewCount = project.scores.length;
  const funcAvg =
    reviewCount > 0
      ? project.scores.reduce((sum, s) => sum + s.functionality, 0) / reviewCount
      : null;
  const qualAvg =
    reviewCount > 0
      ? project.scores.reduce((sum, s) => sum + s.quality, 0) / reviewCount
      : null;
  const overallAvg =
    reviewCount > 0 && funcAvg !== null && qualAvg !== null
      ? (funcAvg + qualAvg) / 2
      : null;

  // Format team members safely (no raw email leak to public)
  const safeMembers = (project.team.members ?? []).map(formatPublicMember);

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header user={user} />

      <main className="flex-1 py-10">
        <Container size="xl">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary hover:text-accent transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Gallery</span>
            </Link>

            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm">
                {project.track.name}
              </Badge>
            </div>
          </div>

          {/* Main Layout: Left Content + Right Sticky Side Panel */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Content Column */}
            <div className="flex-1 min-w-0 space-y-10">
              {/* 1. Hero Band */}
              <div className="space-y-4">
                <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-text-primary leading-tight">
                  {project.title}
                </h1>

                <p className="font-mono text-sm text-text-secondary leading-relaxed max-w-2xl">
                  {project.summary}
                </p>

                {/* Team & Members Meta */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-border">
                    <Users size={14} className="text-accent" />
                    <span className="text-text-tertiary">Team:</span>
                    <strong className="text-text-primary">{project.team.name}</strong>
                  </div>

                  {safeMembers.length > 0 && (
                    <div className="flex items-center gap-1.5 text-text-tertiary">
                      <span>Members:</span>
                      <span className="text-text-secondary">
                        {safeMembers.join(", ")}
                      </span>
                    </div>
                  )}

                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent hover:underline ml-auto"
                    >
                      <span>Repository</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>

              {/* 2. Score Section: Animated Radial & Bar Visualisation */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-accent" />
                  <h2 className="font-display text-base font-bold uppercase tracking-wider text-text-primary">
                    Evaluation Consensus
                  </h2>
                </div>
                <ScoreVisualization
                  funcAvg={funcAvg}
                  qualAvg={qualAvg}
                  overallAvg={overallAvg}
                  reviewCount={reviewCount}
                />
              </div>

              {/* 3. Judge Feedback List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold uppercase tracking-wider text-text-primary">
                    Judge Evaluations ({reviewCount})
                  </h2>
                  <span className="font-mono text-xs text-text-tertiary">
                    {reviewCount > 0 ? "Independent reviews" : "No evaluations recorded"}
                  </span>
                </div>

                {reviewCount === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-surface/40 p-6 text-center">
                    <p className="font-mono text-xs text-text-tertiary">
                      Comments will appear here once designated judges submit their evaluation forms.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {project.scores.map((score, index) => (
                      <FeedbackCard
                        key={score.id}
                        judgeLabel={`Judge ${index + 1}`}
                        funcScore={score.functionality}
                        qualScore={score.quality}
                        comment={score.comment || "Evaluation completed without additional qualitative remarks."}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Track Prev / Next Navigation */}
              <div className="border-t border-border pt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                  {prevProject ? (
                    <Link
                      href={`/projects/${prevProject.id}`}
                      className="w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 hover:border-accent hover:text-accent transition-colors"
                    >
                      <ArrowLeft size={14} />
                      <div className="text-left">
                        <div className="text-[10px] uppercase text-text-tertiary">Previous in Track</div>
                        <div className="font-bold text-text-primary truncate max-w-[180px]">
                          {prevProject.title}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextProject ? (
                    <Link
                      href={`/projects/${nextProject.id}`}
                      className="w-full sm:w-auto inline-flex items-center justify-end gap-2 rounded-lg border border-border bg-surface px-4 py-3 hover:border-accent hover:text-accent transition-colors text-right ml-auto"
                    >
                      <div>
                        <div className="text-[10px] uppercase text-text-tertiary">Next in Track</div>
                        <div className="font-bold text-text-primary truncate max-w-[180px]">
                          {nextProject.title}
                        </div>
                      </div>
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>

            {/* 4. Desktop Sticky Side Panel / Mobile Collapsible Card */}
            <ProjectSidePanel
              project={{
                id: project.id,
                title: project.title,
                summary: project.summary,
                repoUrl: project.repoUrl,
                submittedAt: project.submittedAt.toISOString(),
                teamName: project.team.name,
                trackName: project.track.name,
                reviewCount,
                avgScore: overallAvg ? overallAvg.toFixed(1) : null,
              }}
            />
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
