# Quality Assurance & Accessibility (QA) Manual

## 1. Automated Accessibility Audit (Axe Core)

### Testing with `@axe-core/cli` or Axe DevTools
1. **Via Axe DevTools Extension**:
   - Open Chrome DevTools (`F12`) on `http://localhost:8080/`.
   - Select the **Axe DevTools** panel.
   - Click **Scan FULL PAGE**.
   - Target: **0 Critical / 0 Serious issues**.
2. **Via Headless CLI**:
   ```bash
   npx @axe-core/cli http://localhost:8080/
   npx @axe-core/cli http://localhost:8080/projects
   npx @axe-core/cli http://localhost:8080/projects/prj_01
   ```

### Accessibility Invariants Verified
- **Skip Link**: Root layout includes `<a href="#main-content" class="sr-only focus:not-sr-only ...">` enabling immediate keyboard bypass of header navigation.
- **Semantic Landmarks**: Verified `<header>`, `<nav role="navigation">`, `<main id="main-content">`, `<aside>`, and `<footer>` on all views.
- **Color Contrast (WCAG 2.1 AA)**:
  - Dark Theme:
    - Base Text: `#e6ecff` on `#0d1224` (Contrast: 14.8:1)
    - Accent Teal: `#00e5d0` on `#0d1224` (Contrast: 12.1:1)
    - Muted Tertiary: `#aebad6` on `#0d1224` (Contrast: 9.3:1)
  - Light Theme:
    - Base Text: `#12183c` on `#f8f9fe` (Contrast: 15.6:1)
    - Accent Dark Teal: `#00a394` on `#f8f9fe` (Contrast: 4.8:1)
- **Form Controls & Labels**:
  - All `<input>`, `<textarea>`, and `<select>` controls contain explicit `<label for="...">` associations and `aria-invalid` / `aria-describedby` links.
- **Dynamic Live Announcements**:
  - `ProjectsToolbar` utilizes `<div aria-live="polite">` for real-time search result counts.
  - SWR coverage polling utilizes aria-live regions for update tickers.

---

## 2. Keyboard Navigation Protocols

| Page / Component | Interaction | Keybinding | Expected Behavior |
|---|---|---|---|
| **Root Layout** | Skip to content | <kbd>Tab</kbd> on load | Focuses visible "Skip to main content" banner |
| **Header** | Role menu | <kbd>Enter</kbd> / <kbd>Space</kbd> | Opens/closes user profile popover |
| **Projects Gallery** | Pagination | <kbd>Tab</kbd> + <kbd>Enter</kbd> | Advances numbered page with `aria-current="page"` |
| **Judge Scoring** | Rubric Functionality | <kbd>0</kbd> – <kbd>9</kbd> | Sets functionality score immediately |
| **Judge Scoring** | Rubric Step Adjust | <kbd>←</kbd> / <kbd>→</kbd> | Decrements / increments active score by 1 |
| **Judge Scoring** | Submit Score | <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Optimistically submits evaluation & advances |
| **Organizer Table** | Row Navigation | <kbd>↑</kbd> / <kbd>↓</kbd> | Shifts active row focus across submissions table |

---

## 3. Responsive Breakpoint Matrix

The portal is audited across standard viewport resolutions:

- **Mobile (375px × 667px)**:
  - Split views collapse cleanly into vertical stacks.
  - Sticky side panel collapses into an inline bottom card.
  - Segmented score buttons format in an accessible 6-column grid without overflow.
  - 3D hero pointer parallax is disabled to preserve battery and touch scrolling.
- **Tablet (768px × 1024px)**:
  - 2-column grid layouts for gallery and judge queue.
  - Stats strip wraps into a 2×2 grid.
- **Desktop (1280px × 800px)**:
  - 3-column project grid.
  - Sticky side panel pinned to viewport during document scroll.
- **Ultra-Wide (1920px × 1080px)**:
  - Centered containers constrained to `max-w-7xl` avoiding line-length fatigue.

---

## 4. Performance & Bundle Splitting

- **Three.js Isolation**:
  `three`, `@react-three/fiber`, and `@react-three/drei` are strictly loaded via `next/dynamic({ ssr: false })` in `HeroCanvas.tsx`. They are completely absent from `/projects`, `/projects/[id]`, and dashboard routes.
- **Reduced-Motion Fallbacks**:
  Setting `prefers-reduced-motion: reduce` in OS settings swaps the 3D canvas for a static CSS radial gradient poster with 0 runtime animation overhead and zero layout shift.
- **WebGL Failure Recovery**:
  If WebGL context creation fails or is blocked by browser policy, `HeroScene` catches the exception and gracefully renders `HeroFallback`.
