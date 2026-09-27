import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser, prisma } from "@/lib/db";

export default async function JudgeDashboard() {
  const user = await getSessionUser();
  if (!user || user.role !== "JUDGE") redirect("/login");

  const [myScores, assignedTracks] = await Promise.all([
    prisma.score.findMany({
      where: { judgeId: user.id },
      include: {
        project: {
          include: {
            track: { select: { name: true } },
            team: { select: { name: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.judgeTrack.findMany({
      where: { judgeId: user.id },
      include: { track: true },
    }),
  ]);

  const trackIds = assignedTracks.map((jt) => jt.trackId);
  const unreviewed = await prisma.project.findMany({
    where: {
      trackId: { in: trackIds },
      scores: { none: { judgeId: user.id } },
    },
    include: {
      track: { select: { name: true } },
      team: { select: { name: true } },
    },
    orderBy: { submittedAt: "desc" },
    take: 20,
  });

  const avgScore =
    myScores.length > 0
      ? (
          myScores.reduce(
            (sum, s) => sum + (s.functionality + s.quality) / 2,
            0
          ) / myScores.length
        ).toFixed(2)
      : "—";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[#1b2540] bg-[#0a0f1e]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase hover:text-[#e6ecff] transition-colors">DOGFOOD</Link>
            <span className="w-px h-4 bg-[#1b2540]" />
            <span className="font-mono text-xs tracking-widest text-[#aebad6] uppercase">Judge</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#6b7a9e]">{user.name}</span>
            <form action="/api/auth/logout" method="post">
              <Link href="/api/auth/logout" className="font-mono text-xs text-[#3a4a70] hover:text-[#ff3d6e] transition-colors uppercase tracking-widest">Sign out</Link>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase mb-2">[ Judge Dashboard ]</p>
          <h1 className="font-black text-3xl uppercase tracking-tight text-[#e6ecff]">
            {user.name}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-[#1b2540] mb-8">
          {[
            { label: "Reviewed", value: myScores.length },
            { label: "Pending", value: unreviewed.length },
            { label: "Avg Score", value: avgScore },
          ].map((s) => (
            <div key={s.label} className="bg-[#0e1428] px-6 py-5">
              <p className="font-mono text-xs text-[#6b7a9e] tracking-widest uppercase mb-1">{s.label}</p>
              <p className="font-black text-3xl text-[#e6ecff]">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending reviews */}
          <div>
            <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase mb-3">
              [ Pending Reviews ]
            </p>
            {unreviewed.length === 0 ? (
              <div className="border border-[#1b2540] bg-[#0e1428] p-8 text-center">
                <p className="font-mono text-sm text-[#00e5d0]">All done! ✓</p>
              </div>
            ) : (
              <div className="flex flex-col gap-px bg-[#1b2540]">
                {unreviewed.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/judge/score/${p.id}`}
                    className="bg-[#0e1428] px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#121a32] transition-colors group"
                  >
                    <div>
                      <p className="font-mono text-xs text-[#00e5d0] uppercase mb-1">{p.track.name}</p>
                      <p className="font-mono text-sm text-[#e6ecff] group-hover:text-white">{p.title}</p>
                      <p className="font-mono text-xs text-[#6b7a9e] mt-0.5">{p.team.name}</p>
                    </div>
                    <span className="font-mono text-xs text-[#3a4a70] group-hover:text-[#ff3d6e] transition-colors shrink-0">Score →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Completed reviews */}
          <div>
            <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase mb-3">
              [ Completed Reviews ]
            </p>
            {myScores.length === 0 ? (
              <div className="border border-[#1b2540] bg-[#0e1428] p-8 text-center">
                <p className="font-mono text-xs text-[#6b7a9e]">No reviews yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-px bg-[#1b2540]">
                {myScores.map((s) => (
                  <div key={s.id} className="bg-[#0e1428] px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-[#00e5d0] uppercase mb-1">{s.project.track.name}</p>
                      <p className="font-mono text-sm text-[#e6ecff]">{s.project.title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-lg text-[#00e5d0]">
                        {((s.functionality + s.quality) / 2).toFixed(1)}
                      </p>
                      <p className="font-mono text-xs text-[#6b7a9e]">avg</p>
                    </div>
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
