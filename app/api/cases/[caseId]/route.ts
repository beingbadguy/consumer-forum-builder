import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { casesRepo, activityRepo } from '@/app/lib/repository';

interface RouteContext {
  params: Promise<{ caseId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { caseId } = await params;
    const caseItem = await casesRepo.findById(caseId);

    if (!caseItem) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Server-side ownership enforcement
    if (caseItem.userId !== user._id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied: You do not own this case' }, { status: 403 });
    }

    return NextResponse.json({ case: caseItem });
  } catch (error: any) {
    console.error('Get case error:', error);
    return NextResponse.json({ error: 'Failed to retrieve case' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { caseId } = await params;
    const caseItem = await casesRepo.findById(caseId);

    if (!caseItem) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (caseItem.userId !== user._id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await req.json();
    const updates: any = {};
    if (body.caseTitle) updates.caseTitle = body.caseTitle;
    if (body.caseStatus) updates.caseStatus = body.caseStatus;
    if (body.caseType) updates.caseType = body.caseType;

    const updated = await casesRepo.update(caseId, updates);
    return NextResponse.json({ case: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update case' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { caseId } = await params;
    const caseItem = await casesRepo.findById(caseId);

    if (!caseItem) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (caseItem.userId !== user._id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await casesRepo.delete(caseId);

    await activityRepo.log({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      caseId,
      action: 'CASE_DELETED',
      metadata: { caseTitle: caseItem.caseTitle },
    });

    return NextResponse.json({ message: 'Case deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete case' }, { status: 500 });
  }
}

