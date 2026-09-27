import { NextRequest, NextResponse } from "next/server";
import { prisma, getSessionUser } from "@/lib/db";

/**
 * GET /api/export.csv
 * Organizer only — exports all scores as CSV.
 * Check #7: expect 200 + comma in first line.
 */
export async function GET(_req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const scores = await prisma.score.findMany({
    include: {
      judge: { select: { id: true, name: true, email: true } },
      project: {
        select: {
          id: true,
          title: true,
          team: { select: { name: true } },
          track: { select: { name: true } },
        },
      },
    },
    orderBy: [{ project: { id: "asc" } }, { judge: { id: "asc" } }],
  });

  // CSV header line (must contain a comma — check #7)
  const header = "project_id,project_title,track,team,judge_id,judge_name,judge_email,functionality,quality,average,comment";
  const rows = scores.map((s) => {
    const avg = ((s.functionality + s.quality) / 2).toFixed(2);
    const comment = `"${s.comment.replace(/"/g, '""')}"`;
    return [
      s.project.id,
      `"${s.project.title}"`,
      `"${s.project.track.name}"`,
      `"${s.project.team.name}"`,
      s.judge.id,
      `"${s.judge.name}"`,
      s.judge.email,
      s.functionality,
      s.quality,
      avg,
      comment,
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="dogfood2026-scores.csv"',
    },
  });
}
