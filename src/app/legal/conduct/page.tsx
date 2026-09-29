import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import Link from "next/link";

export default function ConductPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header />
      <main className="flex-1 py-12">
        <Container size="md">
          <Link href="/" className="font-mono text-xs text-text-tertiary hover:text-accent mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-display text-3xl font-black uppercase text-text-primary tracking-tight mb-4">
            Code of Conduct
          </h1>
          <div className="space-y-6 text-sm text-text-secondary leading-relaxed border-t border-border pt-6">
            <p>
              DOGFOOD 2026 is dedicated to providing a harassment-free and supportive collaborative environment for all developers, designers, judges, and mentors.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">1. Respectful Collaboration</h2>
            <p>
              Treat all attendees, judges, and organizers with dignity and professional courtesy regardless of background, gender identity, race, or technical experience level.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">2. Constructive Judging</h2>
            <p>
              Judges must provide constructive, actionable, and fair feedback across all assigned evaluation rubrics. Evaluations should highlight both technical innovations and architectural areas for improvement.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">3. Reporting Violations</h2>
            <p>
              Any form of harassment, discrimination, or malicious tampering with event systems will result in immediate disqualification and revocation of portal credentials by the organizing committee.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
