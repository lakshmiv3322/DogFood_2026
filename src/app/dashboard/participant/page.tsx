import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser, prisma } from '@/lib/db';
import { Header } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';
import { Container } from '@/components/shell/Container';
import { Trophy, ExternalLink, Star, LayoutGrid, LogIn } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ParticipantDashboard() {
  const user = await getSessionUser();
  if (!user || user.role !== 'PARTICIPANT') redirect('/login');

  // Find their team
  const team = await prisma.team.findFirst({
    where: { members: { has: user.email } },
  });

  // Find their project
  const project = team
    ? await prisma.project.findFirst({
        where: { teamId: team.id },
        include: {
          track: { select: { name: true } },
          scores: {
            include: { judge: { select: { name: true } } },
          },
        },
      })
    : null;

  // All scored projects for leaderboard
  const allProjects = await prisma.project.findMany({
    where: { scores: { some: {} } },
    include: {
      scores: true,
      team: { select: { name: true } },
    },
    orderBy: { id: 'asc' },
  });

  // Compute leaderboard
  const leaderboard = allProjects
    .map((p) => ({
      id: p.id,
      teamName: p.team.name,
      avgScore:
        p.scores.length > 0
          ? p.scores.reduce((s, sc) => s + (sc.functionality + sc.quality) / 2, 0) /
            p.scores.length
          : 0,
      scoreCount: p.scores.length,
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  const myRank = project ? leaderboard.findIndex((p) => p.id === project.id) + 1 : null;

  const isSubmitted = Boolean(project);
  const avgScore =
    project && project.scores.length > 0
      ? project.scores.reduce((s, sc) => s + (sc.functionality + sc.quality) / 2, 0) /
        project.scores.length
      : null;

  const top5 = leaderboard.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header user={user} />

      <main className="flex-1 py-10">
        <Container size="xl">
          {/* ── A) Page Header ── */}
          <div className="mb-8">
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-2">
              Participant Dashboard
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-text-primary">
                Welcome back, {team?.name ?? user.name}
              </h1>
              <span className="font-mono text-xs bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded-full">
                Sample Hack 2026
              </span>
              {isSubmitted ? (
                <span className="font-mono text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                  ✓ Submitted
                </span>
              ) : (
                <span className="font-mono text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                  ⚠ Not Submitted
                </span>
              )}
            </div>
            {team && (
              <p className="text-text-tertiary text-sm mt-2 font-mono">
                Team: <span className="text-text-secondary font-semibold">{team.name}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Left column: Project Card + Quick Actions ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* ── B) Project Card ── */}
              {project ? (
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-xl font-bold text-text-primary">{project.title}</h2>
                    <span className="shrink-0 bg-accent/10 text-accent text-xs font-mono px-2 py-0.5 rounded-full border border-accent/20">
                      {project.track.name}
                    </span>
                  </div>

                  <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="mt-3">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent text-xs font-mono hover:underline"
                    >
                      <ExternalLink size={12} />
                      {project.repoUrl}
                    </a>
                  </div>

                  {/* Scores section */}
                  <div className="mt-5 pt-5 border-t border-border/60">
                    {project.scores.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-mono text-xs text-text-tertiary uppercase tracking-wider">
                            <Star size={12} className="inline mr-1 text-accent" />
                            {project.scores.length} judge{project.scores.length !== 1 ? 's' : ''}{' '}
                            reviewed your project
                          </p>
                          {avgScore !== null && (
                            <div className="text-right">
                              <span className="text-3xl font-bold text-accent font-mono">
                                {avgScore.toFixed(1)}
                              </span>
                              <span className="text-text-tertiary text-xs font-mono ml-1">/10</span>
                              <p className="text-text-tertiary text-[10px] font-mono mt-0.5">
                                avg score
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          {project.scores.map((score, i) => {
                            const judgeAvg = (score.functionality + score.quality) / 2;
                            return (
                              <div
                                key={score.id}
                                className="rounded-xl bg-bg-1 border border-border/60 p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-mono text-xs text-text-tertiary">
                                    Anonymous Judge {i + 1}
                                  </span>
                                  <span className="font-mono text-sm font-bold text-accent">
                                    {judgeAvg.toFixed(1)}/10
                                  </span>
                                </div>
                                <div className="flex gap-4 mb-2">
                                  <div className="text-xs font-mono text-text-tertiary">
                                    Functionality:{' '}
                                    <span className="text-text-secondary">
                                      {score.functionality}
                                    </span>
                                  </div>
                                  <div className="text-xs font-mono text-text-tertiary">
                                    Quality:{' '}
                                    <span className="text-text-secondary">{score.quality}</span>
                                  </div>
                                </div>
                                {score.comment && (
                                  <p className="text-text-secondary text-xs leading-relaxed border-t border-border/40 pt-2 mt-2 italic">
                                    "{score.comment}"
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <p className="font-mono text-xs text-text-tertiary text-center py-4">
                        No reviews yet — judges will evaluate your project soon.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                  <p className="font-mono text-xs text-accent uppercase tracking-widest mb-2">
                    No submission found
                  </p>
                  <p className="text-text-tertiary text-sm">
                    {team
                      ? "Your team hasn't submitted a project yet."
                      : "You're not part of any team yet."}
                  </p>
                </div>
              )}

              {/* ── D) Quick Actions ── */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <p className="font-mono text-xs text-text-tertiary uppercase tracking-wider mb-4">
                  Quick Actions
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-1 px-4 py-2 text-xs font-mono text-text-secondary hover:border-accent hover:text-accent transition-colors"
                  >
                    <LayoutGrid size={14} />
                    Browse Projects
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-1 px-4 py-2 text-xs font-mono text-text-secondary hover:border-accent hover:text-accent transition-colors"
                  >
                    <LogIn size={14} />
                    Sign In as Another Role
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Right column: Leaderboard ── */}
            <div className="lg:col-span-1">
              {/* ── C) Leaderboard Card ── */}
              <div className="bg-surface border border-border rounded-2xl p-6 sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={16} className="text-accent shrink-0" />
                  <p className="font-mono text-xs text-accent uppercase tracking-wider font-semibold">
                    Leaderboard
                  </p>
                </div>

                {myRank && (
                  <div className="mb-4 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 font-mono text-xs text-accent">
                    Your rank:{' '}
                    <span className="font-bold">
                      #{myRank} of {leaderboard.length}
                    </span>
                  </div>
                )}

                {top5.length === 0 ? (
                  <p className="text-text-tertiary text-xs font-mono text-center py-6">
                    No scored projects yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {top5.map((entry, idx) => {
                      const isMe = project && entry.id === project.id;
                      const rank = idx + 1;
                      const medalColor =
                        rank === 1
                          ? 'text-yellow-400'
                          : rank === 2
                          ? 'text-gray-300'
                          : rank === 3
                          ? 'text-amber-600'
                          : 'text-text-tertiary';
                      return (
                        <div
                          key={entry.id}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors ${
                            isMe
                              ? 'ring-1 ring-accent border-accent/40 bg-accent/5'
                              : 'border-border bg-bg-1'
                          }`}
                        >
                          <span
                            className={`font-mono font-bold text-sm w-5 text-center shrink-0 ${medalColor}`}
                          >
                            {rank}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-text-primary truncate">
                              {entry.teamName}
                              {isMe && (
                                <span className="ml-1.5 font-mono text-[10px] text-accent">
                                  (you)
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] font-mono text-text-tertiary">
                              {entry.scoreCount} review{entry.scoreCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <span className="font-mono text-sm font-bold text-accent shrink-0">
                            {entry.avgScore.toFixed(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {leaderboard.length > 5 && (
                  <p className="mt-3 text-center font-mono text-[10px] text-text-tertiary">
                    +{leaderboard.length - 5} more teams scored
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
