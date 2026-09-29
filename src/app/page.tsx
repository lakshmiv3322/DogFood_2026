import Link from "next/link";
import { prisma, getSessionUser } from "@/lib/db";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { JudgingSteps } from "@/components/home/JudgingSteps";
import { OrganizerMock } from "@/components/home/OrganizerMock";
import {
  ArrowRight,
  Trophy,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  BarChart3,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    event,
    projectCount,
    judgeCount,
    trackCount,
    scoreCount,
    allProjects,
    user,
  ] = await Promise.all([
    prisma.event.findFirst(),
    prisma.project.count(),
    prisma.user.count({ where: { role: "JUDGE" } }),
    prisma.track.count(),
    prisma.score.count(),
    prisma.project.findMany({
      include: {
        team: true,
        track: true,
        scores: true,
      },
    }),
    getSessionUser(),
  ]);

  const isOpen = event ? new Date() < event.submissionsClose : false;

  // Rank projects by average score, pick top 6
  const featuredProjects = allProjects
    .map((p) => {
      const avgScore =
        p.scores.length > 0
          ? (
              p.scores.reduce(
                (sum, s) => sum + (s.functionality + s.quality) / 2,
                0
              ) / p.scores.length
            ).toFixed(1)
          : null;
      return { ...p, avgScore };
    })
    .sort((a, b) => (b.avgScore ? Number(b.avgScore) : 0) - (a.avgScore ? Number(a.avgScore) : 0))
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header user={user} />

      <main className="flex-1">
        {/* ── ABOVE THE FOLD: 3D HERO ── */}
        <section className="relative min-h-[640px] sm:min-h-[720px] flex flex-col justify-between overflow-hidden border-b border-border">
          {/* Lazy loaded 3D Hero Scene with CSS gradient poster fallback */}
          <HeroCanvas />

          {/* Above-the-fold content: Server rendered text for immediate LCP */}
          <div className="relative z-20 pt-20 sm:pt-28 pb-12">
            <Container size="xl">
              <div className="max-w-3xl">
                {/* Event status pill */}
                <div className="flex items-center gap-3 mb-6">
                  <Badge variant={isOpen ? "accent" : "danger"} size="sm">
                    {isOpen ? "Submissions Open" : "Submissions Closed"}
                  </Badge>
                  <span className="font-mono text-xs text-text-secondary">
                    {event?.name ?? "DOGFOOD Hackathon 2026"}
                  </span>
                </div>

                {/* Primary headline: Display font, tight tracking */}
                <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-text-primary leading-[0.95] mb-6">
                  Engineered
                  <br />
                  To Evaluate
                  <br />
                  <span className="text-accent">At Scale.</span>
                </h1>

                {/* One-line subhead */}
                <p className="font-mono text-sm sm:text-base text-text-secondary leading-relaxed mb-8 max-w-xl">
                  Autonomous hackathon evaluation engine with transactional blind judging, live coverage telemetry, and certified results.
                </p>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/projects">
                    <Button size="lg" variant="primary" className="gap-2">
                      <span>Browse projects</span>
                      <ArrowRight size={16} aria-hidden />
                    </Button>
                  </Link>
                  <a href="#judging">
                    <Button size="lg" variant="secondary">
                      How judging works
                    </Button>
                  </a>
                </div>
              </div>
            </Container>
          </div>

          {/* Live Stat Strip: Real counts from Prisma */}
          <div className="relative z-20 border-t border-border/80 bg-surface/80 backdrop-blur-md">
            <Container size="xl" className="py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    label: "Submissions",
                    value: projectCount,
                    icon: <Trophy size={16} className="text-accent" />,
                  },
                  {
                    label: "Certified Judges",
                    value: judgeCount,
                    icon: <Users size={16} className="text-accent" />,
                  },
                  {
                    label: "Competitive Tracks",
                    value: trackCount,
                    icon: <Sliders size={16} className="text-accent" />,
                  },
                  {
                    label: "Reviews Completed",
                    value: scoreCount,
                    icon: <CheckCircle2 size={16} className="text-success" />,
                  },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {stat.icon}
                      <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
                        {stat.label}
                      </span>
                    </div>
                    <span className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </section>

        {/* ── BELOW THE FOLD SECTION 1: FEATURED PROJECTS ── */}
        <section className="py-20 border-b border-border">
          <Container size="xl">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-accent" />
                    <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                      Leaderboard Preview
                    </span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-text-primary">
                    Featured Projects
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="font-mono text-xs text-text-secondary hover:text-accent inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>View all {projectCount} projects</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                  <Card key={project.id} hover className="flex flex-col justify-between">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge variant="accent" size="sm">
                          {project.track.name}
                        </Badge>
                        {project.avgScore ? (
                          <span className="font-mono text-xs font-bold text-accent">
                            ★ {project.avgScore} / 10
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-text-tertiary">
                            Under Review
                          </span>
                        )}
                      </div>
                      <CardTitle className="mt-2 text-base group-hover:text-accent transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-3">
                      <span className="font-mono text-[11px] text-text-tertiary">
                        {project.team.name}
                      </span>
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight size={12} />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollReveal>
          </Container>
        </section>

        {/* ── BELOW THE FOLD SECTION 2: HOW JUDGING WORKS ── */}
        <section id="judging" className="py-20 border-b border-border bg-surface/50">
          <Container size="xl">
            <ScrollReveal>
              <div className="max-w-2xl mb-12">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold mb-2 block">
                  Autonomous Protocol
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-text-primary mb-4">
                  How Judging Works
                </h2>
                <p className="font-mono text-xs text-text-secondary leading-relaxed">
                  Rigorous evaluation integrity enforced through cryptographic role isolation, blind peer reviews, and atomic score transactions.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <JudgingSteps />
            </ScrollReveal>
          </Container>
        </section>

        {/* ── BELOW THE FOLD SECTION 3: FOR ORGANIZERS ── */}
        <section className="py-20 border-b border-border">
          <Container size="xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-danger font-semibold mb-2 block">
                      Admin Telemetry
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-text-primary leading-tight">
                      Built For High-Stakes
                      <br />
                      Hackathon Organizers.
                    </h2>
                  </div>

                  <p className="font-mono text-xs text-text-secondary leading-relaxed">
                    Say goodbye to messy spreadsheets and scoring conflicts. The DOGFOOD 2026 organizer cockpit tracks real-time progress across all judging pools with sub-second synchronization.
                  </p>

                  <div className="space-y-3 font-mono text-xs text-text-secondary">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                      <span>Live SWR coverage monitoring with auto-refresh every 5s.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                      <span>Blind score isolation: judges cannot inspect peer evaluations until publish.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                      <span>Instant one-click certified CSV export for final awards calculation.</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/login">
                      <Button variant="secondary" size="md" className="gap-2">
                        <span>Organizer Console</span>
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <OrganizerMock />
              </ScrollReveal>
            </div>
          </Container>
        </section>

        {/* ── BELOW THE FOLD SECTION 4: FINAL CTA BAND ── */}
        <section className="py-20 bg-gradient-to-b from-surface to-bg-0">
          <Container size="xl">
            <ScrollReveal>
              <div className="rounded-2xl border border-accent/30 bg-surface/80 p-8 sm:p-14 text-center relative overflow-hidden shadow-glow">
                <div className="max-w-2xl mx-auto relative z-10 space-y-6">
                  <Badge variant="accent" size="md">
                    DOGFOOD 2026
                  </Badge>
                  <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-text-primary leading-tight">
                    Ready to Evaluate or
                    <br />
                    Showcase Your Project?
                  </h2>
                  <p className="font-mono text-xs sm:text-sm text-text-secondary leading-relaxed">
                    Browse all hackathon submissions across developer tooling, AI infrastructure, and decentralized systems.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <Link href="/projects">
                      <Button size="lg" variant="primary" className="gap-2">
                        <span>Browse all projects</span>
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button size="lg" variant="secondary">
                        Judge &amp; Team Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
