"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Textarea,
  Select,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Toast,
  Skeleton,
  Tooltip,
  EmptyState,
} from "@/components/ui";
import { Sparkles, Layers, Shield, Terminal, ArrowRight } from "lucide-react";

export default function DesignSystemPage() {
  // Requirement 7: dev-only, 404 in production
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header
        user={{
          name: "Design Reviewer",
          role: "ORGANIZER",
          email: "reviewer@dogfood.local",
        }}
      />

      <main className="flex-1 py-12">
        <Container size="xl">
          {/* Header */}
          <div className="mb-12 border-b border-border pb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                Design Foundation
              </span>
              <span className="text-text-disabled">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                Development Preview
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-text-primary tracking-tight">
              Design System &amp; Tokens
            </h1>
            <p className="mt-3 max-w-2xl font-mono text-xs text-text-secondary leading-relaxed">
              Showcase of color ramps, typography, elevation, and all 12 core UI primitives across light and dark modes.
            </p>
          </div>

          <div className="space-y-16">
            {/* ── 1. Color Tokens ── */}
            <section>
              <h2 className="font-display text-xl font-bold uppercase text-text-primary mb-6 flex items-center gap-2">
                <Layers size={18} className="text-accent" />
                <span>1. Color Tokens &amp; Ramps</span>
              </h2>

              <div className="space-y-6">
                {/* Backgrounds */}
                <div>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    Background Hierarchy (bg-0 .. bg-3)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: "bg-0", label: "Deep Base", class: "bg-bg-0" },
                      { name: "bg-1", label: "Page Surface", class: "bg-bg-1" },
                      { name: "bg-2 / surface", label: "Card / Panel", class: "bg-bg-2" },
                      { name: "bg-3 / surface-2", label: "Raised Element", class: "bg-bg-3" },
                    ].map((bg) => (
                      <div
                        key={bg.name}
                        className={`rounded-lg border border-border p-4 ${bg.class}`}
                      >
                        <p className="font-mono text-xs font-bold text-text-primary">{bg.name}</p>
                        <p className="text-[11px] text-text-tertiary">{bg.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent 9-Step Ramp */}
                <div>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    Accent Hue — 9-Step Ramp (Teal)
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                    {[
                      { step: "1 (Base)", class: "bg-accent-1 text-bg-0" },
                      { step: "2", class: "bg-accent-2 text-bg-0" },
                      { step: "3", class: "bg-accent-3 text-bg-0" },
                      { step: "4", class: "bg-accent-4 text-bg-0" },
                      { step: "5", class: "bg-accent-5 text-white" },
                      { step: "6", class: "bg-accent-6 text-white" },
                      { step: "7", class: "bg-accent-7 text-white" },
                      { step: "8", class: "bg-accent-8 text-white" },
                      { step: "9", class: "bg-accent-9 text-white" },
                    ].map((acc) => (
                      <div
                        key={acc.step}
                        className={`rounded-md p-3 text-center ${acc.class} shadow-sm`}
                      >
                        <p className="font-mono text-[11px] font-bold">{acc.step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semantic colors */}
                <div>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                    Semantic &amp; Status Colors
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border border-success/30 bg-success/10 p-4">
                      <p className="font-mono text-xs font-bold text-success">Success</p>
                      <p className="text-[11px] text-text-tertiary">Verified / Validated</p>
                    </div>
                    <div className="rounded-lg border border-warn/30 bg-warn/10 p-4">
                      <p className="font-mono text-xs font-bold text-warn">Warning</p>
                      <p className="text-[11px] text-text-tertiary">Pending / Approaching</p>
                    </div>
                    <div className="rounded-lg border border-danger/30 bg-danger/10 p-4">
                      <p className="font-mono text-xs font-bold text-danger">Danger</p>
                      <p className="text-[11px] text-text-tertiary">Locked / Critical</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 2. Buttons & Badges ── */}
            <section>
              <h2 className="font-display text-xl font-bold uppercase text-text-primary mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-accent" />
                <span>2. Buttons &amp; Badges</span>
              </h2>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="danger">Danger</Button>
                  <Button
                    variant="primary"
                    isLoading={buttonLoading}
                    onClick={() => {
                      setButtonLoading(true);
                      setTimeout(() => setButtonLoading(false), 2000);
                    }}
                  >
                    Click to Load
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="accent">Accent</Badge>
                  <Badge variant="success">Passed</Badge>
                  <Badge variant="warn">Pending</Badge>
                  <Badge variant="danger">Blocked</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>
            </section>

            {/* ── 3. Cards & Structure ── */}
            <section>
              <h2 className="font-display text-xl font-bold uppercase text-text-primary mb-6 flex items-center gap-2">
                <Shield size={18} className="text-accent" />
                <span>3. Cards &amp; Interactive Panels</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Card hover>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="accent">AI &amp; Algorithms</Badge>
                      <span className="font-mono text-xs text-text-tertiary">#PRJ-01</span>
                    </div>
                    <CardTitle className="mt-2">Glass Signal</CardTitle>
                    <CardDescription>
                      Adaptive telemetry inspection engine providing real-time metric capture.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs font-mono text-text-secondary">
                      <span>Team: Alpha Raptors</span>
                      <span className="text-accent">4.8 / 5.0</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs text-text-tertiary">Submitted 2h ago</span>
                    <Button size="sm" variant="ghost">
                      Details →
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Rubric</CardTitle>
                    <CardDescription>
                      Standardized judging criteria across all competitive hackathon tracks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 font-mono text-xs text-text-secondary">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span>1. Technical Execution</span>
                      <span className="text-text-primary">50%</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span>2. Architecture &amp; Code Quality</span>
                      <span className="text-text-primary">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3. Novelty &amp; Impact</span>
                      <span className="text-text-primary">20%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ── 4. Form Controls ── */}
            <section>
              <h2 className="font-display text-xl font-bold uppercase text-text-primary mb-6 flex items-center gap-2">
                <Terminal size={18} className="text-accent" />
                <span>4. Form Controls &amp; Validation</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    label="Project Title"
                    placeholder="Enter project name"
                    defaultValue="Deep Compass"
                  />
                  <Input
                    label="Repository URL"
                    placeholder="https://github.com/..."
                    error="URL must use http or https protocol"
                  />
                  <Select
                    label="Track Assignment"
                    options={[
                      { value: "trk_1", label: "Autonomous Agents" },
                      { value: "trk_2", label: "Data & Infrastructure" },
                      { value: "trk_3", label: "Developer Tooling" },
                    ]}
                  />
                </div>

                <div className="space-y-4">
                  <Textarea
                    label="Project Summary"
                    placeholder="Describe your technical architecture..."
                    defaultValue="Autonomous evaluation pipeline that enforces deterministic testing constraints across distributed nodes."
                  />
                  <Input
                    label="Disabled State"
                    disabled
                    value="submissions_closed_by_organizer"
                  />
                </div>
              </div>
            </section>

            {/* ── 5. Tabs, Dialog, Tooltips, Toasts & EmptyState ── */}
            <section>
              <h2 className="font-display text-xl font-bold uppercase text-text-primary mb-6">
                5. Interactive Primitives
              </h2>

              <div className="space-y-8">
                {/* Tabs */}
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="scores">Scores</TabsTrigger>
                    <TabsTrigger value="audit">Audit Log</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <Card className="p-4">
                      <p className="font-mono text-xs text-text-secondary">
                        Overview panel: Live real-time event stats and leaderboard previews.
                      </p>
                    </Card>
                  </TabsContent>
                  <TabsContent value="scores">
                    <Card className="p-4">
                      <p className="font-mono text-xs text-text-secondary">
                        Scores panel: Review breakdown for assigned tracks.
                      </p>
                    </Card>
                  </TabsContent>
                  <TabsContent value="audit">
                    <Card className="p-4">
                      <p className="font-mono text-xs text-text-secondary">
                        Audit log panel: Cryptographically verifiable administrative actions.
                      </p>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Skeletons, Tooltips, Dialog & Toast Triggers */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
                  <Tooltip content="Certified hackathon judge badge">
                    <Badge variant="accent">Hover For Tooltip</Badge>
                  </Tooltip>

                  <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                    Open Dialog Modal
                  </Button>

                  <Button variant="outline" onClick={() => setToastOpen(!toastOpen)}>
                    Toggle Preview Toast
                  </Button>
                </div>

                {/* Skeletons preview */}
                <div className="space-y-2">
                  <p className="font-mono text-xs uppercase text-text-tertiary">Skeleton Loaders</p>
                  <div className="flex items-center gap-4">
                    <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" className="w-1/3" />
                      <Skeleton variant="text" className="w-2/3" />
                    </div>
                  </div>
                </div>

                {/* EmptyState preview */}
                <div>
                  <p className="font-mono text-xs uppercase text-text-tertiary mb-3">Empty State</p>
                  <EmptyState
                    title="No Scores Pending"
                    description="You have completed all evaluations assigned to your track. Check back after round 2."
                    action={{
                      label: "Browse Gallery",
                      href: "/projects",
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </Container>
      </main>

      {/* Interactive Dialog Demo */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Score Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to finalize this evaluation? Scores cannot be modified after certified publish.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 font-mono text-xs text-text-secondary">
            <p>Project: Glass Signal</p>
            <p>Score: 9.5 / 10</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setDialogOpen(false)}>
              Certify &amp; Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Toast Demo */}
      {toastOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            variant="success"
            title="Evaluation Recorded"
            description="Score updated optimistically and synchronized with PostgreSQL."
            onClose={() => setToastOpen(false)}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
