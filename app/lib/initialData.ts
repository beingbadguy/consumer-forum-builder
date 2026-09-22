import { ComplaintFormData } from '../types/complaint';

export const EMPTY_FORM_DATA: ComplaintFormData = {
  complainants: [
    {
      name: '',
      relationType: 'W/O',
      parentName: '',
      village: '',
      po: '',
      ps: '',
      pinCode: '',
      district: '',
      state: '',
      presentAddress: '',
      address: '',
      phone: '',
      email: '',
    },
  ],
  oppositeParties: [
    {
      name: '',
      through: 'its Branch Manager / Authorized Signatory',
      address: '',
      phone: '',
      email: '',
    },
  ],
  caseDetails: {
    commissionName: 'DISTRICT CONSUMER DISPUTE REDRESSAL COMMISSION',
    commissionPlace: '',
    complaintNo: '',
    complaintYear: new Date().getFullYear().toString(),
    totalConsideration: '',
    totalConsiderationWords: '',
    claimedAmount: '',
    claimedAmountWords: '',
    interestRate: '12',
    interestFromDate: '',
    category: 'Insurance',
    section: 'Section 35(I) (a)',
    sectionsList: ['Section 35(I) (a)'],
    projectName: '',
    refundOrPossession: '',
    pendingHousingComplaints: 'N/A',
    pendingIdenticalLaw: 'None',
    dateOfCauseOfAction: '',
    stateOfCauseOfAction: '',
    districtOfCauseOfAction: '',
    limitationDelay: 'No delay. Complaint filed within the statutory limitation period of 2 years under Section 69 of Consumer Protection Act, 2019.',
    condonationApplicationAttached: 'No (Filed within limitation)',
    documentsAttestedTrueCopies: 'Yes',
    englishTranslationsFiled: 'Yes',
    phoneEmailFiled: 'Yes',
    advocateName: '',
    advocateAddress: '',
    advocatePhone: '',
    advocateEmail: '',
  },
  events: [
    { date: '', description: 'Policy commencement / risk coverage date' },
    { date: '', description: 'Date of death of L.A.' },
    { date: '', description: 'Date on which claim was repudiated' },
  ],
  complaintBody: '',
  witnesses: ['The Complainant herself.', 'Other independent witness(es), if any.'],
  prayer: '',
  prayerClaims: {
    claimAmount: '',
    claimAmountWords: '',
    policyNo: '',
    interestRate: '12',
    interestFromDate: '',
    compensationAmount: '',
    compensationAmountWords: '',
    litigationCosts: '',
    litigationCostsWords: '',
  },
  verification: '',
  verificationPlace: '',
  verificationDate: new Date().toISOString().split('T')[0],
  affidavit: '',
  affidavitDate: new Date().toISOString().split('T')[0],
  annexures: [
    { annexureNo: 'Annexure-1', title: '' },
    { annexureNo: 'Annexure-2', title: '' },
    { annexureNo: 'Annexure-3', title: '' },
    { annexureNo: 'Annexure-4', title: '' },
  ],
};

