import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { casesRepo, activityRepo } from '@/app/lib/repository';
import { getEmptyFormData } from '@/app/lib/initialData';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const cases = await casesRepo.listByUser(user._id);
    return NextResponse.json({ cases });
  } catch (error: any) {
    console.error('List cases error:', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let initialLang: 'hi' | 'en' = 'hi';
    let customTitle = 'New Consumer Complaint';

    try {
      const body = await req.json();
      if (body.language === 'en') initialLang = 'en';
      if (body.title && typeof body.title === 'string') customTitle = body.title.trim();
    } catch {
      // Body may be empty
    }

    const emptyData = getEmptyFormData(initialLang);

    const newCase = await casesRepo.create({
      userId: user._id,
      caseTitle: customTitle,
      caseType: 'Consumer Dispute',
      caseStatus: 'draft',
      currentStep: 1,
      totalSteps: 8,
      formData: emptyData,
      completionPercentage: 12,
    });

    await activityRepo.log({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      caseId: newCase._id,
      action: 'CASE_CREATED',
      metadata: { caseTitle: newCase.caseTitle },
    });

    return NextResponse.json({ case: newCase }, { status: 201 });
  } catch (error: any) {
    console.error('Create case error:', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}

