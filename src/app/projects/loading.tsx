import { Container } from "@/components/shell/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      {/* Header skeleton placeholder */}
      <div className="h-16 w-full border-b border-border bg-bg-1/80" />

      <main className="flex-1 py-10">
        <Container size="xl">
          {/* Title & Toolbar Skeleton */}
          <div className="mb-8 space-y-4">
            <Skeleton variant="text" className="w-48 h-8" />
            <div className="flex justify-between items-center gap-4">
              <Skeleton variant="rectangular" className="h-10 w-72 rounded-lg" />
              <Skeleton variant="rectangular" className="h-10 w-36 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <Skeleton variant="rectangular" className="h-7 w-16 rounded-md" />
              <Skeleton variant="rectangular" className="h-7 w-24 rounded-md" />
              <Skeleton variant="rectangular" className="h-7 w-28 rounded-md" />
            </div>
          </div>

          {/* 12-item Skeleton Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-surface p-6 flex flex-col justify-between h-[230px]"
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton variant="rectangular" className="h-5 w-20 rounded" />
                    <Skeleton variant="rectangular" className="h-5 w-12 rounded" />
                  </div>
                  <Skeleton variant="text" className="w-3/4 h-6" />
                  <Skeleton variant="text" className="w-full h-4" />
                  <Skeleton variant="text" className="w-5/6 h-4" />
                </div>
                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" className="h-6 w-6" />
                    <Skeleton variant="text" className="w-24 h-3" />
                  </div>
                  <Skeleton variant="rectangular" className="h-4 w-4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}
