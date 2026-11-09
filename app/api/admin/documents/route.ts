import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { documentsRepo, usersRepo, casesRepo } from '@/app/lib/repository';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const [docs, users, cases] = await Promise.all([
      documentsRepo.listByUserOrCase({}),
      usersRepo.list(),
      casesRepo.listAll(),
    ]);

    const userMap = new Map(users.map((u) => [u._id, u]));
    const caseMap = new Map(cases.map((c) => [c._id, c]));

    const enriched = docs.map((d) => {
      const owner = userMap.get(d.userId);
      const parentCase = caseMap.get(d.caseId);
      return {
        ...d,
        ownerName: owner?.name || 'Unknown',
        ownerEmail: owner?.email || 'N/A',
        caseTitle: parentCase?.caseTitle || 'Unknown Case',
      };
    });

    return NextResponse.json({ documents: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve documents' }, { status: 500 });
  }
}

