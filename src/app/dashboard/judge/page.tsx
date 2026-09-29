import { redirect } from "next/navigation";
import { getSessionUser, prisma } from "@/lib/db";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { JudgeQueueView, QueueProject } from "./JudgeQueueView";

export const dynamic = "force-dynamic";

export default async function JudgeDashboard() {
  const user = await getSessionUser();
  if (!user || user.role !== "JUDGE") redirect("/login");

  // Query judge's tracks and projects
  const [assignedTracks, judgeScores] = await Promise.all([
    prisma.judgeTrack.findMany({
      where: { judgeId: user.id },
      include: { track: true },
    }),
    prisma.score.findMany({
      where: { judgeId: user.id },
    }),
  ]);

  const trackIds = assignedTracks.map((jt) => jt.trackId);

  // Fetch all projects in assigned tracks
  const projects = await prisma.project.findMany({
    where: {
      trackId: { in: trackIds },
    },
    include: {
      track: { select: { name: true } },
      team: { select: { name: true } },
    },
    orderBy: { id: "asc" },
  });

  const scoresByProjectId = new Map(judgeScores.map((s) => [s.projectId, s]));

  const queueProjects: QueueProject[] = projects.map((p) => {
    const score = scoresByProjectId.get(p.id);
    return {
      id: p.id,
      title: p.title,
      summary: p.summary,
      repoUrl: p.repoUrl,
      trackName: p.track.name,
      teamName: p.team.name,
      hasScore: Boolean(score),
      funcScore: score?.functionality,
      qualScore: score?.quality,
      comment: score?.comment,
      updatedAt: score?.updatedAt.toISOString(),
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header user={user} />

      <main className="flex-1 py-10">
        <Container size="xl">
          <JudgeQueueView
            projects={queueProjects}
            judgeName={user.name}
          />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
