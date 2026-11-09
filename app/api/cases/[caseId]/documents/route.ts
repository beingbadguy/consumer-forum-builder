import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { casesRepo, documentsRepo, activityRepo } from '@/app/lib/repository';

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
    const existingCase = await casesRepo.findById(caseId);

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (existingCase.userId !== user._id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const docs = await documentsRepo.listByUserOrCase({ caseId });
    return NextResponse.json({ documents: docs });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve documents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { caseId } = await params;
    const existingCase = await casesRepo.findById(caseId);

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (existingCase.userId !== user._id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await req.json();
    const { originalFileName, fileType, fileSize } = body;

    if (!originalFileName) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const doc = await documentsRepo.create({
      userId: user._id,
      caseId,
      originalFileName,
      fileType: fileType || 'application/pdf',
      fileSize: fileSize || 1024,
      storageKey: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    });

    await activityRepo.log({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      caseId,
      action: 'DOCUMENT_UPLOADED',
      metadata: { originalFileName, fileSize },
    });

    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to register document' }, { status: 500 });
  }
}

