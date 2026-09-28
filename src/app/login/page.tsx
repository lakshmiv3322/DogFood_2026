"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  async function handleLogin(loginEmail: string, loginPassword?: string) {
    if (!loginPassword) {
      setError("Password is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      // Redirect based on role
      if (data.role === "ORGANIZER") router.push("/dashboard/organizer");
      else if (data.role === "JUDGE") router.push("/dashboard/judge");
      else router.push("/projects");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-block font-mono text-xs tracking-widest text-[#00e5d0] uppercase mb-8 hover:text-[#e6ecff] transition-colors"
        >
          ← DOGFOOD 2026
        </Link>

        <div className="border border-[#1b2540] bg-[#0e1428] p-8">
          <p className="font-mono text-xs tracking-widest text-[#ff3d6e] uppercase mb-2">
            [ Sign In ]
          </p>
          <h1 className="font-black text-3xl uppercase tracking-tight text-[#e6ecff] mb-6">
            Your Portal
          </h1>

          {/* Quick-access demo accounts — only rendered when NEXT_PUBLIC_DEMO_MODE=true */}
          {isDemoMode && (
            <div className="mb-6">
              <p className="font-mono text-xs text-[#6b7a9e] uppercase tracking-widest mb-1">
                Quick access
              </p>
              <p className="font-mono text-[10px] text-[#3a4a70] mb-3">
                ⚠ Demo mode — check container logs for seed passwords
              </p>
              <div className="flex flex-col gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => {
                      setEmail(acc.email);
                      setError("Enter the seed password printed in docker logs, then click Sign In.");
                    }}
                    disabled={loading}
                    className="flex items-center justify-between border border-[#1b2540] px-4 py-3 text-left hover:border-[#2b3a60] transition-colors disabled:opacity-50 group"
                  >
                    <span
                      className="font-mono text-xs"
                      style={{ color: acc.color }}
                    >
                      {acc.label}
                    </span>
                    <span className="font-mono text-xs text-[#3a4a70] group-hover:text-[#6b7a9e] transition-colors">
                      prefill →
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#1b2540]" />
                <span className="font-mono text-xs text-[#3a4a70]">or enter credentials</span>
                <div className="flex-1 h-px bg-[#1b2540]" />
              </div>
            </div>
          )}

          {/* Login form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(email, password);
            }}
          >
            <label className="block font-mono text-xs text-[#6b7a9e] tracking-widest uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[#0a0f1e] border border-[#1b2540] text-[#e6ecff] font-mono text-xs px-3 py-3 focus:outline-none focus:border-[#00e5d0] placeholder:text-[#3a4a70] mb-4"
              required
            />

            <label className="block font-mono text-xs text-[#6b7a9e] tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a0f1e] border border-[#1b2540] text-[#e6ecff] font-mono text-xs px-3 py-3 focus:outline-none focus:border-[#00e5d0] placeholder:text-[#3a4a70] mb-4"
              required
            />

            {error && (
              <p className="font-mono text-xs text-[#ff3d6e] mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#ff3d6e] text-[#0a0f1e] font-mono font-bold text-xs tracking-widest uppercase px-4 py-3 hover:bg-[#e6ecff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>

        <p className="font-mono text-xs text-[#3a4a70] text-center mt-6">
          Auth is session-based. Passwords are printed by the seed script at startup.
        </p>
      </div>
    </div>
  );
}
