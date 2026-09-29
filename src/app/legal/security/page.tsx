import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header />
      <main className="flex-1 py-12">
        <Container size="md">
          <Link href="/" className="font-mono text-xs text-text-tertiary hover:text-accent mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-display text-3xl font-black uppercase text-text-primary tracking-tight mb-4">
            Security Policy & Responsible Disclosure
          </h1>
          <div className="space-y-6 text-sm text-text-secondary leading-relaxed border-t border-border pt-6">
            <p>
              The DOGFOOD 2026 infrastructure employs defense-in-depth principles across authentication, session management, and scoring persistence.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">1. Authentication Security</h2>
            <p>
              Credentials are protected using adaptive bcrypt password hashing with salt rounds exceeding industry standards. All login endpoints are protected by automated sliding-window rate limiters.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">2. Request Sanitization & Schema Validation</h2>
            <p>
              Every API mutation is parsed through strict Zod schemas with URL protocol verification (blocking non-http/https schemes) and strict numeric boundaries to avoid payload corruption.
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary">3. Vulnerability Reporting</h2>
            <p>
              If you identify a security defect or potential exploit in this portal, please submit a detailed report to the lead organizer team immediately. We commit to prompt triage and remediation.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
