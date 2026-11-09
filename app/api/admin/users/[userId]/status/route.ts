import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { usersRepo, activityRepo } from '@/app/lib/repository';

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { userId } = await params;
    const body = await req.json();
    const { status } = body;

    if (status !== 'active' && status !== 'suspended') {
      return NextResponse.json({ error: 'Invalid status. Must be active or suspended' }, { status: 400 });
    }

    const targetUser = await usersRepo.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent suspending own admin account
    if (targetUser._id === admin._id) {
      return NextResponse.json({ error: 'Cannot alter your own administrative status' }, { status: 400 });
    }

    const updated = await usersRepo.update(userId, { accountStatus: status });

    await activityRepo.log({
      userId: admin._id,
      userEmail: admin.email,
      userName: admin.name,
      action: status === 'suspended' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      metadata: { targetUserId: userId, targetUserEmail: targetUser.email },
    });

    return NextResponse.json({
      message: `User status updated to ${status}`,
      user: {
        id: updated?._id,
        name: updated?.name,
        email: updated?.email,
        accountStatus: updated?.accountStatus,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  }
}

