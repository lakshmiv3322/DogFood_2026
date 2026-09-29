'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setResetUrl(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      if (data.demoMode && data.resetUrl) {
        setResetUrl(data.resetUrl);
        setSuccess('Reset link generated (demo mode):');
      } else {
        setSuccess(data.message ?? 'If that email is registered, a reset link was sent.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-bg-1">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>

        <Card className="border-border bg-surface shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent border border-accent/30">
                <Mail size={14} />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                Password Reset
              </span>
            </div>
            <CardTitle className="text-2xl uppercase">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 font-mono text-xs text-danger">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-lg border border-green-500/40 bg-green-500/10 p-3 font-mono text-xs text-green-400">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>{success}</span>
                </div>
                {resetUrl && (
                  <a
                    href={resetUrl}
                    className="block mt-2 text-accent hover:underline break-all font-mono text-xs"
                  >
                    {window.location.origin}{resetUrl}
                  </a>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.org"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full gap-2 mt-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight size={16} />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/60 flex flex-col items-center gap-1">
            <p className="font-mono text-xs text-text-tertiary">
              Remembered it?{' '}
              <Link href="/login" className="text-accent hover:underline font-bold">
                Sign in →
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
