"use client";

import useSWR from "swr";

interface CoverageData {
  totalProjects: number;
  scoredProjects: number;
  scoresPerJudge: { judgeId: string; judgeName: string; count: number }[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function CoveragePanel() {
  const { data, error, isLoading } = useSWR<CoverageData>(
    "/api/organizer/coverage",
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  const coverage =
    data && data.totalProjects > 0
      ? Math.round((data.scoredProjects / data.totalProjects) * 100)
      : 0;

  if (error) {
    return (
      <div className="border border-[#ff3d6e] bg-[#0e1428] p-6 mb-8">
        <p className="font-mono text-xs text-[#ff3d6e]">
          ⚠ Failed to load coverage data — will retry automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#1b2540] bg-[#0e1428] p-6 mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase">
          Judging Coverage{" "}
          <span className="text-[#3a4a70] normal-case">
            (live · refreshes every 5s)
          </span>
        </p>
        <p className="font-mono text-xs text-[#e6ecff]">
          {isLoading ? "—" : data?.scoredProjects} /{" "}
          {isLoading ? "—" : data?.totalProjects} projects reviewed
        </p>
      </div>

      <div className="h-2 bg-[#1b2540] rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-[#00e5d0] transition-all duration-500"
          style={{ width: `${coverage}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs text-[#6b7a9e]">
          {isLoading ? "Loading…" : `${coverage}% coverage`}
        </p>
        {isLoading && (
          <span className="font-mono text-[10px] text-[#3a4a70] animate-pulse">
            ⟳ updating
          </span>
        )}
      </div>

      {/* Per-judge breakdown */}
      {data && data.scoresPerJudge.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-4">
          <p className="font-mono text-xs text-[#3a4a70] uppercase tracking-widest mb-2">
            Per judge
          </p>
          {data.scoresPerJudge.map((j) => (
            <div key={j.judgeId} className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#6b7a9e] w-40 truncate">
                {j.judgeName}
              </span>
              <div className="flex-1 h-1 bg-[#1b2540] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00e5d0]/60"
                  style={{
                    width:
                      data.totalProjects > 0
                        ? `${Math.min(100, (j.count / data.totalProjects) * 100)}%`
                        : "0%",
                  }}
                />
              </div>
              <span className="font-mono text-xs text-[#aebad6] w-6 text-right shrink-0">
                {j.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
