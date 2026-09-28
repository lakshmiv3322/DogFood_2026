import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/validation";

// ---------------------------------------------------------------------------
// In-memory rate limiter — tracks failed attempts per (IP + email).
// ⚠️ NOTE: this Map resets on every server restart. Before real production
//    traffic, move this to Redis (e.g. Upstash) so limits survive restarts
//    and work across multiple app replicas.
// ---------------------------------------------------------------------------
interface FailRecord {
  count: number;
  windowStart: number; // ms timestamp
}
const failMap = new Map<string, FailRecord>();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

function getRateLimitKey(req: NextRequest, email: string): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  return `${ip}::${email.toLowerCase()}`;
}

function checkRateLimit(key: string): { limited: boolean; remaining: number } {
  const now = Date.now();
  const rec = failMap.get(key);

  if (!rec || now - rec.windowStart > WINDOW_MS) {
    // Fresh window
    return { limited: false, remaining: MAX_ATTEMPTS };
  }

  const remaining = MAX_ATTEMPTS - rec.count;
  return { limited: rec.count >= MAX_ATTEMPTS, remaining: Math.max(0, remaining) };
}

function recordFailure(key: string): void {
  const now = Date.now();
  const rec = failMap.get(key);

  if (!rec || now - rec.windowStart > WINDOW_MS) {
    failMap.set(key, { count: 1, windowStart: now });
  } else {
    rec.count += 1;
  }
}

function clearFailures(key: string): void {
  failMap.delete(key);
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const result = LoginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { email, password } = result.data;
  const rlKey = getRateLimitKey(req, email);

  // Check rate limit before any DB hit
  const { limited, remaining } = checkRateLimit(rlKey);
  if (limited) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in 5 minutes." },
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": "0" },
      }
    );
  }

  // Fetch user
  const user = await prisma.user.findUnique({ where: { email } });

  // Validate password — bcrypt.compare is constant-time
  const passwordOk =
    user?.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

  if (!user || !passwordOk) {
    recordFailure(rlKey);
    // Generic message — do NOT reveal which field was wrong
    return NextResponse.json(
      { error: "Invalid email or password" },
      {
        status: 401,
        headers: { "X-RateLimit-Remaining": String(remaining - 1) },
      }
    );
  }

  // Successful auth — clear failure counter and set session cookie
  clearFailures(rlKey);

  const response = NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  // ✅ Session cookie unchanged — run.py's Cookie: session=... headers still work
  response.cookies.set("session", user.sessionId ?? "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

// ---------------------------------------------------------------------------
// DELETE /api/auth/login — logout
// ---------------------------------------------------------------------------
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", { maxAge: 0, path: "/" });
  return response;
}
