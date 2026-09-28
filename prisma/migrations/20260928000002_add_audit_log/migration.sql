-- CreateTable: AuditLog for organizer privileged actions (DELETE_COMMENT, PUBLISH_RESULTS, etc.)
-- T3/T4 routes will INSERT rows when they are implemented.
CREATE TABLE "AuditLog" (
    "id"        TEXT NOT NULL,
    "actorId"   TEXT NOT NULL,
    "action"    TEXT NOT NULL,
    "targetId"  TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
