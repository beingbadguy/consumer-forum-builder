import { NextRequest, NextResponse } from 'next/server';
import { usersRepo, activityRepo } from '@/app/lib/repository';
import { hashPassword } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Valid token and minimum 6 character password required' }, { status: 400 });
    }

    const allUsers = await usersRepo.list();
    const user = allUsers.find(
      (u) =>
        u.resetPasswordToken === token &&
        u.resetPasswordExpires &&
        new Date(u.resetPasswordExpires).getTime() > Date.now()
    );

    if (!user) {
      return NextResponse.json({ error: 'Reset link is invalid or has expired' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);
    await usersRepo.update(user._id, {
      passwordHash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    await activityRepo.log({
      userId: user._id,
      userEmail: user.email,
      action: 'PASSWORD_RESET_COMPLETED',
    });

    return NextResponse.json({ message: 'Password has been updated successfully. You may now log in.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}

