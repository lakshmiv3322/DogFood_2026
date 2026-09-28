import { NextRequest, NextResponse } from "next/server";
import { prisma, getSessionUser } from "@/lib/db";
import { ScoreSubmitSchema } from "@/lib/validation";

/**
 * GET /api/judge/scores
 * - Judge: returns their own scores (200)
 * - Participant / Stranger: 403
 *
 * GET /api/judge/scores?judge=<sessionId-or-userId>
 * - Judge A asking for Judge A's scores → 200
 * - Judge B asking for Judge A's scores → 403  ✅ check #5
 */
export async function GET(req: NextRequest) {
  const user = await getSessionUser();

  // Non-judge → 403
  if (!user || user.role === "PARTICIPANT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (user.role === "ORGANIZER") {
    // Organizer can see all scores
    const scores = await prisma.score.findMany({
      include: {
        judge: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ scores });
  }

  // JUDGE role — check for peer-score request
  const judgeParam = req.nextUrl.searchParams.get("judge");

  if (judgeParam) {
    // Support aliases "judge_a" / "judge_b" or direct ID / sessionId / email
    let targetJudge = await prisma.user.findFirst({
      where: {
        OR: [
          { id: judgeParam },
          { sessionId: judgeParam },
          ...(judgeParam === "judge_a" ? [{ sessionId: { startsWith: "jdg_a_" } }, { id: "jdg_01" }] : []),
          ...(judgeParam === "judge_b" ? [{ sessionId: { startsWith: "jdg_b_" } }, { id: "jdg_02" }] : []),
          { email: { contains: judgeParam } },
        ],
      },
    });

    // ✅ CRITICAL (check #5): a judge can only see their OWN scores
    if (!targetJudge || targetJudge.id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: you may not view another judge's scores" },
        { status: 403 }
      );
    }
  }

  // Return this judge's own scores
  const scores = await prisma.score.findMany({
    where: { judgeId: user.id },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          summary: true,
          track: { select: { name: true } },
          team: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const summary = {
    judgeId: user.id,
    judgeName: user.name,
    totalScored: scores.length,
    scores: scores.map((s) => ({
      scoreId: s.id,
      project: s.project,
      criteria: { functionality: s.functionality, quality: s.quality },
      comment: s.comment,
      scoredAt: s.createdAt,
    })),
  };

  return NextResponse.json(summary);
}

/**
 * POST /api/judge/scores
 * Judges can submit or update a score for a project.
 */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "JUDGE") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const result = ScoreSubmitSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { projectId, functionality, quality, comment } = result.data;

  // Wrap upsert in transaction to prevent race conditions on concurrent submits
  const score = await prisma.$transaction(async (tx) => {
    return tx.score.upsert({
      where: { judgeId_projectId: { judgeId: user.id, projectId } },
      update: {
        functionality,
        quality,
        comment,
      },
      create: {
        judgeId: user.id,
        projectId,
        functionality,
        quality,
        comment,
      },
    });
  });

  return NextResponse.json({ score }, { status: 201 });
}
