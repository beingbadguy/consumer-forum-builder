import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { casesRepo, usersRepo, documentsRepo, activityRepo } from '@/app/lib/repository';

interface RouteContext {
  params: Promise<{ caseId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { caseId } = await params;
    const caseItem = await casesRepo.findById(caseId);

    if (!caseItem) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const [owner, docs, allLogs] = await Promise.all([
      usersRepo.findById(caseItem.userId),
      documentsRepo.listByUserOrCase({ caseId }),
      activityRepo.list(100),
    ]);

    const caseLogs = allLogs.filter((l) => l.caseId === caseId);

    return NextResponse.json({
      case: caseItem,
      owner: owner
        ? {
            id: owner._id,
            name: owner.name,
            email: owner.email,
            accountStatus: owner.accountStatus,
            createdAt: owner.createdAt,
          }
        : null,
      documents: docs,
      activity: caseLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve case details' }, { status: 500 });
  }
}

