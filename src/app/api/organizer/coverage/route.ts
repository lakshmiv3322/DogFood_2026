import { NextRequest, NextResponse } from "next/server";
import { prisma, getSessionUser } from "@/lib/db";

/**
 * GET /api/organizer/coverage
 * Organizer-only: returns scoring coverage stats for the organizer dashboard.
 * Polled every 5s by the client (SWR) — no WebSocket / SSE required.
 */
export async function GET(_req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalProjects, scores, judges] = await Promise.all([
    prisma.project.count(),
    prisma.score.findMany({
      select: {
        projectId: true,
        judgeId: true,
        judge: { select: { id: true, name: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "JUDGE", sessionId: { not: null } },
      select: { id: true, name: true },
    }),
  ]);

  // Count distinct scored projects
  const scoredProjectIds = new Set(scores.map((s) => s.projectId));
  const scoredProjects = scoredProjectIds.size;

  // Count scores per judge
  const judgeScoreCount = new Map<string, { judgeId: string; judgeName: string; count: number }>();

  for (const j of judges) {
    judgeScoreCount.set(j.id, { judgeId: j.id, judgeName: j.name, count: 0 });
  }
  for (const s of scores) {
    const entry = judgeScoreCount.get(s.judgeId);
    if (entry) {
      entry.count++;
    } else {
      judgeScoreCount.set(s.judgeId, {
        judgeId: s.judgeId,
        judgeName: s.judge.name,
        count: 1,
      });
    }
  }

  const scoresPerJudge = Array.from(judgeScoreCount.values()).sort(
    (a, b) => b.count - a.count
  );

  return NextResponse.json({
    totalProjects,
    scoredProjects,
    scoresPerJudge,
  });
}
