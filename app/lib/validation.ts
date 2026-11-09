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
  const isEn = data.language === 'en';
  const errors: Record<string, string> = {};

  switch (step) {
    case 1: // Proforma Details
      if (!data.caseDetails.category?.trim()) {
        errors.category = isEn
          ? 'Please select a dispute category'
          : 'कृपया केस की श्रेणी (Dispute Category) चुनें';
      }
      if (!data.caseDetails.totalConsideration?.trim() && !data.caseDetails.valueOfGoods?.trim()) {
        errors.totalConsideration = isEn
          ? 'Total Consideration Paid or Value of Goods is required'
          : 'कुल प्रतिफल राशि (Total Consideration) या माल का मूल्य आवश्यक है';
      }
      if (!data.caseDetails.claimedAmount?.trim()) {
        errors.claimedAmount = isEn
          ? 'Total Claimed Amount is required'
          : 'कुल दावा राशि (Claimed Amount) आवश्यक है';
      }
      if (!data.caseDetails.section && (!data.caseDetails.sectionsList || data.caseDetails.sectionsList.length === 0)) {
        errors.section = isEn
          ? 'Please select at least one applicable section (e.g. Section 35(1)(a))'
          : 'कृपया कम से कम एक लागू धारा (जैसे धारा 35(1)(a)) चुनें';
      }
      break;

    case 2: // Synopsis & Events
      if (!data.events || data.events.length === 0) {
        errors.events = isEn
          ? 'At least one date and event description is required'
          : 'कम से कम एक तारीख और घटना का विवरण आवश्यक है';
      } else {
        const hasValidEvent = data.events.some(
          (e) => e.date?.trim() || e.description?.trim()
        );
        if (!hasValidEvent) {
          errors.events = isEn
            ? 'Please enter at least one date or event description'
            : 'कृपया कम से कम एक घटना की तारीख या विवरण दर्ज करें';
        }
      }
      break;

    case 3: // Memo of Parties
      if (!data.complainants || data.complainants.length === 0) {
        errors.complainants = isEn
          ? 'At least one Complainant name and address is required'
          : 'कम से कम एक परिवादी (Complainant) का नाम व विवरण आवश्यक है';
      } else {
        data.complainants.forEach((c, idx) => {
          if (!c.name?.trim()) {
            errors[`complainant_${idx}_name`] = isEn
              ? `Complainant #${idx + 1} name is required`
              : `परिवादी #${idx + 1} का नाम दर्ज करना आवश्यक है`;
          }
          if (c.phone && !validatePhone(c.phone)) {
            errors[`complainant_${idx}_phone`] = isEn
              ? `Enter a valid phone number for Complainant #${idx + 1}`
              : `परिवादी #${idx + 1} का मान्य 10 अंकों का मोबाइल नंबर दर्ज करें`;
          }
          if (c.email && !validateEmail(c.email)) {
            errors[`complainant_${idx}_email`] = isEn
              ? `Enter a valid email address for Complainant #${idx + 1}`
              : `परिवादी #${idx + 1} का मान्य ईमेल पता दर्ज करें`;
          }
        });
      }

      if (!data.oppositeParties || data.oppositeParties.length === 0) {
        errors.oppositeParties = isEn
          ? 'At least one Opposite Party name and address is required'
          : 'कम से कम एक विपक्षी (Opposite Party) का नाम व पता आवश्यक है';
      } else {
        data.oppositeParties.forEach((op, idx) => {
          if (!op.name?.trim()) {
            errors[`op_${idx}_name`] = isEn
              ? `Opposite Party #${idx + 1} name is required`
              : `विपक्षी दल #${idx + 1} का नाम दर्ज करना आवश्यक है`;
          }
        });
      }
      break;

    case 4: // Consumer Complaint Main Body
      if (!data.complaintBody?.trim()) {
        errors.complaintBody = isEn
          ? 'Complaint statement of facts and grounds is required'
          : 'परिवाद का मुख्य विवरण एवं सेवा में कमी के तथ्य दर्ज करना आवश्यक है';
      }
      break;

    case 5: // Prayer
      if (!data.prayer?.trim() && !data.prayerClaims?.claimAmount && !data.caseDetails.claimedAmount) {
        errors.prayer = isEn
          ? 'Prayer clauses or claim amount is required'
          : 'प्रार्थना खंड (Prayer Clause) या दावा राशि दर्ज करना आवश्यक है';
      }
      break;

    case 6: // Verification
      if (!data.verificationPlace?.trim()) {
        errors.verificationPlace = isEn
          ? 'Place of Verification is required'
          : 'सत्यापन का स्थान (Place of Verification) दर्ज करें';
      }
      break;

    case 7: // Affidavit
      if (!data.affidavit?.trim()) {
        errors.affidavit = isEn
          ? 'Affidavit sworn statement text is required'
          : 'शपथ पत्र का कथन (Affidavit text) आवश्यक है';
      }
      break;

    case 8: // Annexures
      if (!data.annexures || data.annexures.length === 0) {
        errors.annexures = isEn
          ? 'At least one annexure or evidentiary document is required'
          : 'कम से कम एक संलग्नक या साक्ष्य दस्तावेज दर्ज करें';
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
