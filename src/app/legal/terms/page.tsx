import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header />
      <main className="flex-1 py-12">
        <Container size="md">
          <Link href="/" className="font-mono text-xs text-text-tertiary hover:text-accent mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-display text-3xl font-black uppercase text-text-primary tracking-tight mb-4">
            Terms of Participation
          </h1>
          <div className="space-y-6 text-sm text-text-secondary leading-relaxed border-t border-border pt-6">
            <p>
              By registering for and submitting projects to DOGFOOD 2026, teams agree to submit original work created during the designated hackathon window.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">1. Intellectual Property</h2>
            <p>
              Participants retain 100% ownership of the code, designs, and assets developed during the event. Open-source libraries and public frameworks may be utilized provided they are attributed.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">2. Submission Deadlines</h2>
            <p>
              All project repositories, summaries, and track assignments must be finalized prior to the published submission deadline. Late submissions are strictly locked by the automated evaluation pipeline.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">3. Evaluation Integrity</h2>
            <p>
              Scores submitted by designated judges are final once certified by the event organizers. Any attempt to tamper with evaluation endpoints or peer submissions will result in immediate disqualification.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
