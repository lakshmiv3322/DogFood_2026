import Link from "next/link";
import { prisma, getSessionUser } from "@/lib/db";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ArrowRight, Trophy, Users, ShieldCheck, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [event, projectCount, trackCount, user] = await Promise.all([
    prisma.event.findFirst(),
    prisma.project.count(),
    prisma.track.count(),
    getSessionUser(),
  ]);

  const isOpen = event ? new Date() < event.submissionsClose : false;

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header user={user} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border py-20 sm:py-28">
          <Container size="xl">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant={isOpen ? "accent" : "danger"}>
                  {isOpen ? "Submissions Open" : "Submissions Closed"}
                </Badge>
                <span className="font-mono text-xs text-text-tertiary">
                  {event?.name ?? "DOGFOOD Hackathon 2026"}
                </span>
              </div>

              <h1 className="font-display text-5xl sm:text-7xl font-black uppercase tracking-tight text-text-primary leading-none mb-6">
                Autonomous
                <br />
                Hackathon
                <br />
                <span className="text-accent">Portal.</span>
              </h1>

              <p className="font-mono text-sm text-text-secondary leading-relaxed mb-8 max-w-xl">
                The centralized evaluation portal for {event?.name ?? "Sample Hack 2026"}. Submit engineering projects, coordinate distributed judges, record real-time scores, and certify final rankings.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/projects">
                  <Button size="lg" variant="primary" className="gap-2">
                    <span>Browse Gallery</span>
                    <ArrowRight size={16} aria-hidden />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="secondary">
                    Portal Login
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Stats Row */}
        <section className="border-b border-border bg-surface">
          <Container size="xl" className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Submitted Projects", value: projectCount, icon: <Trophy size={18} className="text-accent" /> },
                { label: "Competitive Tracks", value: trackCount, icon: <Users size={18} className="text-accent" /> },
                {
                  label: "Portal Status",
                  value: isOpen ? "Live / Open" : "Locked",
                  color: isOpen ? "text-accent" : "text-danger",
                  icon: <ShieldCheck size={18} className={isOpen ? "text-accent" : "text-danger"} />,
                },
                {
                  label: "Submission Window",
                  value: event
                    ? new Date(event.submissionsClose).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—",
                  icon: <CheckCircle2 size={18} className="text-accent" />,
                },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="font-mono text-xs uppercase tracking-wider text-text-tertiary">
                      {stat.label}
                    </span>
                  </div>
                  <span className={`font-display text-2xl sm:text-3xl font-bold ${stat.color ?? "text-text-primary"}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Role Cards */}
        <section className="py-16 sm:py-24">
          <Container size="xl">
            <div className="mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-text-primary mb-2">
                Participant &amp; Evaluator Workflows
              </h2>
              <p className="font-mono text-xs text-text-tertiary">
                Dedicated interfaces with cryptographic role separation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card hover>
                <CardHeader>
                  <Badge variant="default" className="w-fit mb-2">
                    Participant
                  </Badge>
                  <CardTitle>Team Submissions</CardTitle>
                  <CardDescription>
                    Explore all public projects, register repository URLs and track tags before the certified deadline.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/projects" className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1">
                    <span>Explore Gallery</span>
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </CardContent>
              </Card>

              <Card hover>
                <CardHeader>
                  <Badge variant="accent" className="w-fit mb-2">
                    Judge
                  </Badge>
                  <CardTitle>Score Rubrics</CardTitle>
                  <CardDescription>
                    Blind evaluation interface with optimistic updates, transactional upserts, and progress tracking.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/login" className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1">
                    <span>Judge Login</span>
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </CardContent>
              </Card>

              <Card hover>
                <CardHeader>
                  <Badge variant="danger" className="w-fit mb-2">
                    Organizer
                  </Badge>
                  <CardTitle>Event Administration</CardTitle>
                  <CardDescription>
                    Real-time SWR coverage telemetry, audit logs, and certified CSV export of hackathon rankings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/login" className="font-mono text-xs text-danger hover:underline inline-flex items-center gap-1">
                    <span>Organizer Console</span>
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* Judging Details Section anchor */}
        <section id="judging" className="border-t border-border bg-surface py-16">
          <Container size="md">
            <h2 className="font-display text-2xl font-black uppercase text-text-primary tracking-tight mb-4">
              How Judging Works
            </h2>
            <div className="space-y-4 text-xs font-mono text-text-secondary leading-relaxed">
              <p>
                Each submitted project is assigned to certified judges based on track expertise. Evaluations are scored across two primary quantitative axes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-text-tertiary">
                <li><strong className="text-text-primary">Functionality (0 - 10)</strong>: Operational stability, feature completeness, and technical execution.</li>
                <li><strong className="text-text-primary">Code Quality &amp; Architecture (0 - 10)</strong>: Code structure, maintainability, documentation, and engineering design.</li>
              </ul>
              <p>
                Judges cannot view scores submitted by peers during the active judging phase. All scores are upserted transactionally with immediate optimistic UI feedback and automatic rollback protection.
              </p>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
