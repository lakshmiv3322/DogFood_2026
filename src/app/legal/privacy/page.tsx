import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header />
      <main className="flex-1 py-12">
        <Container size="md">
          <Link href="/" className="font-mono text-xs text-text-tertiary hover:text-accent mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-display text-3xl font-black uppercase text-text-primary tracking-tight mb-4">
            Privacy Disclosure & Data Policy
          </h1>
          <div className="space-y-6 text-sm text-text-secondary leading-relaxed border-t border-border pt-6">
            <p>
              The DOGFOOD 2026 platform handles participant data with transparency and strict role-based access controls.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">1. Public Disclosure</h2>
            <p>
              Participant emails associated with team rosters and public repository links submitted with projects are visible to other participants, judges, and event administrators for the duration of the hackathon.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">2. Role Isolation & Scoring Privacy</h2>
            <p>
              Individual scores and evaluation feedback submitted by judges remain strictly confidential between the assigning judge and event organizers until the official conclusion and certified CSV export of event results.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">3. Data Retention</h2>
            <p>
              Session tokens and audit log records are preserved for auditing and score verification purposes. No participant telemetry is sold or distributed to third parties.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
