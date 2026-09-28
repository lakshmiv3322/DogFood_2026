#!/usr/bin/env tsx
/**
 * DOGFOOD 2026 Seed Script
 *
 * Loads fixtures.json into PostgreSQL and creates the four auth identities.
 * Prints auth headers to stdout at startup — copy them into .dogfood.toml [auth].
 *
 * Usage: npm run seed
 */

import { PrismaClient, Role } from "@prisma/client";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface FixtureEvent {
  id: string;
  name: string;
  submissions_close: string;
}
interface FixtureTrack {
  id: string;
  name: string;
}
interface FixtureJudge {
  id: string;
  name: string;
  email: string;
  tracks: string[];
}
interface FixtureTeam {
  id: string;
  name: string;
  members: string[];
}
interface FixtureProject {
  id: string;
  team: string;
  track: string;
  title: string;
  summary: string;
  repo_url: string;
  submitted_at: string;
}
interface FixtureScore {
  judge: string;
  project: string;
  criteria: { functionality?: number; quality?: number };
  comment?: string;
}
interface Fixtures {
  event: FixtureEvent;
  tracks: FixtureTrack[];
  judges: FixtureJudge[];
  teams: FixtureTeam[];
  projects: FixtureProject[];
  scores: FixtureScore[];
}

async function main() {
  // ---------------------------------------------------------------------------
  // Load fixtures.json  (search in a few expected locations)
  // ---------------------------------------------------------------------------
  const candidates = [
    path.join(process.cwd(), "fixtures.json"),
    path.join(process.cwd(), "data", "fixtures.json"),
    path.join(__dirname, "..", "..", "fixtures.json"),
  ];
  let fixtures: Fixtures | null = null;
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const raw = fs.readFileSync(c, "utf-8").replace(/^\uFEFF/, "");
      fixtures = JSON.parse(raw);
      console.error(`[seed] Loaded fixtures from ${c}`);
      break;
    }
  }
  if (!fixtures) {
    throw new Error(
      "fixtures.json not found. Place it at the repo root or in /data/"
    );
  }

  // ---------------------------------------------------------------------------
  // Wipe existing data (idempotent re-seed)
  // ---------------------------------------------------------------------------
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE
    "Comment", "Vote", "Score", "Project", "JudgeTrack",
    "Team", "User", "Track", "Event"
    RESTART IDENTITY CASCADE`);

  // ---------------------------------------------------------------------------
  // Event — seed with the FIXTURE's submissions_close date (required for check #3)
  // ---------------------------------------------------------------------------
  await prisma.event.create({
    data: {
      id: fixtures.event.id,
      name: fixtures.event.name,
      // ✅ CRITICAL: use the fixture date, NOT new Date() — check #3 depends on it being in the past
      submissionsClose: new Date(fixtures.event.submissions_close),
    },
  });

  // Tracks
  await prisma.track.createMany({
    data: fixtures.tracks.map((t) => ({ id: t.id, name: t.name })),
  });

  // ---------------------------------------------------------------------------
  // Auth identities — four seeded users with deterministic session tokens
  // ---------------------------------------------------------------------------
  const SESSION = {
    organizer: process.env.SESSION_ORGANIZER || "org_dogfood_2026_master",
    judge_a: process.env.SESSION_JUDGE_A || "jdg_a_tomas_varga_2026",
    judge_b: process.env.SESSION_JUDGE_B || "jdg_b_wei_lindqvist_2026",
    participant: process.env.SESSION_PARTICIPANT || "prt_dogfood_2026_team",
  };

  // Generate random seed-only passwords and hash them (10 salt rounds)
  const SALT_ROUNDS = 10;
  const PASSWORDS = {
    organizer: `org-${randomUUID().slice(0, 8)}`,
    judge_a: `jdg-${randomUUID().slice(0, 8)}`,
    judge_b: `jdg-${randomUUID().slice(0, 8)}`,
    participant: `prt-${randomUUID().slice(0, 8)}`,
  };
  const HASHES = {
    organizer: await bcrypt.hash(PASSWORDS.organizer, SALT_ROUNDS),
    judge_a: await bcrypt.hash(PASSWORDS.judge_a, SALT_ROUNDS),
    judge_b: await bcrypt.hash(PASSWORDS.judge_b, SALT_ROUNDS),
    participant: await bcrypt.hash(PASSWORDS.participant, SALT_ROUNDS),
  };

  // Organizer (not in fixture data, we create them)
  await prisma.user.create({
    data: {
      id: "usr_organizer",
      email: "organizer@dogfood.local",
      name: "Organizer",
      role: Role.ORGANIZER,
      sessionId: SESSION.organizer,
      passwordHash: HASHES.organizer,
    },
  });

  // Participant (not in fixture data)
  await prisma.user.create({
    data: {
      id: "usr_participant",
      email: "participant@dogfood.local",
      name: "Participant",
      role: Role.PARTICIPANT,
      sessionId: SESSION.participant,
      passwordHash: HASHES.participant,
    },
  });

  // Judges — map jdg_01 → judge_a, jdg_02 → judge_b for checker roles
  const JUDGE_A_FIXTURE_ID = fixtures.judges[0]?.id ?? "jdg_01";
  const JUDGE_B_FIXTURE_ID = fixtures.judges[1]?.id ?? "jdg_02";

  for (const j of fixtures.judges) {
    let sessionId: string | undefined;
    let passwordHash = "";
    if (j.id === JUDGE_A_FIXTURE_ID) { sessionId = SESSION.judge_a; passwordHash = HASHES.judge_a; }
    if (j.id === JUDGE_B_FIXTURE_ID) { sessionId = SESSION.judge_b; passwordHash = HASHES.judge_b; }

    await prisma.user.create({
      data: {
        id: j.id,
        email: j.email,
        name: j.name,
        role: Role.JUDGE,
        sessionId: sessionId ?? null,
        passwordHash,
      },
    });

    // Judge → Track assignments
    await prisma.judgeTrack.createMany({
      data: j.tracks.map((trackId) => ({ judgeId: j.id, trackId })),
    });
  }

  // Teams
  await prisma.team.createMany({
    data: fixtures.teams.map((t) => ({
      id: t.id,
      name: t.name,
      members: t.members,
    })),
  });

  // Projects
  await prisma.project.createMany({
    data: fixtures.projects.map((p) => ({
      id: p.id,
      teamId: p.team,
      trackId: p.track,
      title: p.title,
      summary: p.summary,
      repoUrl: p.repo_url,
      submittedAt: new Date(p.submitted_at),
      eventId: fixtures!.event.id,
    })),
  });

  // Scores (intentionally sparse in fixtures — handle missing fields gracefully)
  for (const s of fixtures.scores ?? []) {
    await prisma.score.create({
      data: {
        judgeId: s.judge,
        projectId: s.project,
        functionality: s.criteria?.functionality ?? 0,
        quality: s.criteria?.quality ?? 0,
        comment: s.comment ?? "",
      },
    });
  }

  // ---------------------------------------------------------------------------
  // ✅ Print auth headers — copy these into .dogfood.toml [auth]
  // ---------------------------------------------------------------------------
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║        DOGFOOD 2026 — AUTH HEADERS (copy to toml)   ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║  organizer   = "Cookie: session=${SESSION.organizer}"`);
  console.log(`║  judge_a     = "Cookie: session=${SESSION.judge_a}"`);
  console.log(`║  judge_b     = "Cookie: session=${SESSION.judge_b}"`);
  console.log(`║  participant = "Cookie: session=${SESSION.participant}"`);
  console.log("╚══════════════════════════════════════════════════════╝\n");

  // ⚠️ SEED-ONLY CREDENTIALS — these are printed once and not stored in plaintext
  // Use them to log in via the web UI at /login. Do NOT use these in production.
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║   DOGFOOD 2026 — SEED-ONLY PASSWORDS (web login)    ║");
  console.log("║   ⚠️  These reset on every `docker compose down -v`  ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║  organizer@dogfood.local   →  ${PASSWORDS.organizer}`);
  console.log(`║  tomas.varga (judge_a)     →  ${PASSWORDS.judge_a}`);
  console.log(`║  wei.lindqvist (judge_b)   →  ${PASSWORDS.judge_b}`);
  console.log(`║  participant@dogfood.local →  ${PASSWORDS.participant}`);
  console.log("╚══════════════════════════════════════════════════════╝\n");

  console.log(
    `[seed] Done — ${fixtures.tracks.length} tracks, ${fixtures.judges.length} judges, ` +
      `${fixtures.teams.length} teams, ${fixtures.projects.length} projects, ` +
      `${fixtures.scores?.length ?? 0} scores`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
