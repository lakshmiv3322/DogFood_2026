# DOGFOOD 2026 — Architecture Notes

## Stack Overview

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | RSC + client components in one repo; `force-dynamic` escapes prerender for DB pages |
| Database | PostgreSQL 16 (Docker) | Relational integrity; Prisma migrations committed to repo |
| ORM | Prisma 5 | Type-safe, migration-tracked schema changes; `@@unique` constraint backs upsert |
| Auth | Session cookie (custom) | Cookie: session=<token> read by `getSessionUser()`; no JWT bloat |
| Passwords | bcryptjs (10 rounds) | Industry-standard; rate limiter guards brute-force in absence of HSM |
| Validation | Zod | Schema-first; `safeParse` returns flattened field errors for API consumers |
| Real-time UX | SWR polling | See note below |

---

## Real-time Updates: Polling over WebSockets/SSE

### Decision

Live coverage and judge progress indicators use **SWR client-side polling** rather than WebSockets or Server-Sent Events.

### Rationale

| Factor | Polling (chosen) | WebSockets / SSE |
|---|---|---|
| Operational complexity | Low — no persistent connection state, no reconnect logic | High — needs sticky sessions or a pub/sub broker (Redis) in multi-replica deploys |
| Failure modes | Silently stale for one poll interval; self-heals on next tick | Connection drop causes visible errors; requires exponential backoff and manual reconnect |
| Scale target | ≤ 40 projects, ≤ 30 judges, ≤ 10 concurrent organizers | N/A |
| Latency | 5–10 s acceptable at hackathon scale | Sub-second; overkill here |
| Implementation | `useSWR(..., { refreshInterval: 5000 })` — ~3 lines | Separate server process or Next.js route upgrade + client hook |

**At hackathon scale (≤ 40 projects, ≤ 30 judges) a 5-second poll generates at most 6 req/min per organizer — negligible load. The operational simplicity gain far outweighs the latency overhead.**

### When to revisit

Migrate to SSE (or a managed Realtime service like Supabase Realtime / Pusher) if:
- Concurrent organizer count exceeds ~50, or
- Sub-second update latency is required (e.g. live leaderboard on a main screen), or
- The deployment target has horizontal scaling (multiple app replicas) where an in-memory rate-limit Map and polling state diverge.

---

## Rate Limiting

The login route uses an **in-memory `Map`** keyed by `IP::email`, sliding 5-minute window, 5 attempts max.

> ⚠ **Known limitation**: the Map resets on every server restart, and does not work correctly across multiple app replicas. Before production traffic, replace with a Redis-backed counter (e.g. `ioredis` + `rate-limiter-flexible`, or Upstash Redis with `@upstash/ratelimit`).

---

## AuditLog

An `AuditLog` table and `writeAuditLog(actorId, action, targetId?)` helper exist in `src/lib/db.ts`. It is wired into **T3/T4 organizer routes** (delete comment, publish results) when those phases are implemented. The table is currently idle but schema-committed and migration-tracked.

---

## Session Tokens

Session tokens are **deterministic strings** seeded into the database:

| Role | Session token |
|---|---|
| Organizer | `org_dogfood_2026_master` |
| Judge A | `jdg_a_tomas_varga_2026` |
| Judge B | `jdg_b_wei_lindqvist_2026` |
| Participant | `prt_dogfood_2026_team` |

These match the `[auth]` headers in `.dogfood.toml` used by the DOGFOOD checker (`run.py`). The checker never hits `/api/auth/login`; it attaches the cookie header directly. **Do not randomize these tokens** without also updating `.dogfood.toml`.

---

## Migrations

Migrations are committed to `prisma/migrations/` and applied at container startup via `prisma migrate deploy` (in `docker-entrypoint.sh`). Never use `prisma db push` in this repo — it bypasses the migration history.
