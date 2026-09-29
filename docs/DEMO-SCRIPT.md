# DOGFOOD 2026 — 5-Minute Platform Demonstration Script

**Total Runtime:** 5 minutes (300 seconds)  
**Target Audience:** Hackathon Organizers, Evaluation Committees, and Lead Engineers  
**Presenter Tone:** Concise, technical, authoritative, product-focused  

---

## Breakdown & Timeline

```
[00:00 - 00:30]  30s  Hero Band & Commercial Landing
[00:30 - 01:30]  60s  Public Gallery, Search & Tilt Cards
[01:30 - 02:30]  60s  Judge Scoring Surface & Autosave
[02:30 - 03:30]  60s  Organizer Cockpit, Heatmap & CSV Export
[03:30 - 04:30]  60s  Role Isolation & Security Audit Proof
[04:30 - 05:00]  30s  Closing & Architecture Summary
```

---

### Segment 1: Hero Band & Commercial Landing (0:00 – 0:30)

* **Visual:** Browser opens to `http://localhost:8080/`. The camera drifts subtly over the procedural 3D faceted glass field as the pointer moves across the screen. Display headline reads *"Engineered to Evaluate at Scale"*. The live stat strip shows real-time project and judge metrics.
* **Audio / Voiceover:**
  > *"Welcome to DOGFOOD 2026, the high-throughput evaluation portal built for competitive hackathons. Unlike standard hackathon directory templates, DOGFOOD combines a procedural 3D presentation layer with an ACID-compliant scoring pipeline. The headline and above-the-fold telemetry are server-rendered for instantaneous sub-second LCP. Every 3D shader and particle field respects reduced-motion preferences, caps device pixel ratios at 2, and pauses automatically when off-screen."*
* **Action:** Toggle theme from Dark to Light via the ThemeToggle in the sticky header. Point out zero flash of unstyled content (SSR cookie persistence).

---

### Segment 2: Public Gallery, Search & Tilt Cards (0:30 – 1:30)

* **Visual:** Navigate to `/projects`. The gallery loads immediately with server-rendered cards.
* **Audio / Voiceover:**
  > *"Our public gallery is designed for speed and progressive enhancement. All project titles—like 'Glass Signal', 'Small Meadow', and 'Deep Compass'—are pre-rendered into the initial server HTML, making it fully indexable with JavaScript disabled. 
  > 
  > When JavaScript is enabled, the interface upgrades with interactive 3D pointer tilt, monogram avatars derived deterministically from team IDs, and URL-synced filter chips. Let's filter by the Autonomous Agents track and type a search query. Notice the debounced 200-millisecond URL synchronization, live aria-polite result counter, and numbered accessible pagination."*
* **Action:**
  1. Hover over a project card demonstrating the subtle 3D perspective tilt.
  2. Click track filter chips (`Autonomous Agents`).
  3. Type `Signal` into the search box; show immediate URL update to `?q=Signal`.
  4. Click into `Glass Signal` (`/projects/prj_01`).
  5. Show the animated radial score meter, privacy-safe member initials, and desktop sticky side panel with the Web Share API.

---

### Segment 3: Judge Scoring Surface & Autosave (1:30 – 2:30)

* **Visual:** Log in as Judge A (`tomas.varga@dogfood.local`). Dashboard loads `/dashboard/judge`.
* **Audio / Voiceover:**
  > *"Now let's switch to the scoring surface. Speed and clarity win here—no heavy 3D or visual noise. On the left is the evaluation queue with an interactive progress ring and estimated time remaining. On the right, a live preview of the selected candidate project.
  >
  > Let's open 'Deep Compass' to score it. Here we have a dedicated split view: project repository and summary on the left, rubric controls on the right. We replaced clunky sliders with tactile segmented 0-to-10 buttons with full keyboard support: pressing 8 on the number keys immediately sets functionality, and pressing 9 sets quality.
  >
  > Notice the live weighted total, character counter, and non-blocking guard rail alert if a judge inputs uniform scores across all entries. Even if the browser is accidentally closed, sessionStorage automatically restores in-progress draft comments every 3 seconds."*
* **Action:**
  1. Use number keys to change scores.
  2. Type a comment in the feedback box, showing character counter (`142 / 2000`).
  3. Hit Enter/Click 'Submit & Next'.
  4. Show the optimistic toast notification and immediate auto-advance to the next pending project.

---

### Segment 4: Organizer Cockpit, Heatmap & CSV Export (2:30 – 3:30)

* **Visual:** Log in as Organizer (`master@dogfood.local`). Dashboard loads `/dashboard/organizer`.
* **Audio / Voiceover:**
  > *"Here is the Organizer Telemetry Cockpit. At the top, KPI cards with lightweight SVG sparklines display submission counts, active judges, and real-time coverage. Notice the live ticker: SWR polls the backend every 5 seconds to provide visibility into judging progress without full-page reloads.
  >
  > Below the KPIs is the Coverage Heatmap matrix. This displays judges against projects using accessible pattern fills alongside color coding. Any submission with zero reviews is highlighted with a critical badge, and single reviews are flagged for peer verification.
  >
  > Below the heatmap, our data table supports column visibility toggles, multi-column sorting, and keyboard navigation with the up and down arrow keys. Finally, one click on 'Export CSV' streams an export of the results ledger."*
* **Action:**
  1. Highlight the live `Updated Xs ago` ticker.
  2. Hover over matrix cells displaying individual score tooltips.
  3. Toggle column visibility in the data table menu.
  4. Click `Export CSV` and show the downloaded `export.csv` file.

---

### Segment 5: Role Isolation & Security Audit Proof (3:30 – 4:30)

* **Visual:** Terminal split screen showing acceptance test suite execution alongside HTTP response verification.
* **Audio / Voiceover:**
  > *"Underpinning this user experience is defense-in-depth security. Let's demonstrate server-side role isolation. Judge A can only read and mutate their own score records; the backend transaction prevents concurrent double-submissions and strictly isolates peer reviews.
  >
  > When a participant attempts to access scoring or administrative endpoints, the server returns an immediate 403 Forbidden.
  >
  > Let's verify our Phase 0 acceptance suite against the running Docker stack. We execute `python run.py .dogfood.toml`. All 7 core verification checks pass: public gallery access, fixture visibility, submission deadlines, judge score privacy, participant isolation, and CSV export integrity."*
* **Action:**
  1. Run `python run.py .dogfood.toml`.
  2. Highlight the 7 green `PASS` checks in stdout:
     - `T1 gallery is public ................. PASS`
     - `T1 project from fixtures shown ....... PASS`
     - `T1 closed event refuses submissions .. PASS`
     - `T2 judge sees own scores ............. PASS`
     - `T2 judge cannot see peer scores ...... PASS`
     - `T2 participant blocked ............... PASS`
     - `T2 csv export works .................. PASS`

---

### Segment 6: Closing & Architecture Summary (4:30 – 5:00)

* **Visual:** Return to the home landing page showing the brand footer and legal links.
* **Audio / Voiceover:**
  > *"DOGFOOD 2026 demonstrates that modern hackathon portals do not need to compromise between visual sophistication, accessibility, and strict backend reliability. With Next.js 14 App Router, PostgreSQL with Prisma transactions, WCAG 2.1 AA compliant primitives, and offline-first font assets, DOGFOOD is ready for production hackathons of any scale. Thank you."*
* **Action:** Fade to brand splash screen with repository URL.
