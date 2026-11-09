import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { usersRepo, casesRepo } from '@/app/lib/repository';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const role = searchParams.get('role') || undefined;

    const users = await usersRepo.list({ search, role });
    const allCases = await casesRepo.listAll();

    // Map user with case count and sanitize (strip passwordHash)
    const enriched = users.map((u) => {
      const userCases = allCases.filter((c) => c.userId === u._id);
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        accountStatus: u.accountStatus,
        caseCount: userCases.length,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
      };
    });

    return NextResponse.json({ users: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve users' }, { status: 500 });
  }
}

