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

/**
 * Records an organizer action in the AuditLog table.
 * Call this from any route that performs a privileged operation.
 *
 * @param actorId  - User.id of the organizer performing the action
 * @param action   - Descriptive event name, e.g. "DELETE_COMMENT"
 * @param targetId - Optional ID of the affected resource
 *
 * NOTE: Wired into T3/T4 routes when those phases are implemented.
 * Currently the table exists and this helper is ready to use.
 */
export async function writeAuditLog(
  actorId: string,
  action: string,
  targetId?: string
): Promise<void> {
  await prisma.auditLog.create({
    data: { actorId, action, targetId: targetId ?? null },
  });
}
