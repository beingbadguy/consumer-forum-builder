import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { casesRepo, usersRepo, documentsRepo, activityRepo } from '@/app/lib/repository';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const [allUsers, allCases, allDocs, recentLogs] = await Promise.all([
      usersRepo.list(),
      casesRepo.listAll(),
      documentsRepo.listByUserOrCase({}),
      activityRepo.list(20),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const casesToday = allCases.filter((c) => new Date(c.createdAt) >= today).length;
    const draftCases = allCases.filter((c) => c.caseStatus === 'draft').length;
    const completedCases = allCases.filter((c) => c.caseStatus === 'completed' || c.completionPercentage >= 90).length;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = allUsers.filter((u) => u.lastLoginAt && new Date(u.lastLoginAt) >= sevenDaysAgo).length;

    return NextResponse.json({
      statistics: {
        totalUsers: allUsers.length,
        totalCases: allCases.length,
        draftCases,
        completedCases,
        casesToday,
        activeUsers: Math.max(activeUsers, 1),
        totalDocuments: allDocs.length,
      },
      recentCases: allCases.slice(0, 8),
      recentActivity: recentLogs,
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin dashboard stats' }, { status: 500 });
  }
}

