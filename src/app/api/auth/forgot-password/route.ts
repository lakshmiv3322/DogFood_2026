import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      return NextResponse.json({ message: 'If that email is registered, a reset link was sent.' });
    }

    // Invalidate existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const resetToken = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    if (isDemoMode) {
      return NextResponse.json({
        message: 'Reset link generated.',
        resetUrl: `/reset-password/${resetToken.token}`,
        demoMode: true,
      });
    }

    return NextResponse.json({ message: 'If that email is registered, a reset link was sent.' });
  } catch (err) {
    console.error('forgot-password error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
