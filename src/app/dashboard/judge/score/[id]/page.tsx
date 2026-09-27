import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSessionUser, prisma } from "@/lib/db";
import ScoreForm from "./ScoreForm";

export const dynamic = "force-dynamic";

export default async function ScoreProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "JUDGE") redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      team: true,
      track: true,
      scores: {
        where: { judgeId: user.id },
      },
    },
  });

  if (!project) notFound();

  const existingScore = project.scores[0] || null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[#1b2540] bg-[#0a0f1e]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase hover:text-[#e6ecff] transition-colors"
            >
              DOGFOOD
            </Link>
            <span className="w-px h-4 bg-[#1b2540]" />
            <Link
              href="/dashboard/judge"
              className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase hover:text-[#e6ecff] transition-colors"
            >
              Judge Dashboard
            </Link>
            <span className="w-px h-4 bg-[#1b2540]" />
            <span className="font-mono text-xs tracking-widest text-[#aebad6] uppercase truncate">
              Scoring {project.title}
            </span>
          </div>
          <span className="font-mono text-xs text-[#6b7a9e]">{user.name}</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-8">
          <Link
            href="/dashboard/judge"
            className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase hover:text-[#00e5d0] transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <div className="mt-4 flex flex-col gap-2">
            <span className="font-mono text-xs tracking-widest text-[#00e5d0] uppercase">
              {project.track.name} · {project.team.name}
            </span>
            <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#e6ecff]">
              {project.title}
            </h1>
            <p className="font-mono text-sm text-[#aebad6] leading-relaxed mt-2">
              {project.summary}
            </p>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-[#ff3d6e] hover:underline mt-1 w-fit"
              >
                View Repository ↗
              </a>
            )}
          </div>
        </div>

        <div className="border border-[#1b2540] bg-[#0e1428] p-6 sm:p-8">
          <p className="font-mono text-xs tracking-widest text-[#ff3d6e] uppercase mb-6">
            [ Rubric & Evaluation ]
          </p>
          <ScoreForm
            projectId={project.id}
            initialFunctionality={existingScore?.functionality ?? 3}
            initialQuality={existingScore?.quality ?? 3}
            initialComment={existingScore?.comment ?? ""}
          />
        </div>
      </main>
    </div>
  );
}
