import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { casesRepo, usersRepo, documentsRepo } from '@/app/lib/repository';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;

    const [cases, users, docs] = await Promise.all([
      casesRepo.listAll({ search, status, category }),
      usersRepo.list(),
      documentsRepo.listByUserOrCase({}),
    ]);

    const userMap = new Map(users.map((u) => [u._id, u]));

    const enriched = cases.map((c) => {
      const owner = userMap.get(c.userId);
      const caseDocs = docs.filter((d) => d.caseId === c._id);
      return {
        ...c,
        userName: owner?.name || 'Unknown User',
        userEmail: owner?.email || 'N/A',
        documentsCount: caseDocs.length,
      };
    });

    return NextResponse.json({ cases: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve cases' }, { status: 500 });
  }
}

