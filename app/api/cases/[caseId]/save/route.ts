import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { casesRepo, activityRepo } from '@/app/lib/repository';
import { ComplaintFormData, FormStep } from '@/app/types/complaint';

interface RouteContext {
  params: Promise<{ caseId: string }>;
}

function calculateCompletion(data: Partial<ComplaintFormData>): number {
  if (!data) return 12;
  let score = 0;

  // Step 1: Proforma
  if (data.caseDetails?.commissionState || data.caseDetails?.category) score += 12.5;
  // Step 2: Events
  if (data.events && data.events.length > 0) score += 12.5;
  // Step 3: Parties
  if (data.complainants?.[0]?.name && data.oppositeParties?.[0]?.name) score += 12.5;
  // Step 4: Complaint body
  if (data.complaintBody && data.complaintBody.trim().length > 20) score += 12.5;
  // Step 5: Prayer
  if (data.prayer || data.prayerClaims?.claimAmount) score += 12.5;
  // Step 6: Verification
  if (data.verificationPlace || data.verificationDate) score += 12.5;
  // Step 7: Affidavit
  if (data.affidavitDate || data.affidavit) score += 12.5;
  // Step 8: Annexures
  if (data.annexures && data.annexures.length > 0) score += 12.5;

  return Math.min(100, Math.max(12, Math.round(score)));
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
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
      return NextResponse.json({ error: 'Access denied: Case ownership violation' }, { status: 403 });
    }

    const body = await req.json();
    const formData = body.formData as ComplaintFormData;
    const currentStep = (body.currentStep as FormStep) || existingCase.currentStep || 1;

    if (!formData) {
      return NextResponse.json({ error: 'Invalid payload: formData required' }, { status: 400 });
    }

    const completion = calculateCompletion(formData);

    // Compute automatic informative title if still default
    let newTitle = existingCase.caseTitle;
    const cName = formData.complainants?.[0]?.name;
    const opName = formData.oppositeParties?.[0]?.name;
    const cat = formData.caseDetails?.category;

    if (
      (!newTitle || newTitle === 'New Consumer Complaint' || newTitle === 'Untitled Consumer Complaint') &&
      cName
    ) {
      newTitle = `${cName}${opName ? ` v/s ${opName}` : ''}${cat ? ` (${cat})` : ''}`;
    }

    const updated = await casesRepo.update(caseId, {
      formData,
      currentStep,
      completionPercentage: completion,
      caseTitle: newTitle,
      caseType: cat || existingCase.caseType,
      lastSavedAt: new Date(),
    });

    await activityRepo.log({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      caseId,
      action: 'CASE_SAVED',
      metadata: { currentStep, completionPercentage: completion },
    });

    return NextResponse.json({
      message: 'Saved successfully',
      case: updated,
      lastSavedAt: updated?.lastSavedAt,
    });
  } catch (error: any) {
    console.error('Save case error:', error);
    return NextResponse.json({ error: 'Failed to save case data' }, { status: 500 });
  }
}

