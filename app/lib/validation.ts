import { ComplaintFormData, FormStep } from '../types/complaint';

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\+\(\)]/g, '');
  return clean.length >= 8 && clean.length <= 13 && /^\d+$/.test(clean);
}

export function validateStep(step: FormStep, data: ComplaintFormData): StepValidationResult {
  const errors: Record<string, string> = {};

  switch (step) {
    case 1: // Proforma Details
      if (!data.caseDetails.category?.trim()) {
        errors.category = 'Case category is required';
      }
      if (!data.caseDetails.totalConsideration?.trim()) {
        errors.totalConsideration = 'Total consideration paid is required';
      }
      if (!data.caseDetails.claimedAmount?.trim()) {
        errors.claimedAmount = 'Claimed amount is required';
      }
      if (!data.caseDetails.section && (!data.caseDetails.sectionsList || data.caseDetails.sectionsList.length === 0)) {
        errors.section = 'Please specify at least one applicable Section (e.g. Section 35(1)(a))';
      }
      break;

    case 2: // Synopsis & Events
      if (!data.events || data.events.length === 0) {
        errors.events = 'At least one date and event entry is required';
      } else {
        const hasValidEvent = data.events.some(
          (e) => e.date?.trim() || e.description?.trim()
        );
        if (!hasValidEvent) {
          errors.events = 'Please provide date or description for at least one event';
        }
      }
      break;

    case 3: // Memo of Parties
      if (!data.complainants || data.complainants.length === 0) {
        errors.complainants = 'At least one complainant is required';
      } else {
        data.complainants.forEach((c, idx) => {
          if (!c.name?.trim()) {
            errors[`complainant_${idx}_name`] = `Complainant #${idx + 1} name is required`;
          }
          if (c.phone && !validatePhone(c.phone)) {
            errors[`complainant_${idx}_phone`] = `Complainant #${idx + 1} phone number must be valid`;
          }
          if (c.email && !validateEmail(c.email)) {
            errors[`complainant_${idx}_email`] = `Complainant #${idx + 1} email must be valid`;
          }
        });
      }

      if (!data.oppositeParties || data.oppositeParties.length === 0) {
        errors.oppositeParties = 'At least one opposite party is required';
      } else {
        data.oppositeParties.forEach((op, idx) => {
          if (!op.name?.trim()) {
            errors[`op_${idx}_name`] = `Opposite Party #${idx + 1} name is required`;
          }
        });
      }
      break;

    case 4: // Consumer Complaint Main Body
      if (!data.complaintBody?.trim()) {
        errors.complaintBody = 'Complaint main body / narrative statements are required';
      }
      break;

    case 5: // Prayer
      if (!data.prayer?.trim() && !data.prayerClaims?.claimAmount) {
        errors.prayer = 'Prayer clause or claim amounts are required';
      }
      break;

    case 6: // Verification
      if (!data.verificationPlace?.trim()) {
        errors.verificationPlace = 'Verification place is required';
      }
      break;

    case 7: // Affidavit
      if (!data.affidavit?.trim()) {
        errors.affidavit = 'Affidavit content / statements are required';
      }
      break;

    case 8: // Annexures
      if (!data.annexures || data.annexures.length === 0) {
        errors.annexures = 'At least one annexure or document reference is required';
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
