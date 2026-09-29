import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Eye } from "lucide-react";

export const metadata = {
  title: "Accessibility Statement — DOGFOOD 2026",
  description: "Accessibility commitment, keyboard navigation standards, and WCAG compliance.",
};

export default function AccessibilityStatementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header />
      <main className="flex-1 py-12">
        <Container size="md">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary hover:text-accent mb-6"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <Eye size={20} className="text-accent" />
            <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
              WCAG 2.1 AA Compliance
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-text-primary tracking-tight mb-6">
            Accessibility Statement
          </h1>

          <div className="space-y-6 text-xs sm:text-sm font-mono text-text-secondary leading-relaxed border-t border-border pt-6">
            <p>
              DOGFOOD 2026 is committed to ensuring digital accessibility for people with disabilities. We continually refine the user experience to meet or exceed WCAG 2.1 AA accessibility standards.
            </p>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                1. Assistive Technologies &amp; Keyboard Access
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-text-tertiary">
                <li><strong className="text-text-primary">Skip to Content</strong>: A dedicated skip link is rendered at the root layout for keyboard and screen reader users.</li>
                <li><strong className="text-text-primary">Full Keyboard Navigation</strong>: All filters, score buttons (0–10), and modal dialogs are fully navigable using Tab, Arrow keys, and Enter.</li>
                <li><strong className="text-text-primary">Visible Focus Indicators</strong>: High-contrast focus rings (`focus-visible:ring-accent`) are provided on all interactive controls.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                2. Color Contrast &amp; Theming
              </h2>
              <p>
                Both dark and light themes are tested for a minimum color contrast ratio of 4.5:1 for body text and 3:1 for large display elements. Status indicators do not rely on color alone; text labels, patterns, and icons accompany all warnings and states.
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                3. Reduced Motion
              </h2>
              <p>
                All 3D procedural scenes, route transitions, and CSS animations automatically detect and honor the user's `prefers-reduced-motion: reduce` preference by rendering static gradient fallbacks without layout shifts.
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                4. Dynamic Content Announcements
              </h2>
              <p>
                Search results, telemetry updates, and score submission statuses utilize `aria-live` regions (`polite`) to ensure screen readers announce updates promptly without disrupting user workflow.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
