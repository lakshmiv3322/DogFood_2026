# DOGFOOD 2026 — Hackathon Management Portal

> A production-grade, full-stack hackathon platform — not a demo, an actual product.

Built with **Next.js 14**, **PostgreSQL**, **Prisma**, and **Three.js**. Features role-isolated dashboards, real-time judging, participant registration, leaderboards, CSV exports, and a 3D hero landing page. Runs fully offline with a single Docker command.

---

## ✨ Features

### 🌐 Public
- **3D Hero Landing Page** — Animated Three.js canvas, live stats strip, public leaderboard, judging timeline
- **Project Gallery** — Server-rendered, filterable by track, paginated — titles in initial HTML (SEO-ready)
- **Project Detail Pages** — Scores, feedback, team info, prev/next navigation

### 🔐 Authentication
- **Participant self-registration** — `/signup` creates a Team + User in a single transaction
- **Forgot password** — Token-based reset flow; in demo mode the link appears on-screen (no email server needed)
- **Role-based routing** — Organizer → cockpit, Judge → queue, Participant → personal dashboard
- **Session cookies** — HttpOnly, 7-day expiry, no JWT library dependency

### 👥 Participant Dashboard (`/dashboard/participant`)
- Team status card, submission details, track badge, repo link
- Anonymized judge feedback with per-criterion scores and comments
- Live leaderboard (top 5) with own team highlighted and rank shown

### ⚖️ Judge Dashboard (`/dashboard/judge`)
- Queue view with pending / done filter tabs and progress ring
- Per-project scoring form — 0–10 segmented buttons, autosave draft, Ctrl+Enter to submit
- Auto-refreshes every 10 seconds — no page reload needed

### 🏢 Organizer Cockpit (`/dashboard/organizer`)
- KPI row: total projects, judge coverage %, average score (computed from real data), scored count
- SWR live polling every 5 seconds with "updated Xs ago" indicator
- Coverage heatmap (judge × project matrix), sortable data table
- One-click CSV export (`/api/export.csv`)

### 🔒 Security
- Judges can only read/write their own scores — peer score inspection returns `403`
- Participants are blocked from `/api/judge/*` routes
- Deadline enforcement at API level — closed events reject submissions with `4xx`
- bcryptjs password hashing (cost factor 12)

---

## 🚀 Quickstart

### Docker (Recommended — fully offline)
```bash
docker compose up --build
```
Portal available at **`http://localhost:8080`**

The entrypoint automatically runs Prisma migrations and seeds the database from `fixtures.json`.
First startup takes ~4–5 minutes. Container becomes `(healthy)` when ready.

### Acceptance Checker
```bash
python run.py .dogfood.toml > acceptance-report.txt
cat acceptance-report.txt
```

---

## 👤 Demo Accounts

Passwords are printed by the seed script in container logs (`docker compose logs app`).

| Role | Email | Dashboard |
|------|-------|-----------|
| **Organizer** | `organizer@dogfood.local` | `/dashboard/organizer` |
| **Judge A** | `tomas.varga@example.org` | `/dashboard/judge` |
| **Judge B** | `wei.lindqvist@example.org` | `/dashboard/judge` |
| **Participant** | `participant@dogfood.local` | `/dashboard/participant` |

Or click **"View demo credentials"** on the `/login` page — it prefills the email field.

Register a new participant account at `/signup`.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router (standalone output) |
| Database | PostgreSQL 16 via Docker |
| ORM | Prisma 5 |
| Auth | Custom session cookies + bcryptjs |
| UI | Tailwind CSS 3, Framer Motion, Lucide React |
| 3D | Three.js + React Three Fiber + Drei |
| Validation | Zod |
| Data fetching | SWR (organizer cockpit live polling) |
| Language | TypeScript (strict) |
| Container | Docker + Docker Compose |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page (3D hero, leaderboard, CTA)
│   ├── projects/                   # Public gallery + detail pages
│   ├── signup/                     # Participant registration
│   ├── login/                      # Sign-in + demo credentials
│   ├── forgot-password/            # Password reset request
│   ├── reset-password/[token]/     # Password reset form
│   ├── dashboard/
│   │   ├── participant/            # Team status, scores, leaderboard
│   │   ├── judge/                  # Scoring queue + score form
│   │   └── organizer/              # KPI cockpit + coverage heatmap
│   └── api/
│       ├── auth/                   # login, register, forgot/reset password
│       ├── judge/scores            # Role-isolated score endpoints
│       ├── organizer/coverage      # Live coverage API (SWR target)
│       └── export.csv              # RFC 4180 CSV export
├── components/
│   ├── shell/                      # Header, Footer, Container
│   └── ui/                         # Button, Card, Input, Badge
├── lib/db.ts                       # Prisma client + getSessionUser()
└── assets/fonts/                   # Local fonts (offline-safe)

prisma/
├── schema.prisma                   # Event, Track, Team, Project, Score, User, Vote, Comment, AuditLog, PasswordResetToken
└── migrations/                     # Versioned SQL migrations
```

---

## 🧪 Acceptance Tests (T1 + T2 claimed)

| Check | Endpoint | Expected |
|-------|----------|----------|
| Gallery is public | `GET /projects` | `200` + fixture titles in body |
| Fixture projects shown | `GET /projects` | Glass Signal, Small Meadow, Deep Compass |
| Closed event rejects submissions | `POST /projects/new` | `4xx` |
| Judge sees own scores | `GET /api/judge/scores` | `200` |
| Judge blocked from peer scores | `GET /api/judge/scores?judge=jdg_01` | `403` |
| Participant blocked from judge API | `GET /api/judge/scores` | `403` |
| CSV export works | `GET /api/export.csv` | `200` + CSV |

---

## ⚠️ Known Limits

- **Email delivery** — Password reset links are shown on-screen in demo mode (`NEXT_PUBLIC_DEMO_MODE=true`). A production deploy would wire in a transactional email provider.
- **Public voting (T3)** — Schema models `Vote` and `Comment` exist; UI deferred to T3.
- **WebSockets** — Real-time uses SWR polling (5s organizer, 10s judge) rather than persistent WebSocket connections, compatible with Next.js standalone mode.
