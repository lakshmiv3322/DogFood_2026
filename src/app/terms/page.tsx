import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service — DOGFOOD 2026",
  description: "Terms of service and competition rules.",
};

export default function TermsOfServicePage() {
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
            <FileText size={20} className="text-accent" />
            <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
              Event Agreement
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-text-primary tracking-tight mb-6">
            Terms of Service
          </h1>

          <div className="space-y-6 text-xs sm:text-sm font-mono text-text-secondary leading-relaxed border-t border-border pt-6">
            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing the DOGFOOD 2026 hackathon portal, submitting projects, or entering evaluation scores, you agree to comply with these terms, the event schedule, and all submission deadlines.
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                2. Submissions &amp; Code Ownership
              </h2>
              <p>
                Teams maintain full ownership and intellectual property rights to the source code, repositories, and documentation submitted. Submissions must represent genuine engineering work developed during the hackathon window.
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                3. Automated Locking
              </h2>
              <p>
                Once the competition deadline closes, the portal enforces strict immutable locks on project registration. Late submissions will be rejected automatically by backend constraints.
              </p>
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-text-primary mb-2">
                4. Evaluation Finality
              </h2>
              <p>
                Scores submitted by designated judges are certified by organizers and exported as the official consensus ledger. Any unauthorized interference with scoring endpoints constitutes grounds for immediate disqualification.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
