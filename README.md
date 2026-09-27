# DOGFOOD 2026 — Modern Hackathon Judging & Showcase Portal

A production-grade, commercial hackathon management portal engineered for DOGFOOD 2026. Designed with an ultra-clean, dark Linear-inspired SaaS aesthetic, strict role-based access control, deadline enforcement, real-time rubric evaluation, and automated acceptance verification.

---

## What It Does

- **Public Gallery**: Fast, filterable showcase of all submitted projects with live search across titles and summaries, track filtering, and pagination.
- **Deadline-Enforced Submissions**: Enforces event closing times directly at the API and database levels. Submissions past `submissions_close` are rejected with `4xx`.
- **Role Isolation & Judging Engine**:
  - Independent evaluation dashboards for judges.
  - Granular backend security: judges can exclusively access and modify their own scores (`/api/judge/scores`).
  - Attempting to inspect a peer judge's scores (`/api/judge/scores?judge=...`) returns `403 Forbidden` at the HTTP layer, not merely hidden in HTML templates.
- **Organizer Intelligence & Export**:
  - Aggregated submission counts, track distributions, and reviewer coverage metrics.
  - One-click RFC 4180 compliant CSV export (`/api/export.csv`) for downstream tabulation.
- **Self-Contained & Deterministic**: Runs fully offline with `docker compose up`. No third-party cloud dependencies, external telemetry, or hosted databases.

---

## Quickstart

### 1. Prerequisites
- Docker & Docker Compose **or** Node.js 18+ and PostgreSQL

### 2. Run with Docker (Recommended)
Bring up the entire portal and database with a single command:
```bash
docker compose up --build
```
The portal starts at **`http://localhost:8080`**.

### 3. Running Acceptance Checker
In a separate terminal, execute the standard DOGFOOD acceptance checker:
```bash
python3 run.py .dogfood.toml > acceptance-report.txt
cat acceptance-report.txt
```

---

## Auth & Accounts

The database seed script automatically populates the database with the official `fixtures.json` and creates four authenticatable sessions:

| Role | Email | Purpose |
|------|-------|---------|
| **Organizer** | `organizer@dogfood.local` | Overview, analytics, and CSV exports |
| **Judge A** | `tomas.varga@example.org` | Primary evaluator (`jdg_01`) |
| **Judge B** | `wei.lindqvist@example.org` | Peer evaluator (`jdg_02`) |
| **Participant** | `participant@dogfood.local` | Team member / submitter |

To test the web interface directly, click any of the **Quick Access** buttons on the `/login` screen.

---

## Architectural & Design Highlights

- **Next.js 14 App Router (Standalone)**: Server-side rendering (SSR) for instantaneous gallery loads with zero layout shift.
- **Prisma ORM & PostgreSQL**: Relational schema guaranteeing referential integrity across projects, tracks, teams, judges, and score rubrics.
- **Backend Defense-in-Depth**: Role authentication and permission checks occur inside route handlers before any database queries execute.
- **Responsive Dark SaaS UI**: Tailored with Tailwind CSS using high-contrast neon accents, status pills, and keyboard-friendly controls.

---

## Honest Limits & Known Scope

- **Email Delivery**: Notifications and magic-link emails are disabled to maintain strict zero-network container isolation.
- **Public Voting (T3)**: The data schema is pre-modeled for community votes and public feedback; production UI for public voting is staged for T3.
- **CSV Format**: Exports use comma delimiters and quoted fields; custom TSV or JSON export presets can be configured if required.
