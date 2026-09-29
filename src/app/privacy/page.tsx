import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — DOGFOOD 2026",
  description: "Privacy policy and participant data handling disclosures.",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={20} className="text-accent" />
            <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
              Data Protection &amp; Telemetry
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-text-primary tracking-tight mb-6">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-xs sm:text-sm font-mono text-text-secondary leading-relaxed border-t border-border pt-6">
            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                1. Information We Collect
              </h2>
              <p>
                The DOGFOOD 2026 portal collects only information essential for evaluating hackathon projects:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-text-tertiary">
                <li><strong className="text-text-primary">User Accounts</strong>: Name, email address, password hash, and assigned role (Organizer, Judge, Participant).</li>
                <li><strong className="text-text-primary">Submissions</strong>: Project titles, summaries, team names, member email identifiers, and repository URLs.</li>
                <li><strong className="text-text-primary">Evaluation Data</strong>: Scores (0–10), qualitative review comments, and timestamps submitted by certified judges.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                2. Public vs Confidential Data
              </h2>
              <p>
                Project titles, summaries, team names, and repository URLs are publicly accessible via the gallery. Judge scoring breakdowns remain confidential and isolated during the active judging window, preventing peer bias. Member emails are masked to display local-part initials on public views.
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                3. Session Tokens &amp; Security
              </h2>
              <p>
                Authentication relies on secure, HttpOnly session cookies. Password hashes are generated with salted bcrypt algorithms (10 rounds). All login attempts are throttled by sliding-window rate limiters.
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                4. Data Export &amp; Retention
              </h2>
              <p>
                Organizers may export final project scores and review summaries via certified CSV format. No data is shared with or sold to third-party ad networks.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
