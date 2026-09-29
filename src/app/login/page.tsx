"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, AlertCircle, ChevronDown, ChevronUp, KeyRound } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    email: "organizer@dogfood.local",
    label: "Organizer",
    color: "#ff3d6e",
  },
  {
    email: "tomas.varga@example.org",
    label: "Judge A (Tomas Varga)",
    color: "#00e5d0",
  },
  {
    email: "wei.lindqvist@example.org",
    label: "Judge B (Wei Lindqvist)",
    color: "#00e5d0",
  },
  {
    email: "participant@dogfood.local",
    label: "Participant",
    color: "#aebad6",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Invalid email or password");
        return;
      }

      // Redirect based on role
      if (data.role === "ORGANIZER") router.push("/dashboard/organizer");
      else if (data.role === "JUDGE") router.push("/dashboard/judge");
      else router.push("/dashboard/participant");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-bg-1">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          <span>DOGFOOD 2026</span>
        </Link>

        {/* Main Product Sign-in Card */}
        <Card className="border-border bg-surface shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl uppercase">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your judging queue or team dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 font-mono text-xs text-danger">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.org"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full gap-2 mt-2"
              >
                <span>Sign In</span>
                <ArrowRight size={16} />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/60 flex flex-col items-center gap-1">
            <p className="font-mono text-xs text-text-tertiary">
              New team?{" "}
              <Link href="/signup" className="text-accent hover:underline font-bold">
                Create an account →
              </Link>
            </p>
            <Link href="/forgot-password" className="font-mono text-xs text-text-tertiary hover:text-accent transition-colors mt-1">
              Forgot your password?
            </Link>
          </CardFooter>
        </Card>

        {/* Small Disclosure Below Sign-In Card: Only shows if clicked */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded p-1"
          >
            <KeyRound size={13} />
            <span>Judging this submission? View demo credentials</span>
            {showDemo ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showDemo && (
            <div className="mt-4 rounded-xl border border-border bg-surface-2 p-5 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
                  Preset Evaluator Accounts
                </span>
                <span className="text-[10px] text-text-tertiary">Prefill only</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setError("Enter the seed password printed in docker logs, then click Sign In.");
                    }}
                    className="flex items-center justify-between border border-border bg-surface px-3 py-2 rounded-lg text-left hover:border-accent/40 transition-colors"
                  >
                    <span className="text-[11px] font-bold truncate" style={{ color: acc.color }}>
                      {acc.label}
                    </span>
                    <span className="text-[10px] text-text-tertiary">prefill →</span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-text-tertiary pt-2 border-t border-border/60">
                Passwords are printed by the seed script at startup in container stdout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
