import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, getAuthUser } from '@/app/lib/auth';
import { activityRepo } from '@/app/lib/repository';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (user) {
      await activityRepo.log({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        action: 'USER_LOGOUT',
      });
    }

    const response = NextResponse.json({ message: 'Logged out successfully' });
    clearAuthCookie(response);
    return response;
  } catch (err: any) {
    const response = NextResponse.json({ message: 'Logged out' });
    clearAuthCookie(response);
    return response;
  }
}

