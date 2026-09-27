# ARCHITECTURE.md — DOGFOOD 2026 Portal

## 1. System Overview

The DOGFOOD 2026 portal is a self-contained, containerized web application engineered for hackathon submissions, judging workflows, and results administration.

```
                              ┌─────────────────────────────┐
                              │     Client / run.py         │
                              └──────────────┬──────────────┘
                                             │ HTTP (port 8080)
                                             ▼
                              ┌─────────────────────────────┐
                              │  Next.js 14 App Server      │
                              │  (SSR, Routing, Security)   │
                              └──────────────┬──────────────┘
                                             │
                        ┌────────────────────┴────────────────────┐
                        ▼                                         ▼
         ┌─────────────────────────────┐           ┌─────────────────────────────┐
         │ Public Pages & UI Handlers  │           │ REST / Protected API Routes │
         │ (/projects, /login, /dash)  │           │ (/api/judge/*, /api/export) │
         └──────────────┬──────────────┘           └──────────────┬──────────────┘
                        │                                         │
                        └────────────────────┬────────────────────┘
                                             │ Prisma ORM Client
                                             ▼
                              ┌─────────────────────────────┐
                              │     PostgreSQL Database     │
                              │     (Relational Store)      │
                              └─────────────────────────────┘
```

---

## 2. Technology Choices & Rationale

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Framework** | **Next.js 14 (App Router)** | Unifies server-rendered React components and API route handlers in a single repo. Enables blazing-fast server-rendered gallery pages while retaining dynamic client interactivity. |
| **Language** | **TypeScript** | Strict compile-time typing prevents subtle attribute errors and aligns data structures precisely with `fixtures.json`. |
| **Database** | **PostgreSQL 16** | ACID-compliant relational store. Enforces composite unique constraints (e.g. `(judgeId, projectId)`) and cascades, preventing duplicate submissions or review inconsistencies. |
| **ORM / Data Access** | **Prisma** | Generates fully type-safe query builders from schema models, providing declarative migrations and zero runtime query bugs. |
| **Styling** | **Tailwind CSS** | Atomic utility architecture with a customized dark palette (`#0a0f1e`, `#ff3d6e`, `#00e5d0`) ensuring consistent, high-contrast, linear-style aesthetics across viewports. |
| **Deployment** | **Docker Compose** | Bundles application and database containers on an isolated bridge network with zero external cloud dependencies. |

---

## 3. Security & Role Isolation Model

### Threat Model & Defense-in-Depth
A critical requirement of DOGFOOD 2026 (Check #5 & Check #6) is ensuring that judges cannot access peer evaluation scores, and participants cannot access judging APIs.

Many systems make the fatal error of hiding peer scores in UI templates while leaving underlying REST APIs unprotected. Our architecture enforces role isolation **at the HTTP handler level**:

```
                       Request: GET /api/judge/scores?judge=jdg_01
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  Session Cookie Verification   │
                       └───────────────┬───────────────┘
                                       │
                        Valid? ────────┴──────── No ──► 401 Unauthorized
                          │
                          ▼
                       ┌───────────────────────────────┐
                       │     Role-Based Access Check   │
                       └───────────────┬───────────────┘
                                       │
                     Role == PARTICIPANT? ───── Yes ──► 403 Forbidden
                          │
                          ▼ (Role == JUDGE)
                       ┌───────────────────────────────┐
                       │   Target Judge ID == Caller?  │
                       └───────────────┬───────────────┘
                                       │
                         No ───────────┴──────────────► 403 Forbidden
                         │
                        Yes
                         ▼
             Query DB for Caller's Own Scores Only ────► 200 OK (JSON)
```

1. **Authentication**: Handlers inspect the `session` cookie. If missing or invalid, unauthenticated requests to protected endpoints return `401/403`.
2. **Role Boundaries**:
   - `ORGANIZER`: Authorized for all aggregations and `/api/export.csv`.
   - `JUDGE`: Authorized only for `/api/judge/scores` scoped strictly to `user.id`.
   - `PARTICIPANT`: Rejected from all judge endpoints with `403 Forbidden`.
3. **Peer Score Lock**: When `?judge=<id>` query parameter is supplied, the server asserts `targetJudge.id === sessionUser.id`. Mismatches immediately terminate with `403 Forbidden`.

---

## 4. Submission Deadline Architecture

Event submissions are governed by `Event.submissionsClose` (`2026-03-01T18:00:00Z` from `fixtures.json`).
- `POST /projects/new` checks `new Date() > event.submissionsClose`.
- Because the fixture event deadline is set in the past, late submissions are deterministically rejected with `422 Unprocessable Entity` (fulfilling Check #3).

---

## 5. Offline Container Strategy

The `docker-compose.yml` specification uses:
- Built-in multi-stage Docker build producing a lean standalone Node.js artifact.
- Automated entrypoint script (`docker-entrypoint.sh`) that polls for PostgreSQL readiness, executes `prisma db push`, and runs `seed.ts` before starting the HTTP listener.
- No remote package downloads or network fetches occur during container runtime.
