import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-bg-0 text-text-secondary transition-colors">
      <Container size="xl" className="py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-sm font-bold tracking-wider text-text-primary mb-3"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-accent text-bg-0 font-mono font-black text-xs">
                DF
              </div>
              <span>DOGFOOD 2026</span>
            </Link>
            <p className="text-xs text-text-tertiary leading-relaxed mb-4">
              Autonomous hackathon evaluation and project showcase platform. Built with real-time scoring, secure role isolation, and structured results export.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-text-tertiary">
              <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>System operational</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/projects" className="hover:text-text-primary transition-colors">
                  Project Gallery
                </Link>
              </li>
              <li>
                <Link href="/projects#tracks" className="hover:text-text-primary transition-colors">
                  Tracks &amp; Categories
                </Link>
              </li>
              <li>
                <a href="/#judging" className="hover:text-text-primary transition-colors">
                  Judging Rubric
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-text-primary transition-colors">
                  Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Participate links — replaces dead /#schedule/#rules/#faq anchors */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
              Participate
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/signup" className="hover:text-text-primary transition-colors">
                  Register a Team
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-text-primary transition-colors">
                  Browse Submissions
                </Link>
              </li>
              <li>
                <a href="/#judging" className="hover:text-text-primary transition-colors">
                  Evaluation Criteria
                </a>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-text-primary transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
              Legal &amp; Privacy
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/legal/terms" className="hover:text-text-primary transition-colors">
                  Terms of Participation
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-text-primary transition-colors">
                  Privacy Disclosure
                </Link>
              </li>
              <li>
                <Link href="/legal/conduct" className="hover:text-text-primary transition-colors">
                  Code of Conduct
                </Link>
              </li>
              <li>
                <Link href="/legal/security" className="hover:text-text-primary transition-colors">
                  Security Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          <p>© 2026 DOGFOOD Hackathon Platform. All submissions evaluated by assigned judges.</p>
          <p className="font-mono text-[11px]">v1.0.0 · Next.js 14 · PostgreSQL</p>
        </div>
      </Container>
    </footer>
  );
}
