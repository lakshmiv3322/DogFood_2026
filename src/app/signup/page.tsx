"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Users } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successToast, setSuccessToast] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};

    if (!teamName.trim()) {
      errs.teamName = "Team name is required";
    } else if (teamName.trim().length < 2) {
      errs.teamName = "Team name must be at least 2 characters";
    } else if (teamName.trim().length > 60) {
      errs.teamName = "Team name cannot exceed 60 characters";
    }

    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: teamName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const fieldErrs: Record<string, string> = {};
          Object.entries(data.details).forEach(([field, msgs]) => {
            fieldErrs[field] = Array.isArray(msgs) ? msgs[0] : String(msgs);
          });
          setErrors(fieldErrs);
        } else {
          setServerError(data.error ?? "Registration failed. Please try again.");
        }
        return;
      }

      // Success
      setSuccessToast(true);
      router.refresh();

      setTimeout(() => {
        router.push("/projects");
      }, 1000);
    } catch {
      setServerError("Network error. Please verify your connection.");
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

        <Card className="border-border bg-surface shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent border border-accent/30 font-mono text-xs font-bold">
                <Users size={14} />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                Team Registration
              </span>
            </div>
            <CardTitle className="text-2xl uppercase">Register Your Team</CardTitle>
            <CardDescription>
              Create a team account to submit your project and track evaluation reviews.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {serverError && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 font-mono text-xs text-danger">
                <AlertCircle size={15} className="shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                label="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Apex Neural Systems"
                error={errors.teamName}
                required
              />

              <Input
                label="Team Lead Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lead@example.org"
                error={errors.email}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                error={errors.confirmPassword}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full gap-2 mt-2"
              >
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/60 flex items-center justify-center">
            <p className="font-mono text-xs text-text-tertiary">
              Already registered?{" "}
              <Link href="/login" className="text-accent hover:underline font-bold">
                Sign in →
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Success Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-success/40 bg-surface px-4 py-3 shadow-lg font-mono text-xs text-success animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} />
            <span>Team registered — you can submit once the event opens.</span>
          </div>
        )}
      </div>
    </div>
  );
}
