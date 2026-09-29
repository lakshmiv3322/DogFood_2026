import React from "react";
import { Download, RefreshCw, CheckCircle2, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function OrganizerMock() {
  return (
    <Card className="border border-border/80 bg-surface/90 shadow-lg backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-border/60 bg-bg-2/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            <CardTitle className="text-sm font-mono uppercase tracking-wider">
              Live Evaluation Coverage
            </CardTitle>
          </div>
          <Badge variant="accent" size="sm">
            Round 1 Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {/* Coverage Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-text-secondary">Overall Evaluation Coverage</span>
            <span className="text-accent font-bold">87.5%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-bg-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: "87.5%" }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-text-tertiary mt-1.5">
            <span>21 of 24 submissions scored</span>
            <span>Target: 100%</span>
          </div>
        </div>

        {/* Judge Activity List */}
        <div className="space-y-2.5 pt-2 border-t border-border/40">
          <p className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
            Assigned Evaluator Status
          </p>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg-3/60 border border-border/40">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-success" />
                <span className="text-text-primary">Tomas Varga (Judge A)</span>
              </div>
              <span className="text-text-tertiary">12 / 12 scored (100%)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg-3/60 border border-border/40">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-warn animate-pulse" />
                <span className="text-text-primary">Wei Lindqvist (Judge B)</span>
              </div>
              <span className="text-accent font-semibold">9 / 12 scored (75%)</span>
            </div>
          </div>
        </div>

        {/* Live Export & Audit controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2 text-[11px] font-mono text-text-tertiary">
            <RefreshCw size={12} className="animate-spin text-accent" />
            <span>SWR polling every 5s</span>
          </div>
          <Button size="sm" variant="secondary" className="gap-1.5 text-[11px]">
            <Download size={12} />
            <span>Export CSV</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
