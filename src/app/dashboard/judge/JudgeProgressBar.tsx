"use client";

import useSWR from "swr";

interface JudgeScoresResponse {
  totalScored: number;
  scores: { scoreId: string }[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Props {
  totalAssigned: number;
}

export function JudgeProgressBar({ totalAssigned }: Props) {
  const { data, isLoading } = useSWR<JudgeScoresResponse>(
    "/api/judge/scores",
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  const scored = data?.totalScored ?? 0;
  const total = totalAssigned;
  const pct = total > 0 ? Math.round((scored / total) * 100) : 0;
  const done = scored >= total && total > 0;

  return (
    <div className="border border-[#1b2540] bg-[#0e1428] p-5 mb-8">
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono text-xs tracking-widest text-[#6b7a9e] uppercase">
          Your Progress{" "}
          <span className="text-[#3a4a70] normal-case">(live · 10s)</span>
        </p>
        <p className="font-mono text-xs" style={{ color: done ? "#00e5d0" : "#e6ecff" }}>
          {isLoading ? "…" : scored} / {total} scored
          {done && " ✓"}
        </p>
      </div>
      <div className="h-1.5 bg-[#1b2540] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: done ? "#00e5d0" : "#ff3d6e",
          }}
        />
      </div>
      {!isLoading && (
        <p className="font-mono text-[10px] text-[#3a4a70] mt-1.5">
          {pct}% complete
        </p>
      )}
    </div>
  );
}
