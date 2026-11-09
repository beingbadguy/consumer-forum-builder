export interface Complainant {
  name: string;
  relationType: 'W/O' | 'S/O' | 'D/O' | 'C/O' | string;
  parentName: string;
  village: string;
  po: string; // Post Office
  ps: string; // Police Station
  pinCode: string;
  district: string;
  state: string;
  presentAddress?: string;
  address: string; // Combined / full address
  phone: string;
  email: string;
}

export interface OppositeParty {
  name: string;
  through: string; // e.g. "its Branch Manager" or "its Managing Director"
  address: string; // Situated at
  phone?: string;
  email?: string;
}

export interface CaseDetails {
  commissionName: string; // e.g. "DISTRICT CONSUMER DISPUTE REDRESSAL COMMISSION"
  commissionPlace: string; // e.g. "NEW DELHI" or blank
  commissionState?: string; // Selected State / UT for commission
  commissionDistrict?: string; // Selected District for commission
  complaintNo: string; // e.g. "_____ OF 2026"
  complaintYear: string; // e.g. "2026"
  totalConsideration: string; // e.g. "25,00,000"
  totalConsiderationWords: string; // e.g. "Twenty Five Lakh"
  claimedAmount: string; // e.g. "25,00,000"
  claimedAmountWords: string; // e.g. "Twenty Five Lakh"
  // Goods / Services Amount Breakdown (Website UI only)
  valueOfGoods?: string;
  considerationAmount?: string;
  compensationAmount?: string;
  litigationAmount?: string;
  interestRate: string; // e.g. "12"
  interestFromDate: string; // e.g. "15/04/2023"
  category: string; // e.g. "Insurance", "Housing", "Medical"
  section: string; // e.g. "Section 35(1)(a)"
  sectionsList: string[]; // ['Section 35(1)(a)', 'Section 35(1)(b)', 'Section 35(1)(c)']
  // Housing specific fields
  hasHousingProject?: string; // 'N/A' | 'Yes'
  projectName?: string;
  projectMentionPage?: string;
  refundOrPossession?: string;
  pendingHousingComplaints?: string;
  // Proforma legal fields
  pendingIdenticalLaw: string;
  dateOfCauseOfAction: string;
  stateOfCauseOfAction: string;
  districtOfCauseOfAction: string;
  hasDelay?: string; // 'No' | 'Yes'
  delayDays?: string;
  limitationDelay: string;
  condonationApplicationAttached: string;
  documentsAttestedTrueCopies: string;
  englishTranslationsFiled: string;
  phoneEmailFiled: string;
  // Advocate details
  hasAdvocate?: string; // 'No' | 'Yes'
  advocateName: string;
  advocateAddress: string;
  advocatePhone: string;
  advocateEmail: string;
  // Optional petition page count for Court Index
  petitionPageCount?: number | string;
}

export interface EventEntry {
  date: string;
  description: string;
}

export interface Annexure {
  annexureNo?: string; // e.g. "Annexure-1"
  title: string;
  pageCount?: number | string; // Number of pages for this annexure (used dynamically in Index)
}

export interface ComplaintFormData {
  language?: 'hi' | 'en';
  complainants: Complainant[];
  oppositeParties: OppositeParty[];
  caseDetails: CaseDetails;
  events: EventEntry[];
  complaintBody: string; // Main body paragraphs
  witnesses: string[];
  prayer: string;
  prayerClaims?: {
    claimAmount?: string;
    claimAmountWords?: string;
    policyNo?: string;
    interestRate?: string;
    interestFromDate?: string;
    compensationAmount?: string;
    compensationAmountWords?: string;
    litigationCosts?: string;
    litigationCostsWords?: string;
  };
  verification: string; 
  verificationPlace: string;
  verificationDate: string;
  affidavit: string;
  affidavitDate: string;
  annexures: Annexure[];
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
