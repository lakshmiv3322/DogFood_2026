import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { RegisterSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { teamName, email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    const sessionId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const teamId = `team_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;

    // Create Team and User inside a single ACID transaction
    const { user, team } = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          id: teamId,
          name: teamName.trim(),
          members: [normalizedEmail],
        },
      });

      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          name: teamName.trim(),
          role: "PARTICIPANT",
          sessionId,
          passwordHash,
        },
      });

      return { user, team };
    });

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamId: team.id,
        },
      },
      { status: 201 }
    );

    // Set session cookie using identical logic to /api/auth/login
    response.cookies.set("session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to complete participant registration" },
      { status: 500 }
    );
  }
}
