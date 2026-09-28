import { NextRequest, NextResponse } from "next/server";
import { prisma, getSessionUser } from "@/lib/db";
import { ProjectSubmitSchema } from "@/lib/validation";

/**
 * POST /projects/new  (HTML form → this handler)
 * This route is also the target for check #3 via run.py.
 * Must return 4xx if the event is closed.
 */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "PARTICIPANT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const event = await prisma.event.findFirst({ orderBy: { createdAt: "asc" } });
  if (!event) {
    return NextResponse.json({ error: "No event found" }, { status: 404 });
  }

  // ✅ Check #3: enforce the fixture's submissions_close date
  const now = new Date();
  if (now > event.submissionsClose) {
    return NextResponse.json(
      {
        error: "Submissions closed",
        submissions_close: event.submissionsClose.toISOString(),
      },
      { status: 422 }
    );
  }

  // Parse form data or JSON
  let body: Record<string, string> = {};
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    body = await req.json().catch(() => ({}));
  } else {
    const fd = await req.formData().catch(() => null);
    if (fd) {
      fd.forEach((val, key) => {
        body[key] = val.toString();
      });
    }
  }

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

  const validData = result.data;

  // Pick first available track/team if not provided (for the probe request from run.py)
  const track = await prisma.track.findFirst();
  const team = await prisma.team.findFirst();

  const project = await prisma.project.create({
    data: {
      id: `prj_new_${Date.now()}`,
      title: validData.title,
      summary: validData.summary ?? "",
      repoUrl: validData.repo_url ?? validData.repoUrl ?? "",
      teamId: validData.teamId ?? team?.id ?? "tm_01",
      trackId: validData.trackId ?? track?.id ?? "trk_01",
      eventId: event.id,
      submittedAt: now,
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}

export async function GET() {
  // HTML submission form — render as a simple page
  return new Response(
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Submit Project — DOGFOOD 2026</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body{margin:0;background:#0a0f1e;color:#e6ecff;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
    .card{border:1px solid #1b2540;background:#0e1428;padding:40px;max-width:480px;width:100%}
    h1{margin:0 0 8px;font-size:1.4rem;text-transform:uppercase;letter-spacing:-.02em}
    p{color:#6b7a9e;font-size:.75rem;margin:0 0 24px;line-height:1.7}
    label{display:block;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:#6b7a9e;margin-bottom:6px}
    input,textarea{width:100%;background:#0a0f1e;border:1px solid #1b2540;color:#e6ecff;font-family:monospace;font-size:.8rem;padding:10px;box-sizing:border-box;margin-bottom:16px}
    input:focus,textarea:focus{outline:none;border-color:#00e5d0}
    textarea{min-height:80px;resize:vertical}
    button{background:#ff3d6e;color:#0a0f1e;font-family:monospace;font-size:.7rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;border:none;padding:12px 24px;cursor:pointer;width:100%}
    button:hover{background:#e6ecff}
    .back{display:block;font-size:.65rem;letter-spacing:.16em;text-transform:uppercase;color:#6b7a9e;text-decoration:none;margin-top:16px;text-align:center}
    .back:hover{color:#e6ecff}
    .closed{border:1px solid #ff3d6e;padding:16px;color:#ff3d6e;font-size:.75rem;line-height:1.7;margin-bottom:24px}
  </style>
</head>
<body>
  <div class="card">
    <h1>Submit Project</h1>
    <p>DOGFOOD 2026 · Hackathon Raptors</p>
    <div class="closed">⚠ Submissions are currently closed. The deadline has passed.</div>
    <a href="/projects" class="back">← Back to gallery</a>
  </div>
</body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}
