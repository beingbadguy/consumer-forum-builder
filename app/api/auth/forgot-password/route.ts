import { NextRequest, NextResponse } from 'next/server';
import { usersRepo, activityRepo } from '@/app/lib/repository';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await usersRepo.findByEmail(cleanEmail);

    if (user) {
      const resetToken = 'rst_' + Math.random().toString(36).substring(2, 12);
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour

      await usersRepo.update(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      });

      await activityRepo.log({
        userId: user._id,
        userEmail: user.email,
        action: 'PASSWORD_RESET_REQUESTED',
      });

      return NextResponse.json({
        message: 'Password reset link has been dispatched to your email.',
        // Dev aid: return resetToken in non-prod or log it
        devToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      });
    }

    // Return generic success to avoid email enumeration
    return NextResponse.json({
      message: 'If an account exists with this email, a reset link has been sent.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

