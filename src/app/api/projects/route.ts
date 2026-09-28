import { NextRequest, NextResponse } from "next/server";
import { prisma, getSessionUser } from "@/lib/db";
import { ProjectSubmitSchema } from "@/lib/validation";

/**
 * POST /projects/new  (or /api/projects)
 * Participants can submit projects — but ONLY while the event is open.
 * Check #3: closed event (submissions_close in the past) → 4xx
 */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "PARTICIPANT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ✅ Check #3: enforce the fixture event's submissions_close date
  const event = await prisma.event.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!event) {
    return NextResponse.json({ error: "No event found" }, { status: 404 });
  }

  const now = new Date();
  if (now > event.submissionsClose) {
    return NextResponse.json(
      {
        error: "Submissions are closed",
        closed_at: event.submissionsClose.toISOString(),
        now: now.toISOString(),
      },
      { status: 422 }
    );
  }

  const body = await req.json().catch(() => null);
  const result = ProjectSubmitSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { title, summary, repoUrl } = result.data;
  const teamId = result.data.teamId ?? body?.teamId;
  const trackId = result.data.trackId ?? body?.trackId;

  if (!teamId || !trackId) {
    return NextResponse.json(
      { error: "teamId and trackId are required" },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: {
      id: `prj_${Date.now()}`,
      title,
      summary: summary ?? "",
      repoUrl: repoUrl ?? "",
      teamId,
      trackId,
      eventId: event.id,
      submittedAt: now,
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
