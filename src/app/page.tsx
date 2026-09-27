import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [event, projectCount, trackCount] = await Promise.all([
    prisma.event.findFirst(),
    prisma.project.count(),
    prisma.track.count(),
  ]);

  const isOpen = event ? new Date() < event.submissionsClose : false;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#1b2540] bg-[#0a0f1e]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase">
              DOGFOOD
            </span>
            <span className="w-px h-4 bg-[#1b2540]" />
            <span className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase">
              2026
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/projects"
              className="font-mono text-xs tracking-widest text-[#6b7a9e] hover:text-[#e6ecff] uppercase transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/login"
              className="font-mono text-xs tracking-widest bg-[#ff3d6e] text-[#0a0f1e] px-3 py-1.5 hover:bg-[#e6ecff] transition-colors uppercase"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#1b2540] px-4 sm:px-6 py-24 sm:py-36">
          {/* Grid bg */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(90deg,rgba(230,236,255,.04) 1px,transparent 1px),linear-gradient(0deg,rgba(230,236,255,.04) 1px,transparent 1px)",
              backgroundSize: "calc(100%/12) 120px",
            }}
          />

          <div className="relative max-w-7xl mx-auto">
            <p className="font-mono text-xs tracking-widest text-[#ff3d6e] uppercase mb-6">
              [ DOGFOOD 2026 · HACKATHON PORTAL ]
            </p>
            <h1 className="font-black text-5xl sm:text-7xl lg:text-8xl leading-none tracking-tight uppercase text-[#e6ecff] mb-6">
              Build.
              <br />
              Judge.
              <br />
              <span className="text-[#00e5d0]">Ship.</span>
            </h1>
            <p className="max-w-lg font-mono text-sm text-[#aebad6] leading-relaxed mb-10">
              The central portal for{" "}
              <span className="text-[#e6ecff]">{event?.name ?? "Sample Hack 2026"}</span>.
              Browse submissions, assign judges, score projects, and export
              results — all in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 bg-[#ff3d6e] text-[#0a0f1e] font-mono font-bold text-xs tracking-widest uppercase px-5 py-3 hover:bg-[#e6ecff] transition-colors"
              >
                Browse Gallery →
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-[#ff3d6e] text-[#ff3d6e] font-mono font-bold text-xs tracking-widest uppercase px-5 py-3 hover:bg-[#ff3d6e] hover:text-[#0a0f1e] transition-colors"
              >
                Sign In →
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-b border-[#1b2540] bg-[#0e1428]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1b2540]">
            {[
              { label: "Projects", value: projectCount },
              { label: "Tracks", value: trackCount },
              {
                label: "Status",
                value: isOpen ? "Open" : "Closed",
                accent: isOpen ? "#00e5d0" : "#ff3d6e",
              },
              {
                label: "Deadline",
                value: event
                  ? new Date(event.submissionsClose).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )
                  : "—",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#0e1428] px-6 py-5 flex flex-col gap-1"
              >
                <span className="font-mono text-xs text-[#6b7a9e] tracking-widest uppercase">
                  {stat.label}
                </span>
                <span
                  className="font-black text-2xl"
                  style={{ color: stat.accent ?? "#e6ecff" }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid sm:grid-cols-3 gap-px bg-[#1b2540]">
            {[
              {
                role: "Participant",
                desc: "Browse the gallery, submit your project before the deadline, and track your team's progress.",
                cta: "Browse Gallery",
                href: "/projects",
                color: "#aebad6",
              },
              {
                role: "Judge",
                desc: "Review assigned projects, submit scores across the rubric, and track your judging progress.",
                cta: "Judge Dashboard",
                href: "/login",
                color: "#00e5d0",
              },
              {
                role: "Organizer",
                desc: "Oversee all submissions, manage tracks, export scores as CSV, and publish final results.",
                cta: "Organizer Panel",
                href: "/login",
                color: "#ff3d6e",
              },
            ].map((card) => (
              <div
                key={card.role}
                className="bg-[#0e1428] p-8 flex flex-col gap-4"
              >
                <p
                  className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: card.color }}
                >
                  [ {card.role} ]
                </p>
                <p className="font-mono text-sm text-[#aebad6] leading-relaxed flex-1">
                  {card.desc}
                </p>
                <Link
                  href={card.href}
                  className="font-mono text-xs tracking-widest uppercase text-[#6b7a9e] hover:text-[#e6ecff] transition-colors"
                >
                  {card.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1b2540] px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-mono text-xs text-[#6b7a9e]">
            DOGFOOD 2026 · Hackathon Raptors
          </span>
          <span className="font-mono text-xs text-[#3a4a70]">
            {event?.name ?? "Sample Hack 2026"}
          </span>
        </div>
      </footer>
    </div>
  );
}
