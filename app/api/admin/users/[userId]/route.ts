import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { usersRepo, casesRepo } from '@/app/lib/repository';

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = await params;
    const targetUser = await usersRepo.findById(userId);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userCases = await casesRepo.listByUser(userId);

    return NextResponse.json({
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        emailVerified: targetUser.emailVerified,
        accountStatus: targetUser.accountStatus,
        createdAt: targetUser.createdAt,
        lastLoginAt: targetUser.lastLoginAt,
      },
      cases: userCases,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve user details' }, { status: 500 });
  }
}