export const SAMPLE_FORM_DATA: ComplaintFormData = {
  complainants: [
    {
      name: 'Sunita Devi',
      relationType: 'W/O',
      parentName: 'Late Ramesh Kumar',
      village: 'Rampur',
      po: 'Rampur',
      ps: 'Danapur',
      pinCode: '801503',
      district: 'Patna',
      state: 'Bihar',
      presentAddress: 'House No. 42, Anand Nagar, Bailey Road, Patna - 800014',
      address: 'Village Rampur, P.O. Rampur, P.S. Danapur, District Patna, Bihar - 801503',
      phone: '9835012345',
      email: 'sunitadevi.patna@gmail.com',
    },
  ],
  oppositeParties: [
    {
      name: 'HDFC Life Insurance Company Limited',
      through: 'its Branch Manager',
      address: '2nd Floor, Grand Plaza, Fraser Road, Patna, Bihar - 800001',
      phone: '06122234567',
      email: 'claims@hdfclife.com',
    },
    {
      name: 'HDFC Standard Life Insurance Company Limited',
      through: 'its Managing Director & CEO',
      address: 'Lodha Excelus, 13th Floor, Apollo Mills Compound, N.M. Joshi Marg, Mahalaxmi, Mumbai - 400011',
      phone: '02267516666',
      email: 'service@hdfclife.com',
    },
  ],
  caseDetails: {
    commissionName: 'DISTRICT CONSUMER DISPUTE REDRESSAL COMMISSION',
    commissionPlace: 'PATNA',
    complaintNo: '142',
    complaintYear: '2024',
    totalConsideration: '1,20,000',
    totalConsiderationWords: 'One Lakh Twenty Thousand',
    claimedAmount: '25,00,000',
    claimedAmountWords: 'Twenty Five Lakh',
    interestRate: '12',
    interestFromDate: '15/04/2023',
    category: 'Insurance',
    section: 'Section 35(I) (a)',
    sectionsList: ['Section 35(I) (a)'],
    projectName: '',
    refundOrPossession: '',
    pendingHousingComplaints: 'N/A',
    pendingIdenticalLaw: 'None',
    dateOfCauseOfAction: '14/09/2023',
    stateOfCauseOfAction: 'Bihar',
    districtOfCauseOfAction: 'Patna',
    limitationDelay: 'No delay. Complaint filed within 2 years from date of repudiation under Section 69.',
    condonationApplicationAttached: 'No (Filed within limitation)',
    documentsAttestedTrueCopies: 'Yes',
    englishTranslationsFiled: 'Yes',
    phoneEmailFiled: 'Yes',
    advocateName: 'Rajesh Kumar Singh',
    advocateAddress: 'Chamber No. 44, Bar Association Building, Civil Court, Patna - 800004',
    advocatePhone: '9431098765',
    advocateEmail: 'rksingh.adv@patnabar.in',
  },
  events: [
    {
      date: '10/01/2021',
      description: 'Policy commencement / risk coverage date under Policy No. 23891044',
    },
    {
      date: '15/04/2023',
      description: 'Date of sudden unfortunate death of Life Assured Late Ramesh Kumar due to cardiac arrest',
    },
    {
      date: '14/09/2023',
      description: 'Date on which legitimate death claim was repudiated arbitrarily by the Opposite Party',
    },
    {
      date: '12/11/2023',
      description: 'Legal Notice issued to Opposite Parties demanding payment of full death claim',
    },
  ],
  complaintBody: `1. That the Complainant is the legally wedded wife and sole nominee of the deceased Life Assured, Late Ramesh Kumar, who had obtained a Life Insurance Policy bearing No. 23891044 with sum assured of Rs. 25,00,000/- from the Opposite Parties.

2. That the Life Assured had regularly paid all annual premiums amounting to Rs. 1,20,000/- as consideration, and the subject policy was fully active and in force on the date of death of the Life Assured.

3. That unfortunately on 15/04/2023, the Life Assured suffered a sudden fatal cardiac arrest and passed away. The Complainant being the sole nominee submitted the original death certificate along with all necessary claim forms and hospital discharge documents to the Opposite Party No. 1.

4. That to the shock of the Complainant, Opposite Party No. 1 vide letter dated 14/09/2023 arbitrarily and maliciously repudiated the claim on baseless and hyper-technical grounds of non-disclosure, without any medical evidence.

5. That the arbitrary repudiation constitutes severe deficiency in service and unfair trade practice under Section 2(11) and Section 2(47) of the Consumer Protection Act, 2019.

6. That the cause of action first arose on 15/04/2023 and subsequently on 14/09/2023 when the claim was repudiated. The complaint is filed within the 2-year limitation period. This Hon'ble Commission has full territorial and pecuniary jurisdiction.`,
  witnesses: ['The Complainant herself.', 'Other independent witness(es), if any.'],
  prayer: `(i) Direct the Opposite Parties, jointly and severally, to honour the insurance contract and pay to the complainant the Death Claim amount of Rs. 25,00,000/- (Rupees Twenty Five Lakh only) payable under Policy No. 23891044, together with interest @ 12% per annum from the date of death of the Life Assured, i.e., 15/04/2023, till the date of actual payment, along with all consequential contractual benefits admissible under the policy.

(ii) Direct the Opposite Parties, jointly and severally, to pay a sum of Rs. 3,00,000/- (Rupees Three Lakh only) to the complainant as compensation for the immense mental agony, physical harassment, financial hardship and emotional trauma suffered by her due to the illegal repudiation of the genuine insurance claim, together with interest @ 12% per annum from the date of death of the Life Assured, i.e., 15/04/2023, till the date of actual payment.

(iii) Direct the Opposite Parties to pay Rs. 50,000/- (Rupees Fifty Thousand only) towards litigation expenses and incidental costs incurred by the complainant.

(iv) Pass any other or further order(s), direction(s) or relief(s) as this Hon'ble Commission may deem fit and proper in the facts and circumstances of the case.`,
  prayerClaims: {
    claimAmount: '25,00,000',
    claimAmountWords: 'Twenty Five Lakh',
    policyNo: '23891044',
    interestRate: '12',
    interestFromDate: '15/04/2023',
    compensationAmount: '3,00,000',
    compensationAmountWords: 'Three Lakh',
    litigationCosts: '50,000',
    litigationCostsWords: 'Fifty Thousand',
  },
  verification: `the above-named complainant, do hereby verify that the statements made in paragraphs 1 to 6 of the accompanying complaint are true and correct to my personal knowledge, information and belief and the records of the case, and that nothing material has been concealed or suppressed therefrom.`,
  verificationPlace: 'Patna',
  verificationDate: '2024-03-15',
  affidavit: `1. That I am the complainant in the accompanying consumer complaint and, being fully acquainted with the facts and circumstances of the case, I am competent to swear this affidavit.
2. That I have read and understood the contents of the accompanying consumer complaint, and the statements made in paragraphs 1 to 6 thereof are true and correct to my personal knowledge, information and belief.
3. That all the annexures annexed with the accompanying complaint are true Xerox copies of their respective originals and are relied upon in support of the present complaint.
4. That the statements made in the accompanying complaint are true and correct, and nothing material has been concealed or suppressed therefrom.
5. That this affidavit is being sworn for the purpose of supporting the accompanying consumer complaint and the documents annexed thereto before this Hon'ble Commission.`,
  affidavitDate: '2024-03-15',
  annexures: [
    {
      annexureNo: 'Annexure-1',
      title: 'Copy of Insurance Policy Schedule bearing Policy No. 23891044',
    },
    {
      annexureNo: 'Annexure-2',
      title: 'Copies of Premium Payment Receipts showing continuous policy in force',
    },
    {
      annexureNo: 'Annexure-3',
      title: 'Copy of Death Certificate of Life Assured Late Ramesh Kumar issued by Municipal Corporation',
    },
    {
      annexureNo: 'Annexure-4',
      title: 'Copy of Claim Intimation Form along with acknowledgment of submission',
    },
    {
      annexureNo: 'Annexure-5',
      title: 'Copy of Medical Treatment Records & Hospital Certificate regarding cause of death',
    },
    {
      annexureNo: 'Annexure-6',
      title: 'Copy of Repudiation Letter dated 14/09/2023 issued by Opposite Party',
    },
    {
      annexureNo: 'Annexure-7',
      title: 'Copy of Legal Notice dated 12/11/2023 served upon Opposite Parties',
    },
    {
      annexureNo: 'Annexure-8',
      title: 'Copy of Postal Speed Post Receipts and Tracking Delivery Confirmations',
    },
  ],
};
