import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { activityRepo } from '@/app/lib/repository';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const logs = await activityRepo.list(200);
    return NextResponse.json({ activity: logs });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve activity logs' }, { status: 500 });
  }
}

