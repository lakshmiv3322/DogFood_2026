import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "ORGANIZER" | "JUDGE" | "PARTICIPANT";
};

/**
 * Reads the session cookie and resolves the current user.
 * Returns null for unauthenticated requests (strangers).
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (!sessionId) return null;

  const user = await prisma.user.findUnique({
    where: { sessionId },
    select: { id: true, email: true, name: true, role: true },
  });

  return user as SessionUser | null;
}
