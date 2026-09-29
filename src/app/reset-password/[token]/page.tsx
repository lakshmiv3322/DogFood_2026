'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
import { ArrowLeft, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const params = useParams();
  const token = typeof params.token === 'string' ? params.token : '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(data.message ?? 'Password reset successfully. You can now sign in.');
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
                <KeyRound size={14} />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                Password Reset
              </span>
            </div>
            <CardTitle className="text-2xl uppercase">Set New Password</CardTitle>
            <CardDescription>
              Choose a strong password with at least 8 characters.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 font-mono text-xs text-danger">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
                  <CheckCircle2 size={24} className="text-green-400" />
                </div>
                <p className="font-mono text-sm text-green-400">{success}</p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-bg-0 hover:bg-accent-2 transition-colors"
                >
                  Sign In
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  className="w-full gap-2 mt-2"
                >
                  <span>Reset Password</span>
                  <ArrowRight size={16} />
                </Button>
              </form>
            )}
          </CardContent>

          {!success && (
            <CardFooter className="pt-2 border-t border-border/60 flex flex-col items-center gap-1">
              <p className="font-mono text-xs text-text-tertiary">
                Need a new link?{' '}
                <Link href="/forgot-password" className="text-accent hover:underline font-bold">
                  Request again →
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
