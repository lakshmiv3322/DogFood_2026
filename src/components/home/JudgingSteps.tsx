import React from "react";
import { Sliders, ShieldCheck, FileSpreadsheet } from "lucide-react";

export function JudgingSteps() {
  const steps = [
    {
      num: "01",
      title: "Blind Rubric Evaluation",
      desc: "Judges independently review assigned projects across Functionality and Architecture quality without seeing peer reviews.",
      icon: <Sliders className="text-accent" size={24} />,
      animClass: "animate-[pulse_3s_ease-in-out_infinite]",
      badge: "Rubric (0-10)",
    },
    {
      num: "02",
      title: "Transactional Scoring",
      desc: "Upserts are executed inside database transactions with optimistic UI feedback and instant rollback guards.",
      icon: <ShieldCheck className="text-success" size={24} />,
      animClass: "animate-[bounce_4s_ease-in-out_infinite]",
      badge: "ACID Guaranteed",
    },
    {
      num: "03",
      title: "Consensus & Final Export",
      desc: "Live coverage telemetry tracks progress, culminating in a structured CSV ranking export for organizers.",
      icon: <FileSpreadsheet className="text-warn" size={24} />,
      animClass: "animate-[pulse_2.5s_ease-in-out_infinite]",
      badge: "CSV Export",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {steps.map((step) => (
        <div
          key={step.num}
          className="group relative rounded-xl border border-border bg-surface p-7 flex flex-col justify-between hover:border-accent/40 hover:bg-bg-3 transition-all duration-200"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-bg-2 border border-border ${step.animClass}`}
              >
                {step.icon}
              </div>
              <span className="font-mono text-2xl font-black text-text-disabled group-hover:text-accent transition-colors">
                {step.num}
              </span>
            </div>

            <span className="inline-block font-mono text-[10px] uppercase tracking-wider text-text-tertiary mb-2 border border-border/80 px-2 py-0.5 rounded">
              {step.badge}
            </span>

            <h3 className="font-display text-lg font-bold text-text-primary mb-2">
              {step.title}
            </h3>

            <p className="font-mono text-xs text-text-secondary leading-relaxed">
              {step.desc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-text-disabled">
            <span>Automated pipeline</span>
            <span className="text-accent">✓ Active</span>
          </div>
        </div>
      ))}
    </div>
  );
}
