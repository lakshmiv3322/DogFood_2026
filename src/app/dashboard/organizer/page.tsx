import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OrganizerDashboard() {
  const user = await getSessionUser();
  if (!user || user.role !== "ORGANIZER") redirect("/login");

  const [projectCount, judgeCount, scoreCount, teamCount, event, recentScores] =
    await Promise.all([
      prisma.project.count(),
      prisma.user.count({ where: { role: "JUDGE" } }),
      prisma.score.count(),
      prisma.team.count(),
      prisma.event.findFirst(),
      prisma.score.findMany({
        take: 10,
        orderBy: { updatedAt: "desc" },
        include: {
          judge: { select: { name: true } },
          project: { select: { title: true } },
        },
      }),
    ]);

  const coverage =
    projectCount > 0
      ? Math.round((scoreCount / projectCount) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[#1b2540] bg-[#0a0f1e]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase hover:text-[#e6ecff] transition-colors">DOGFOOD</Link>
            <span className="w-px h-4 bg-[#1b2540]" />
            <span className="font-mono text-xs tracking-widest text-[#ff3d6e] uppercase">Organizer</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/api/export.csv"
              className="font-mono text-xs tracking-widest border border-[#00e5d0] text-[#00e5d0] px-3 py-1.5 hover:bg-[#00e5d0] hover:text-[#0a0f1e] transition-colors uppercase"
            >
              Export CSV
            </a>
            <span className="font-mono text-xs text-[#6b7a9e]">{user.name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-widest text-[#ff3d6e] uppercase mb-2">[ Organizer Dashboard ]</p>
          <h1 className="font-black text-3xl uppercase tracking-tight text-[#e6ecff]">
            {event?.name ?? "Sample Hack 2026"}
          </h1>
          {event && (
            <p className="font-mono text-xs text-[#6b7a9e] mt-2">
              Submissions {new Date() > event.submissionsClose ? "closed" : "open until"}{" "}
              {new Date(event.submissionsClose).toLocaleString()}
            </p>
          )}
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1b2540] mb-8">
          {[
            { label: "Projects", value: projectCount, color: "#e6ecff" },
            { label: "Teams", value: teamCount, color: "#e6ecff" },
            { label: "Judges", value: judgeCount, color: "#00e5d0" },
            { label: "Scores", value: scoreCount, color: "#00e5d0" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[#0e1428] px-6 py-5">
              <p className="font-mono text-xs text-[#6b7a9e] tracking-widest uppercase mb-1">{kpi.label}</p>
              <p className="font-black text-3xl" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Coverage bar */}
        <div className="border border-[#1b2540] bg-[#0e1428] p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase">Judging Coverage</p>
            <p className="font-mono text-xs text-[#e6ecff]">{scoreCount} / {projectCount} projects reviewed</p>
          </div>
          <div className="h-2 bg-[#1b2540] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00e5d0] transition-all duration-500"
              style={{ width: `${coverage}%` }}
            />
          </div>
          <p className="font-mono text-xs text-[#6b7a9e] mt-2">{coverage}% coverage</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick actions */}
          <div>
            <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase mb-3">[ Actions ]</p>
            <div className="flex flex-col gap-px bg-[#1b2540]">
              {[
                { label: "Browse all projects", href: "/projects", color: "#aebad6" },
                { label: "Export scores as CSV", href: "/api/export.csv", color: "#00e5d0" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="bg-[#0e1428] px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#121a32] transition-colors group"
                >
                  <span className="font-mono text-sm" style={{ color: action.color }}>{action.label}</span>
                  <span className="font-mono text-xs text-[#3a4a70] group-hover:text-[#ff3d6e] transition-colors">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase mb-3">[ Recent Scores ]</p>
            {recentScores.length === 0 ? (
              <div className="border border-[#1b2540] bg-[#0e1428] p-8 text-center">
                <p className="font-mono text-xs text-[#6b7a9e]">No scores yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-px bg-[#1b2540]">
                {recentScores.map((s) => (
                  <div key={s.id} className="bg-[#0e1428] px-5 py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-[#e6ecff] truncate">{s.project.title}</p>
                      <p className="font-mono text-xs text-[#6b7a9e]">by {s.judge.name}</p>
                    </div>
                    <span className="font-black text-lg text-[#00e5d0] shrink-0">
                      {((s.functionality + s.quality) / 2).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
