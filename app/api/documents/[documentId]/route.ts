import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { documentsRepo, activityRepo } from '@/app/lib/repository';

interface RouteContext {
  params: Promise<{ documentId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { documentId } = await params;
    const doc = await documentsRepo.findById(documentId);

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (doc.userId !== user._id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ document: doc });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { documentId } = await params;
    const doc = await documentsRepo.findById(documentId);

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (doc.userId !== user._id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await documentsRepo.delete(documentId);

    await activityRepo.log({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      caseId: doc.caseId,
      action: 'DOCUMENT_DELETED',
      metadata: { originalFileName: doc.originalFileName },
    });

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}

