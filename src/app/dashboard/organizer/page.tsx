import { redirect } from "next/navigation";
import { getSessionUser, prisma } from "@/lib/db";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { OrganizerWorkspace } from "./OrganizerWorkspace";

export const dynamic = "force-dynamic";

export default async function OrganizerDashboard() {
  const user = await getSessionUser();
  if (!user || user.role !== "ORGANIZER") redirect("/login");

  // Query projects, judges, tracks, and scores
  const [projects, judges, tracks, totalProjects, totalJudges] = await Promise.all([
    prisma.project.findMany({
      include: {
        track: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
        scores: {
          include: {
            judge: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { id: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "JUDGE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.track.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.project.count(),
    prisma.user.count({ where: { role: "JUDGE" } }),
  ]);

  const formattedProjects = projects.map((p) => {
    const scores = p.scores.map((s) => ({
      judgeId: s.judge.id,
      judgeName: s.judge.name,
      functionality: s.functionality,
      quality: s.quality,
      total: (s.functionality + s.quality) / 2,
    }));

    const avgScore =
      scores.length > 0
        ? scores.reduce((sum, s) => sum + s.total, 0) / scores.length
        : null;

    return {
      id: p.id,
      title: p.title,
      summary: p.summary,
      trackId: p.track.id,
      trackName: p.track.name,
      teamName: p.team.name,
      repoUrl: p.repoUrl,
      scores,
      avgScore,
      reviewCount: scores.length,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header user={user} />

      <main className="flex-1 py-10">
        <Container size="xl">
          <OrganizerWorkspace
            initialProjects={formattedProjects}
            judges={judges}
            tracks={tracks}
            totalProjects={totalProjects}
            totalJudges={totalJudges}
          />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
