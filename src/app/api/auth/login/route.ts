import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/auth/login
 * Sets the session cookie for the user.
 * Body: { email: string, sessionId?: string }  (dev: pass sessionId directly from seed output)
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user || !user.sessionId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const response = NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  response.cookies.set("session", user.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

/**
 * DELETE /api/auth/login — logout
 */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", { maxAge: 0, path: "/" });
  return response;
}
