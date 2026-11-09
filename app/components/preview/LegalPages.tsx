'use client';

import React from 'react';
import { ComplaintFormData, OppositeParty } from '../../types/complaint';
import { convertNumberToIndianWords } from '../../lib/numberToWords';

export interface LegalPagesProps {
  data: ComplaintFormData;
  pageFilter?: number | string | null; // null means show all pages, 'index' means only index
  numberingMode?: 'proforma1' | 'consecutive';
}

function toRoman(num: number): string {
  const romanLookup: [number, string][] = [
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']
  ];
  let result = '';
  for (const [val, sym] of romanLookup) {
    while (num >= val) {
      result += sym;
      num -= val;
    }
  }
  return result;
}

const opSuffix = (ops: OppositeParty[], isEn = true) => {
  if (ops.length <= 1) return '';
  if (isEn) {
    if (ops.length === 2) return ' & Another';
    return ' & Others';
  }
  if (ops.length === 2) return ' एवं अन्य';
  return ' एवं अन्यगण';
};

const CATEGORY_LABELS_HI: Record<string, string> = {
  'Insurance': 'बीमा विवाद (Insurance)',
  'Housing': 'आवास / रियल एस्टेट (Housing)',
  'Banking & Financial Services': 'बैंकिंग एवं वित्तीय सेवाएं (Banking & Financial Services)',
  'Defective Goods / Manufacturing Defect': 'दोषपूर्ण उत्पाद / निर्माण दोष (Defective Goods)',
  'Deficiency in Service': 'सेवा में कमी (Deficiency in Service)',
  'E-Commerce & Online Orders': 'ई-कॉमर्स एवं ऑनलाइन ऑर्डर (E-Commerce)',
  'Medical Negligence & Healthcare': 'चिकित्सा लापरवाही एवं अस्पताल (Medical Negligence)',
  'Airlines & Travel': 'एयरलाइंस एवं यात्रा (Airlines & Travel)',
  'Telecommunications': 'दूरसंचार एवं मोबाइल सेवाएं (Telecommunications)',
  'Automobiles & Vehicles': 'वाहन एवं ऑटोमोबाइल (Automobiles)',
  'Education & Coaching': 'शिक्षा एवं कोचिंग संस्थान (Education & Coaching)',
  'Other Consumer Disputes': 'अन्य उपभोक्ता विवाद (Other Consumer Disputes)',
};

function formatRelation(relationType?: string, isEn = true): string {
  if (isEn) {
    if (relationType === 'W/O') return 'wife of';
    if (relationType === 'S/O') return 'son of';
    if (relationType === 'D/O') return 'daughter of';
    if (relationType === 'C/O') return 'care of';
    return relationType || 'wife/son/daughter of';
  }
  if (relationType === 'W/O') return 'पत्नी';
  if (relationType === 'S/O') return 'पुत्र';
  if (relationType === 'D/O') return 'पुत्री';
  if (relationType === 'C/O') return 'देखरेख';
  return 'पुत्र / पुत्री / पत्नी';
}

function parseCurrencyNumber(val?: string): number {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function formatToIndianCurrency(num: number): string {
  if (num === 0) return '';
  const parts = Math.round(num).toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + decimalPart;
}

export const LegalPages: React.FC<LegalPagesProps> = ({
  data,
  pageFilter,
  numberingMode = 'proforma1',
}) => {
  const cd = data.caseDetails;
  const isEn = data.language === 'en';
  const isConsecutive = numberingMode === 'consecutive';
  const offset = isConsecutive ? 1 : 0;

  const considerationDisplay = cd.totalConsideration || cd.valueOfGoods || cd.considerationAmount;
  const considerationWordsDisplay =
    cd.totalConsiderationWords || (considerationDisplay ? convertNumberToIndianWords(considerationDisplay) : undefined);

  const calcClaimed =
    parseCurrencyNumber(cd.valueOfGoods) +
    parseCurrencyNumber(cd.compensationAmount || cd.considerationAmount) +
    parseCurrencyNumber(cd.litigationAmount);
  const claimedDisplay = cd.claimedAmount || (calcClaimed > 0 ? formatToIndianCurrency(calcClaimed) : undefined);
  const claimedWordsDisplay =
    cd.claimedAmountWords || (claimedDisplay ? convertNumberToIndianWords(claimedDisplay) : undefined);

  const compDisplay = cd.compensationAmount || cd.considerationAmount;
  const compWordsDisplay = compDisplay ? convertNumberToIndianWords(compDisplay) : undefined;

  const valueOfGoodsWordsDisplay = cd.valueOfGoods ? convertNumberToIndianWords(cd.valueOfGoods) : undefined;
  const litigationWordsDisplay = cd.litigationAmount ? convertNumberToIndianWords(cd.litigationAmount) : undefined;

  // Filter valid annexures entered by the user
  const validAnnexures = (data.annexures || []).filter(
    (a) => (a.title && a.title.trim().length > 0) || (a.annexureNo && a.annexureNo.trim().length > 0)
  );

  interface IndexRowItem {
    sNo: number;
    title: string;
    description?: string;
    pageStr: string;
  }

  const indexRows: IndexRowItem[] = [];
  let currentSNo = 1;

  if (isConsecutive) {
    indexRows.push({
      sNo: currentSNo++,
      title: isEn ? 'INDEX' : 'अनुक्रमणिका (INDEX)',
      description: isEn ? 'Tabular list of petition contents with dynamic page references' : 'याचिका की विषय-सूची एवं संबंधित पृष्ठ संख्या',
      pageStr: '1',
    });
  }

  indexRows.push({
    sNo: currentSNo++,
    title: isEn
      ? 'Proforma for Filing Consumer Complaint (Part 1 & 2)'
      : 'उपभोक्ता परिवाद दाखिल करने हेतु प्रपत्र (भाग 1 व 2)',
    description: isEn
      ? 'Commission proforma with statutory declarations & verification'
      : 'सांविधिक घोषणाओं एवं सत्यापन सहित आयोग प्रपत्र',
    pageStr: `${1 + offset} – ${2 + offset}`,
  });

  indexRows.push({
    sNo: currentSNo++,
    title: isEn
      ? 'List of Dates & Events'
      : 'तारीखों एवं घटनाओं का कालानुक्रमिक विवरण (Dates & Events)',
    description: isEn
      ? 'Chronological summary of material dates and occurrences leading to dispute'
      : 'विवाद से संबंधित प्रमुख घटनाओं एवं तिथियों का कालक्रम',
    pageStr: `${3 + offset}`,
  });

  indexRows.push({
    sNo: currentSNo++,
    title: isEn
      ? 'Memo of Parties'
      : 'पक्षकारों का ज्ञापन (Memo of Parties)',
    description: isEn
      ? 'Names, addresses, and official contact details of Complainants & Opposite Parties'
      : 'परिवादी एवं विपक्षीगण के पूर्ण नाम, पते एवं संपर्क विवरण',
    pageStr: `${4 + offset}`,
  });

  // Count and prepare total complaint paragraphs
  const paragraphs = data.complaintBody
    ? data.complaintBody.split('\n\n').filter((p) => p.trim().length > 0)
    : [];
  const paraCount = paragraphs.length > 0 ? paragraphs.length.toString() : '4';

  const defaultParagraphs = isEn
    ? [
        '1. That the Complainant is a consumer within the meaning of Section 2(7) of the Consumer Protection Act, 2019, having paid valuable consideration to the Opposite Parties for goods/services.',
        '2. That the Opposite Parties committed gross deficiency in service under Section 2(11) and unfair trade practice under Section 2(47) of the Act by failing to honor their contractual obligations.',
        '3. That the cause of action first arose on dates specified in the List of Dates and Events and the complaint is filed within the limitation period under Section 69.',
        "4. That this Hon'ble Commission has full territorial and pecuniary jurisdiction to entertain, try, and adjudicate upon the present complaint.",
      ]
    : [
        '1. यह कि परिवादी उपभोक्ता संरक्षण अधिनियम, 2019 की धारा 2(7) के अंतर्गत उपभोक्ता है, जिसने विपक्षीगण को उचित प्रतिफल देकर सेवाएं/सामान प्राप्त किए हैं।',
        '2. यह कि विपक्षीगण ने परिवाद पत्र में वर्णित संविदात्मक एवं वैधानिक दायित्वों का उल्लंघन करते हुए अधिनियम की धारा 2(11) के तहत सेवा में घोर कमी एवं धारा 2(47) के तहत अनुचित व्यापार व्यवहार किया है।',
        '3. यह कि वाद कारण की उत्पत्ति तारीखों व घटनाओं की सूची में वर्णित तिथियों पर हुई तथा परिवाद धारा 69 के अंतर्गत विहित 2 वर्ष की सांविधिक परिसीमा के भीतर दायर किया गया है।',
        '4. यह कि इस माननीय आयोग को प्रस्तुत परिवाद की सुनवाई, विचारण एवं न्यायनिर्णयन करने का पूर्ण प्रादेशिक एवं आर्थिक क्षेत्राधिकार प्राप्त है।',
      ];

  const factsList = paragraphs.length > 0 ? paragraphs : defaultParagraphs;

  // Calibrate precise A4 vertical printable capacity for Petition
  // An A4 sheet is 297mm high. With 22mm top + 20mm bottom padding and 12mm footer,
  // printable content budget is ~230mm.
  const SHEET_MAX_CONTENT_MM = 228;

  // Exact millimeter height of Sheet 1 fixed sections:
  const sheet1FixedMm =
    22 + // Court heading, Case No, Section 35 title
    24 + Math.min(data.oppositeParties.length, 3) * 14 + // Complainant & OPs
    (cd.valueOfGoods || cd.compensationAmount || cd.litigationAmount ? 34 : 22) + // Valuation
    14 + Math.min(validAnnexures.length, 3) * 5 + // Evidence & Annexures
    16 + // Witnesses in favour of complainant
    12; // MOST RESPECTFULLY SHOWETH heading

  // Available room on Sheet 1 for facts (keep under 195mm to leave comfortable breathing room)
  let currentSheet1Mm = sheet1FixedMm;
  const sheet1Facts: string[] = [];
  const overflowFacts: string[] = [];

  for (const p of factsList) {
    // Estimated height of paragraph: ~5mm per line (approx 85 characters per line at 11.5pt) + 4mm gap
    const pMm = Math.max(12, Math.ceil(p.length / 85) * 5 + 4);
    if (currentSheet1Mm + pMm <= 195) {
      sheet1Facts.push(p);
      currentSheet1Mm += pMm;
    } else {
      overflowFacts.push(p);
    }
  }

  // Calculate Sheet 2 capacity
  const overflowFactsMm = overflowFacts.reduce(
    (sum, p) => sum + Math.max(12, Math.ceil(p.length / 85) * 5 + 4),
    0
  );

  const customPrayerLines = data.prayer ? Math.ceil(data.prayer.length / 85) : 0;
  const prayerMm = customPrayerLines > 0 ? customPrayerLines * 5 + 45 : 98; // Title, claims, kindness, signatures
  const verificationMm = 74; // Title, text, verified at, signature

  // Does Verification fit cleanly on Sheet 2 alongside overflow facts and Prayer?
  // We keep Sheet 2 under SHEET_MAX_CONTENT_MM (228mm) so it NEVER overflows onto an extra sheet
  const verificationOnSheet2 = (overflowFactsMm + prayerMm + verificationMm) <= SHEET_MAX_CONTENT_MM;
  const petitionSheetsCount = verificationOnSheet2 ? 2 : 3;

  // Consumer Complaint Petition (facts, grounds, prayer & verification flow intact across flexible A4 sheets)
  const petitionPages = petitionSheetsCount;
  const petitionStartPage = 5 + offset;
  const petitionEndPage = petitionStartPage + petitionPages - 1;
  const petitionPageStr = `${petitionStartPage} – ${petitionEndPage}`;

  indexRows.push({
    sNo: currentSNo++,
    title: isEn
      ? 'Consumer Complaint Petition under Section 35 of CPA, 2019'
      : 'उपभोक्ता परिवाद पत्र (धारा 35, उपभोक्ता संरक्षण अधिनियम, 2019)',
    description: isEn
      ? 'Statement of facts, deficiency in service, prayer clause & verification'
      : 'तथ्य, सेवा में कमी, अनुचित व्यापार व्यवहार, प्रार्थना एवं सत्यापन',
    pageStr: petitionPageStr,
  });

  const affidavitPage = petitionEndPage + 1;
  indexRows.push({
    sNo: currentSNo++,
    title: isEn
      ? 'Affidavit in Support of Complaint'
      : 'परिवाद के समर्थन में शपथ पत्र (Affidavit in Support)',
    description: isEn
      ? 'Deposition sworn on oath before Notary / Oath Commissioner under Rule 14'
      : 'उपभोक्ता संरक्षण नियमावली के नियम 14 के तहत नोटरीकृत शपथ पत्र',
    pageStr: `${affidavitPage}`,
  });

  let currentAnnexureStartPage = affidavitPage + 1;

  validAnnexures.forEach((ann, idx) => {
    const pageCount = Math.max(1, parseInt(String(ann.pageCount || 1), 10) || 1);
    const startPage = currentAnnexureStartPage;
    const endPage = startPage + pageCount - 1;
    const pageStr = pageCount === 1 ? `${startPage}` : `${startPage} – ${endPage}`;

    indexRows.push({
      sNo: currentSNo++,
      title: `${ann.annexureNo || (isEn ? `Annexure-${idx + 1}` : `संलग्नक-${idx + 1}`)}: ${ann.title ? ann.title : (isEn ? 'Supporting Document / Evidence' : 'साक्ष्य / दस्तावेज')}`,
      description: isEn
        ? `Attested True Copy (${pageCount} ${pageCount === 1 ? 'Page' : 'Pages'})`
        : `सत्यापित सत्य प्रतिलिपि (${pageCount} ${pageCount === 1 ? 'पृष्ठ' : 'पृष्ठ'})`,
      pageStr,
    });

    currentAnnexureStartPage = endPage + 1;
  });

  const totalAnnexurePages = validAnnexures.reduce(
    (acc, ann) => acc + (Math.max(1, parseInt(String(ann.pageCount || 1), 10) || 1)),
    0
  );
  const totalPages = affidavitPage + totalAnnexurePages;

  const currentFilingYear =
    cd.complaintYear && cd.complaintYear.trim().length === 4 && Number(cd.complaintYear) >= 2024
      ? cd.complaintYear.trim()
      : new Date().getFullYear().toString();

  const primaryComplainant = data.complainants[0] || {
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
  };

  const primaryOp = data.oppositeParties[0] || {
    name: '',
    through: '',
    address: '',
  };

  // Helper to format blank or value
  const fill = (val?: string, blankCount = 20) => {
    if (val && val.trim().length > 0) {
      return <span className="font-semibold underline text-black">{val}</span>;
    }
    return <span>{'_'.repeat(blankCount)}</span>;
  };

  const MONTH_NAMES_EN = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const MONTH_NAMES_HI = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  // Helper to format date parts
  const parseDate = (dStr?: string) => {
    if (!dStr || !dStr.trim()) return { day: '____', month: '________________', year: '____' };
    const trimmed = dStr.trim();
    const months = isEn ? MONTH_NAMES_EN : MONTH_NAMES_HI;

    // Check DD/MM/YYYY
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(trimmed)) {
      const [d, m, y] = trimmed.split(/[\/\-]/).map(Number);
      const monthName = months[m - 1] || String(m);
      return { day: String(d), month: monthName, year: String(y) };
    }

    // Check YYYY-MM-DD
    if (/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split(/[\/\-]/).map(Number);
      const monthName = months[m - 1] || String(m);
      return { day: String(d), month: monthName, year: String(y) };
    }

    const dateObj = new Date(trimmed);
    if (!isNaN(dateObj.getTime())) {
      const day = dateObj.getDate().toString();
      const month = isEn ? dateObj.toLocaleString('en-US', { month: 'long' }) : months[dateObj.getMonth()];
      const year = dateObj.getFullYear().toString();
      return { day, month, year };
    }

    return { day: trimmed, month: '', year: '' };
  };

  const verDate = parseDate(data.verificationDate);
  const affDate = parseDate(data.affidavitDate);

  // Slicing Annexures for backward compatibility
  const annexuresPage5 = validAnnexures.slice(0, 4);
  const annexuresPage6 = validAnnexures.slice(4);

  return (
    <div className="flex flex-col items-center">
      {/* ================= PAGE 0: INDEX PAGE ================= */}
      {(!pageFilter || pageFilter === 'index' || pageFilter === 0) && (
        <div className="legal-a4-sheet" id="legal-page-index">
          <div className="text-center font-bold tracking-wide text-[13pt] uppercase mb-1">
            {cd.commissionName
              ? cd.commissionName
              : isEn
              ? 'DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION'
              : 'जिला उपभोक्ता विवाद प्रतितोष आयोग'}
          </div>
          <div className="text-center text-[12pt] font-semibold mb-3">
            {cd.commissionPlace ? `${cd.commissionPlace}` : '________________________'}
          </div>

          <div className="text-center font-bold text-[11.5pt] mb-3">
            {isEn ? (
              <>CONSUMER COMPLAINT NO. {cd.complaintNo ? <span className="underline font-bold">{cd.complaintNo}</span> : '................................'} OF {currentFilingYear}</>
            ) : (
              <>उपभोक्ता परिवाद वाद संख्या: {cd.complaintNo ? <span className="underline font-bold">{cd.complaintNo}</span> : '................................'} वर्ष {currentFilingYear}</>
            )}
          </div>

          {/* Cause Title / Memo */}
          <div className="border-t border-b border-black py-2 mb-3 text-[11pt]">
            <div className="text-center text-[10.5pt] font-bold uppercase tracking-wider mb-1.5">
              {isEn ? 'IN THE MATTER OF:' : 'मामले में (IN THE MATTER OF):'}
            </div>
            <div className="flex justify-between items-baseline">
              <div className="font-semibold">
                {primaryComplainant.name || '________________________'}
                {data.complainants.length > 1 ? (isEn ? ` & ${data.complainants.length - 1} Others` : ` एवं ${data.complainants.length - 1} अन्य`) : ''}
              </div>
              <div className="font-bold whitespace-nowrap">{isEn ? '... COMPLAINANT(S)' : '... परिवादी'}</div>
            </div>
            <div className="text-center font-bold text-[10.5pt] my-1">
              {isEn ? 'VERSUS' : 'बनाम (VERSUS)'}
            </div>
            <div className="flex justify-between items-baseline">
              <div className="font-semibold">
                {primaryOp.name || '________________________'}{opSuffix(data.oppositeParties, isEn)}
              </div>
              <div className="font-bold whitespace-nowrap">{isEn ? '... OPPOSITE PARTY/PARTIES' : '... विपक्षीगण'}</div>
            </div>
          </div>

          <div className="text-center font-bold text-[13pt] uppercase underline tracking-wider my-3">
            {isEn ? 'INDEX' : 'अनुक्रमणिका (INDEX)'}
          </div>

          {/* Index Table */}
          <table className="legal-table w-full">
            <thead>
              <tr className="bg-slate-50 font-bold">
                <th className="w-14 text-center border border-black py-1.5 text-[10.5pt]">
                  {isEn ? 'Sl. No.' : 'क्र. सं.'}
                </th>
                <th className="text-center border border-black py-1.5 text-[10.5pt]">
                  {isEn ? 'Particulars of Documents' : 'प्रपत्रों / दस्तावेजों का विवरण'}
                </th>
                <th className="w-28 text-center border border-black py-1.5 text-[10.5pt]">
                  {isEn ? 'Page No.' : 'पृष्ठ सं.'}
                </th>
              </tr>
            </thead>
            <tbody>
              {indexRows.map((row) => (
                <tr key={row.sNo}>
                  <td className="w-14 text-center font-semibold text-[10.5pt] border border-black py-1">{row.sNo}.</td>
                  <td className="text-[10.5pt] leading-tight border border-black px-2 py-1">
                    <div className="font-semibold">{row.title}</div>
                    {row.description && (
                      <div className="text-[9pt] text-slate-700 font-normal mt-0.5">{row.description}</div>
                    )}
                  </td>
                  <td className="w-28 text-center font-bold text-[10.5pt] border border-black py-1 whitespace-nowrap">{row.pageStr}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signatures & Verification */}
          <div className="mt-8 flex justify-between items-end text-[11pt]">
            <div className="space-y-1">
              <div>{isEn ? 'Place: ' : 'स्थान: '}{fill(data.verificationPlace || primaryComplainant.district, 20)}</div>
              <div>{isEn ? 'Date: ' : 'दिनांक: '}{fill(data.verificationDate, 15)}</div>
            </div>

            <div className="text-center space-y-1">
              <div className="font-mono text-slate-600 mb-1">...................................................</div>
              <div>({fill(primaryComplainant.name, 25)})</div>
              {cd.hasAdvocate === 'Yes' || (!cd.hasAdvocate && cd.advocateName) ? (
                <>
                  <div className="font-semibold text-[10.5pt]">{isEn ? 'Through Counsel' : 'द्वारा अधिवक्ता'}</div>
                  <div className="font-bold text-[11pt] mt-1">{fill(cd.advocateName, 25)}</div>
                  <div className="font-bold text-[10.5pt]">{isEn ? 'Advocate' : 'अधिवक्ता'}</div>
                </>
              ) : (
                <div className="font-bold text-[10.5pt] mt-1">{isEn ? 'Complainant in Person' : 'परिवादी (व्यक्तिगत रूप से)'}</div>
              )}
            </div>
          </div>

          <div className="text-right text-[10pt] text-slate-500 mt-6">
            {isConsecutive ? (isEn ? `Page 1 of ${totalPages}` : `पृष्ठ 1 / ${totalPages}`) : (isEn ? 'Index Page' : 'अनुक्रमणिका पृष्ठ')}
          </div>
        </div>
      )}

      {/* ================= PAGE 1 ================= */}
      {(!pageFilter || pageFilter === 1) && (
        <div className="legal-a4-sheet" id="legal-page-1">
          <div className="text-center font-bold tracking-wide text-[13pt] uppercase mb-1">
            {cd.commissionName
              ? cd.commissionName
              : isEn
              ? 'DISTRICT CONSUMER DISPUTE REDRESSAL COMMISSION'
              : 'जिला उपभोक्ता विवाद प्रतितोष आयोग'}
          </div>
          <div className="text-center text-[12pt] font-semibold mb-3">
            {cd.commissionPlace ? `${cd.commissionPlace}` : '________________________'}
          </div>

          <div className="text-center font-bold text-[12pt] uppercase underline tracking-wider mb-5">
            {isEn ? 'PROFORMA FOR FILING CONSUMER COMPLAINT' : 'उपभोक्ता परिवाद दाखिल करने हेतु प्रपत्र (PROFORMA)'}
          </div>

          <table className="legal-table">
            <tbody>
              <tr>
                <td className="w-1/2 font-bold align-top">
                  {isEn ? 'CONSUMER COMPLAINT No.' : 'उपभोक्ता परिवाद संख्या:'}
                </td>
                <td className="w-1/2 align-top font-bold">
                  {cd.complaintNo ? (
                    <span className="underline font-bold">{cd.complaintNo}</span>
                  ) : (
                    '................................'
                  )}{' '}
                  {isEn ? `OF ${currentFilingYear}` : `वर्ष ${currentFilingYear}`}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'Name and address of the complainant with telephone number(s) and e-mail.'
                    : 'परिवादी का नाम एवं पूर्ण पता, दूरभाष / मोबाइल नंबर एवं ई-मेल पता सहित।'}
                </td>
                <td className="w-1/2">
                  <div className="font-semibold">{primaryComplainant.name || '—'}</div>
                  <div className="text-[10pt] leading-tight mt-1">
                    {primaryComplainant.address ||
                      `${primaryComplainant.village ? (isEn ? 'Vill: ' : 'ग्राम: ') + primaryComplainant.village + ', ' : ''}${primaryComplainant.district ? primaryComplainant.district : ''}`}
                  </div>
                  {(primaryComplainant.phone || primaryComplainant.email) && (
                    <div className="text-[10pt] mt-1 text-slate-800">
                      {primaryComplainant.phone && <span>{isEn ? 'Mob: ' : 'मो.: '}{primaryComplainant.phone} </span>}
                      {primaryComplainant.email && <span>{isEn ? 'Email: ' : 'ईमेल: '}{primaryComplainant.email}</span>}
                    </div>
                  )}
                  {data.complainants.length > 1 && (
                    <div className="text-[9pt] italic mt-1 text-slate-600">
                      {isEn ? `(+ ${data.complainants.length - 1} more Complainant(s))` : `(+ ${data.complainants.length - 1} अन्य परिवादी)`}
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn ? 'Total Consideration paid' : 'कुल प्रतिफल राशि (Total Consideration Paid)'}
                </td>
                <td className="w-1/2">
                  {considerationDisplay ? `${isEn ? 'Rs. ' : 'रु. '}${considerationDisplay}/-` : '—'}
                  {considerationWordsDisplay && (
                    <span className="block text-[10pt] italic">
                      ({isEn ? 'Rupees ' : 'अक्षरे '}{considerationWordsDisplay}{isEn ? ' only' : ' रुपये मात्र'})
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn ? 'Claimed Amount' : 'कुल दावा राशि (Claimed Amount)'}
                </td>
                <td className="w-1/2">
                  {claimedDisplay ? `${isEn ? 'Rs. ' : 'रु. '}${claimedDisplay}/-` : '—'}
                  {claimedWordsDisplay && (
                    <span className="block text-[10pt] italic">
                      ({isEn ? 'Rupees ' : 'अक्षरे '}{claimedWordsDisplay}{isEn ? ' only' : ' रुपये मात्र'})
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'Nature of the consumer dispute involved (To indicate the category) Case Category (Whether Housing, Insurance, Medical etc.)'
                    : 'उपभोक्ता विवाद की प्रकृति / केस की श्रेणी (आवास, बीमा, चिकित्सा, बैंकिंग आदि)'}
                </td>
                <td className="w-1/2 font-semibold">
                  {isEn ? (cd.category || 'Insurance') : (CATEGORY_LABELS_HI[cd.category || ''] || cd.category || 'बीमा विवाद')}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'Project Name (relates to a housing category) (Indicate page no. where mentioned)'
                    : 'प्रोजेक्ट का नाम (यदि आवास विवाद से संबंधित हो) (पृष्ठ संख्या जहाँ उल्लेख है)'}
                </td>
                <td className="w-1/2">
                  {cd.hasHousingProject === 'Yes' || cd.category === 'Housing' || cd.projectName ? (
                    <span>
                      {cd.projectName || fill(undefined, 25)}
                      {cd.projectMentionPage && (
                        <span className="text-[10pt] text-slate-700 block">
                          ({isEn ? 'Page No: ' : 'पृष्ठ संख्या: '}{cd.projectMentionPage})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-slate-600">{isEn ? 'N/A (Not Housing dispute)' : 'लागू नहीं (आवास विवाद नहीं)'}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'For Refund/Possession/ return of principal amount/interest. (relates to a housing category)'
                    : 'धन वापसी / कब्जा / मूलधन वापसी / ब्याज (आवास श्रेणी हेतु)'}
                </td>
                <td className="w-1/2">
                  {cd.hasHousingProject === 'Yes' || cd.category === 'Housing'
                    ? cd.refundOrPossession || fill(undefined, 25)
                    : (isEn ? 'N/A' : 'लागू नहीं (N/A)')}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn ? 'Please specify section' : 'लागू कानूनी धारा निर्दिष्ट करें'}
                  <div className="font-normal text-[10.5pt] mt-1 space-y-0.5">
                    <div>{isEn ? 'Section 35(I) (a)' : 'धारा 35(1)(a)'}</div>
                    <div>{isEn ? 'Section 35(I) (b)' : 'धारा 35(1)(b)'}</div>
                    <div>{isEn ? 'Section 35(I) (c)' : 'धारा 35(1)(c)'}</div>
                  </div>
                </td>
                <td className="w-1/2 align-middle">
                  <div className="font-semibold">
                    {cd.section ||
                      (cd.sectionsList && cd.sectionsList.length > 0
                        ? cd.sectionsList.join(', ')
                        : (isEn ? 'Section 35(I) (a)' : 'धारा 35(1)(a)'))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'If the consumer dispute relates to a housing or land development project, details of the pending Consumer Complaint(s), if any, in respect of the same project.'
                    : 'यदि उपभोक्ता विवाद आवास अथवा भूमि विकास परियोजना से संबंधित है, तो उसी प्रोजेक्ट के संबंध में लंबित अन्य परिवादों का विवरण (यदि कोई हो)।'}
                </td>
                <td className="w-1/2">
                  {cd.pendingHousingComplaints || (isEn ? 'N/A' : 'लागू नहीं (N/A)')}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'Details of any pending/disposed of Consumer Complaint, if any, involving identical question of law.'
                    : 'समान कानूनी प्रश्न वाले किसी अन्य लंबित / निस्तारित परिवाद का विवरण (यदि कोई हो)।'}
                </td>
                <td className="w-1/2">
                  {cd.pendingIdenticalLaw || (isEn ? 'None' : 'कोई नहीं (N/A)')}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">{isEn ? 'Date of cause of action.' : 'वाद कारण उत्पन्न होने की तिथि।'}</td>
                <td className="w-1/2">{cd.dateOfCauseOfAction || '—'}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">{isEn ? 'State of cause of action.' : 'वाद कारण का राज्य (State)।'}</td>
                <td className="w-1/2">{cd.stateOfCauseOfAction || primaryComplainant.state || '—'}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">{isEn ? 'District of cause of action.' : 'वाद कारण का जिला (District)।'}</td>
                <td className="w-1/2">{cd.districtOfCauseOfAction || primaryComplainant.district || '—'}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'Delay, if any, computing the period of limitation, from the date of cause of action.'
                    : 'वाद कारण की तिथि से परिसीमा अवधि (2 वर्ष) की गणना में विलंब (यदि कोई हो)।'}
                </td>
                <td className="w-1/2">
                  {cd.limitationDelay || (cd.hasDelay === 'Yes'
                    ? (isEn ? 'Yes, delay occurred. Application for condonation of delay filed.' : 'हाँ, विलंब हुआ है। विलंब माफी का आवेदन संलग्न है।')
                    : (isEn ? 'No delay. Complaint filed within the statutory limitation period under Section 69.' : 'कोई विलंब नहीं। परिवाद उपभोक्ता संरक्षण अधिनियम, 2019 की धारा 69 के तहत 2 वर्ष की सांविधिक परिसीमा के भीतर दायर है।'))}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-right text-[10pt] text-slate-500 mt-2">
            {isConsecutive ? (isEn ? `Page ${1 + offset} of ${totalPages}` : `पृष्ठ ${1 + offset} / ${totalPages}`) : (isEn ? `Page 1 of ${totalPages}` : `पृष्ठ 1 / ${totalPages}`)}
          </div>
        </div>
      )}

      {/* ================= PAGE 2 ================= */}
      {(!pageFilter || pageFilter === 2) && (
        <div className="legal-a4-sheet" id="legal-page-2">
          <table className="legal-table">
            <tbody>
              <tr>
                <td className="w-1/2 font-bold align-top">
                  {isEn ? 'CONSUMER COMPLAINT No.' : 'उपभोक्ता परिवाद संख्या:'}
                </td>
                <td className="w-1/2 align-top font-bold">
                  {cd.complaintNo ? (
                    <span className="underline font-bold">{cd.complaintNo}</span>
                  ) : (
                    '................................'
                  )}{' '}
                  {isEn ? `OF ${currentFilingYear}` : `वर्ष ${currentFilingYear}`}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'In case of any delay, whether any application for condonation of delay in filing the Consumer Complaint is filed, is attached, with Notarised affidavit.'
                    : 'विलंब की स्थिति में, क्या परिवाद दाखिल करने में हुए विलंब की माफी हेतु नोटरीकृत शपथ पत्र सहित आवेदन संलग्न है?'}
                </td>
                <td className="w-1/2">
                  {cd.condonationApplicationAttached === 'Yes'
                    ? (isEn ? 'Yes (Attached with Notarised affidavit)' : 'हाँ (नोटरीकृत शपथ पत्र सहित संलग्न है)')
                    : cd.condonationApplicationAttached === 'No'
                    ? (isEn ? 'No' : 'नहीं')
                    : (isEn ? 'N/A' : 'लागू नहीं (N/A)')}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'Whether the documents filed are attested true copies?'
                    : 'क्या प्रस्तुत किए गए दस्तावेज सत्यापित सत्य प्रतिलिपि (Attested True Copies) हैं?'}
                </td>
                <td className="w-1/2 font-semibold">
                  {cd.documentsAttestedTrueCopies === 'No' ? (isEn ? 'No' : 'नहीं') : (isEn ? 'Yes' : 'हाँ')}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'Whether English translations of all the documents in vernacular, are filed?'
                    : 'क्या प्रादेशिक भाषा के सभी दस्तावेजों का अनुवाद संलग्न किया गया है?'}
                </td>
                <td className="w-1/2">
                  {cd.englishTranslationsFiled === 'Yes' ? (isEn ? 'Yes' : 'हाँ') : (isEn ? 'N/A' : 'लागू नहीं (N/A)')}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'Telephone Number (s) (Landline as well as Mobile) and e-mail address, are filed?'
                    : 'क्या दूरभाष नंबर (लैंडलाइन अथवा मोबाइल) एवं ई-मेल पता दर्ज किया गया है?'}
                </td>
                <td className="w-1/2 font-semibold">
                  {cd.phoneEmailFiled === 'No' ? (isEn ? 'No' : 'नहीं') : (isEn ? 'Yes' : 'हाँ')}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  {isEn
                    ? 'Name, address, telephone Nos. (Landline as well as Mobile) and e-mail address of the Advocate for the Complainant.'
                    : 'परिवादी के अधिवक्ता का नाम, पता, दूरभाष / मोबाइल नंबर एवं ई-मेल पता।'}
                </td>
                <td className="w-1/2">
                  {cd.hasAdvocate === 'No' || (!cd.hasAdvocate && !cd.advocateName) ? (
                    <div className="font-semibold text-slate-800">
                      {isEn ? 'N/A (Filed in Person — No Advocate engaged)' : 'लागू नहीं (व्यक्तिगत रूप से परिवादी द्वारा दायर — बिना अधिवक्ता)'}
                    </div>
                  ) : (
                    <>
                      <div className="font-semibold">{cd.advocateName || fill(undefined, 25)}</div>
                      <div className="text-[10pt] mt-1">{cd.advocateAddress || (isEn ? 'Advocate, District Court' : 'अधिवक्ता, जिला न्यायालय')}</div>
                      {(cd.advocatePhone || cd.advocateEmail) && (
                        <div className="text-[10pt] mt-1">
                          {cd.advocatePhone && <div>{isEn ? 'Mob: ' : 'मो.: '}{cd.advocatePhone}</div>}
                          {cd.advocateEmail && <div>{isEn ? 'Email: ' : 'ईमेल: '}{cd.advocateEmail}</div>}
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-14 text-center">
            <span className="font-bold underline text-[12pt] uppercase tracking-wider">
              {isEn ? 'VERIFICATION' : 'सत्यापन (VERIFICATION)'}
            </span>
          </div>

          <div className="mt-8 text-justify leading-relaxed text-[12.5pt]">
            {isEn ? (
              <>
                I, {fill(primaryComplainant.name, 35)}, the Complainant/Counsel/Authorised Representative, above mentioned, do hereby verify that the information provided herein above is true and complete in all respects and nothing material has been concealed therefrom.
              </>
            ) : (
              <>
                मैं, {fill(primaryComplainant.name, 35)}, उपरोक्त नामित परिवादी / अधिवक्ता / अधिकृत प्रतिनिधि, सत्यनिष्ठापूर्वक सत्यापित करता/करती हूँ कि उपरोक्त प्रपत्र में दी गई समस्त जानकारी मेरे निजी ज्ञान एवं विश्वास के अनुसार सभी प्रकार से सत्य व पूर्ण है तथा इसमें कोई भी सारवान तथ्य छिपाया नहीं गया है।
              </>
            )}
          </div>

          <div className="mt-24 text-right">
            <div className="inline-block text-center mr-4">
              <div className="font-mono text-slate-600 mb-1">......................................................</div>
              <div className="font-semibold text-[11.5pt]">{isEn ? 'Signature of the Complainant/' : 'हस्ताक्षर परिवादी /'}</div>
              <div className="font-semibold text-[11.5pt]">{isEn ? 'Counsel / Authorised Representative' : 'अधिवक्ता / अधिकृत प्रतिनिधि'}</div>
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-20">
            {isConsecutive ? (isEn ? `Page ${2 + offset} of ${totalPages}` : `पृष्ठ ${2 + offset} / ${totalPages}`) : (isEn ? `Page 2 of ${totalPages}` : `पृष्ठ 2 / ${totalPages}`)}
          </div>
        </div>
      )}

      {/* ================= PAGE 3 ================= */}
      {(!pageFilter || pageFilter === 3) && (
        <div className="legal-a4-sheet" id="legal-page-3">
          <div className="text-[12pt]">{isEn ? 'Before,' : 'समक्ष,'}</div>
          <div className="pl-14 mt-4 text-[12.5pt] leading-snug">
            <div>{isEn ? 'The Court of learned President & Members,' : 'माननीय अध्यक्ष एवं सदस्यगण का न्यायालय,'}</div>
            <div>
              {cd.commissionName
                ? cd.commissionName
                : isEn
                ? 'District Consumer Dispute Redressal Commission'
                : 'जिला उपभोक्ता विवाद प्रतितोष आयोग'},
            </div>
            <div>{cd.commissionPlace ? `${cd.commissionPlace}.` : '________________________.'}</div>
          </div>

          <div className="text-center font-bold text-[12pt] mt-6">
            {isEn
              ? <>Complaint Case No. -: {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '...........'} / {currentFilingYear}</>
              : <>उपभोक्ता परिवाद वाद संख्या: {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '...........'} / {currentFilingYear}</>}
          </div>

          <div className="mt-6 flex justify-between items-baseline text-[12pt]">
            <div className="border-b border-black flex-1 mr-2 font-semibold">
              {primaryComplainant.name || '_______________________________________________'}
              {data.complainants.length > 1 ? (isEn ? ` & ${data.complainants.length - 1} Others` : ` एवं ${data.complainants.length - 1} अन्य`) : ''}
            </div>
            <div className="font-bold whitespace-nowrap">{isEn ? '...........................Complainant.' : '...........................परिवादी'}</div>
          </div>

          <div className="text-center font-bold text-[12pt] my-3">{isEn ? 'V/s' : 'बनाम'}</div>

          <div className="flex justify-between items-baseline text-[12pt]">
            <div className="border-b border-black flex-1 mr-2 font-semibold">
              {primaryOp.name || '_______________________________________________'}
              {opSuffix(data.oppositeParties, isEn)}
            </div>
            <div className="font-bold whitespace-nowrap">{isEn ? '...............O.Ps.' : '...............विपक्षीगण'}</div>
          </div>

          <div className="mt-8 text-center font-bold underline text-[12pt]">
            {isEn ? 'Date of Events' : 'घटनाओं एवं महत्वपूर्ण तिथियों का विवरण (List of Dates & Events)'}
          </div>

          <table className="legal-table mt-4">
            <tbody>
              {data.events.map((evt, idx) => (
                <tr key={idx}>
                  <td className="w-12 text-center font-bold">{idx + 1}.</td>
                  <td className="font-normal">{evt.description || fill(undefined, 30)}</td>
                  <td className="w-40 font-semibold text-center">{evt.date || fill(undefined, 10)}</td>
                </tr>
              ))}
              {data.events.length === 0 && (
                <>
                  <tr>
                    <td className="w-12 text-center">1.</td>
                    <td>{isEn ? 'Event description / Commencement date' : 'घटना का विवरण / आरंभ तिथि'}</td>
                    <td className="w-40"></td>
                  </tr>
                  <tr>
                    <td className="w-12 text-center">2.</td>
                    <td>{isEn ? 'Date on which grievance / cause of action arose' : 'विवाद / वाद कारण उत्पन्न होने की तिथि'}</td>
                    <td className="w-40"></td>
                  </tr>
                  <tr>
                    <td className="w-12 text-center">3.</td>
                    <td>{isEn ? 'Legal notice / communication date' : 'कानूनी नोटिस / पत्राचार की तिथि'}</td>
                    <td className="w-40"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          <div className="mt-32 text-right">
            <div className="inline-block text-center mr-4">
              <div className="font-mono text-slate-600 mb-1">.................................</div>
              <div className="font-bold text-[12pt]">
                {cd.hasAdvocate === 'Yes' || (!cd.hasAdvocate && cd.advocateName)
                  ? (isEn ? 'Signature of Advocate' : 'हस्ताक्षर अधिवक्ता')
                  : (isEn ? 'Signature of Complainant' : 'हस्ताक्षर परिवादी')}
              </div>
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-20">
            {isConsecutive ? (isEn ? `Page ${3 + offset} of ${totalPages}` : `पृष्ठ ${3 + offset} / ${totalPages}`) : (isEn ? `Page 3 of ${totalPages}` : `पृष्ठ 3 / ${totalPages}`)}
          </div>
        </div>
      )}

      {/* ================= PAGE 4 ================= */}
      {(!pageFilter || pageFilter === 4) && (
        <div className="legal-a4-sheet" id="legal-page-4">
          <div className="text-[12pt]">{isEn ? 'In,' : 'समक्ष,'}</div>
          <div className="pl-14 mt-4 text-[12.5pt] leading-snug">
            <div>{isEn ? 'The Court of learned President & Member,' : 'माननीय अध्यक्ष एवं सदस्यगण का न्यायालय,'}</div>
            <div>
              {cd.commissionName
                ? cd.commissionName
                : isEn
                ? 'District Consumer Dispute Redressal Commission'
                : 'जिला उपभोक्ता विवाद प्रतितोष आयोग'},
            </div>
            <div>{cd.commissionPlace ? `${cd.commissionPlace}.` : '________________________.'}</div>
          </div>

          <div className="text-center font-bold text-[12pt] mt-6">
            {isEn
              ? <>Complaint Case No.:- {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '...........'} / {currentFilingYear}</>
              : <>उपभोक्ता परिवाद वाद संख्या: {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '...........'} / {currentFilingYear}</>}
          </div>

          <div className="text-center font-bold underline text-[12.5pt] uppercase mt-6 mb-8">
            {isEn ? 'Memo of Parties' : 'पक्षकारों का ज्ञापन (MEMO OF PARTIES)'}
          </div>

          {/* Complainants list */}
          <div className="space-y-4">
            {data.complainants.map((c, i) => (
              <div key={i} className="text-[12pt] leading-relaxed">
                {isEn ? (
                  <>
                    <div>
                      {fill(c.name, 35)}, {c.relationType || 'W/O'}- {fill(c.parentName, 25)},
                    </div>
                    <div className="mt-1">
                      Resident of Village- {fill(c.village, 20)}, P.O.- {fill(c.po, 10)}, P.S.- {fill(c.ps, 10)}
                    </div>
                    <div className="mt-1">
                      Pin Code {fill(c.pinCode, 10)} at present {fill(c.presentAddress || c.village, 25)}
                    </div>
                    <div className="mt-1">
                      P.O.- {fill(c.po, 10)}, P.S.- {fill(c.ps, 10)}, District – {fill(c.district, 20)}{c.state ? `, ${c.state}` : ''}
                    </div>
                    <div className="text-right font-bold text-[12pt] mt-2">
                      .......................... Complainant{data.complainants.length > 1 ? ` No. ${i + 1}` : ''}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      {fill(c.name, 35)}, {formatRelation(c.relationType, false)}- {fill(c.parentName, 25)},
                    </div>
                    <div className="mt-1">
                      निवासी ग्राम/मोहल्ला- {fill(c.village, 20)}, डाकघर- {fill(c.po, 10)}, थाना- {fill(c.ps, 10)}
                    </div>
                    <div className="mt-1">
                      पिन कोड {fill(c.pinCode, 10)}, वर्तमान पता- {fill(c.presentAddress || c.village, 25)}
                    </div>
                    <div className="mt-1">
                      डाकघर- {fill(c.po, 10)}, थाना- {fill(c.ps, 10)}, जिला – {fill(c.district, 20)}{c.state ? `, ${c.state}` : ''}
                    </div>
                    <div className="text-right font-bold text-[12pt] mt-2">
                      .......................... परिवादी{data.complainants.length > 1 ? ` संख्या ${i + 1}` : ''}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Opposite parties list */}
          <div className="mt-10 space-y-6">
            {data.oppositeParties.map((op, i) => (
              <div key={i} className="text-[12pt] leading-relaxed">
                <div className="font-semibold">
                  ({toRoman(i + 1)}) {fill(op.name, 40)}
                </div>
                <div className="mt-1 pl-6">
                  {isEn ? 'through its ' : 'द्वारा इसके '}{fill(op.through || (isEn ? 'Authorized Signatory' : 'शाखा प्रबंधक / अधिकृत हस्ताक्षरकर्ता'), 25)}{isEn ? ', situated at' : ', स्थित-'}
                </div>
                <div className="mt-1 pl-6 font-semibold">
                  {fill(op.address, 40)}
                </div>
              </div>
            ))}
            <div className="text-right font-bold text-[12pt] mt-4">
              {isEn ? '.......................... O.Ps' : '.......................... विपक्षीगण (O.Ps)'}
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-28">
            {isConsecutive ? (isEn ? `Page ${4 + offset} of ${totalPages}` : `पृष्ठ ${4 + offset} / ${totalPages}`) : (isEn ? `Page 4 of ${totalPages}` : `पृष्ठ 4 / ${totalPages}`)}
          </div>
        </div>
      )}

      {/* ================= CONSUMER COMPLAINT PETITION: SHEET 1 (FLEXIBLE A4) ================= */}
      {(!pageFilter ||
        pageFilter === 'petition' ||
        pageFilter === petitionStartPage ||
        pageFilter === 5) && (
        <div className="legal-a4-sheet flex flex-col justify-between" id={`legal-page-${petitionStartPage}`}>
          <div>
            {/* 1. Court Heading & Commission Details */}
            <div className="text-center font-bold text-[12pt] leading-snug">
              <div>{isEn ? 'IN THE COURT OF THE LEARNED PRESIDENT AND MEMBER,' : 'समक्ष माननीय अध्यक्ष एवं सदस्यगण का न्यायालय,'}</div>
              <div>
                {cd.commissionName
                  ? cd.commissionName
                  : isEn
                  ? 'DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION'
                  : 'जिला उपभोक्ता विवाद प्रतितोष आयोग'}, {cd.commissionPlace || '________________________'}
              </div>
            </div>

            <div className="text-center font-bold text-[11pt] mt-2.5">
              {isEn
                ? <>Consumer Complaint Case No. {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '____________'} of {currentFilingYear}</>
                : <>उपभोक्ता परिवाद वाद संख्या: {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '____________'} वर्ष {currentFilingYear}</>}
            </div>

            <div className="text-center font-bold underline text-[11.5pt] mt-2">
              {isEn
                ? 'Complaint under Section 35 of the Consumer Protection Act, 2019'
                : 'उपभोक्ता संरक्षण अधिनियम, 2019 की धारा 35 के अंतर्गत परिवाद पत्र'}
            </div>

            {/* Complainant Header */}
            <div className="mt-3.5 text-[11pt] leading-relaxed text-justify">
              {isEn ? (
                <>
                  {fill(primaryComplainant.name, 35)}, {formatRelation(primaryComplainant.relationType, true)} {fill(primaryComplainant.parentName, 20)}, Permanent resident of Village - {fill(primaryComplainant.village, 20)}, P.O. - {fill(primaryComplainant.po, 10)}, P.S. - {fill(primaryComplainant.ps, 10)}, District - {fill(primaryComplainant.district, 20)}; at present residing at {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, P.O. - {fill(primaryComplainant.po, 10)}, P.S. - {fill(primaryComplainant.ps, 10)}, District - {fill(primaryComplainant.district, 20)}.
                </>
              ) : (
                <>
                  {fill(primaryComplainant.name, 35)}, {formatRelation(primaryComplainant.relationType, false)} {fill(primaryComplainant.parentName, 20)}, स्थायी निवासी ग्राम/मोहल्ला - {fill(primaryComplainant.village, 20)}, डाकघर - {fill(primaryComplainant.po, 10)}, थाना - {fill(primaryComplainant.ps, 10)}, जिला - {fill(primaryComplainant.district, 20)}; वर्तमान पता - {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, डाकघर - {fill(primaryComplainant.po, 10)}, थाना - {fill(primaryComplainant.ps, 10)}, जिला - {fill(primaryComplainant.district, 20)}।
                </>
              )}
            </div>
            <div className="text-right font-bold text-[11pt] mt-0.5">{isEn ? '...........Complainant' : '...........परिवादी'}</div>

            <div className="text-center font-bold text-[11.5pt] my-2">{isEn ? 'VERSUS' : 'बनाम (VERSUS)'}</div>

            <div className="space-y-2">
              {data.oppositeParties.map((op, idx) => (
                <div key={idx} className="text-[11pt] leading-relaxed">
                  <div className="font-bold">{idx + 1}. {fill(op.name, 40)}</div>
                  <div className="pl-4 mt-0.5">
                    {isEn ? 'Through its ' : 'द्वारा इसके '}{fill(op.through || (isEn ? 'Authorized Signatory' : 'शाखा प्रबंधक / अधिकृत हस्ताक्षरकर्ता'), 25)}{isEn ? ', Situated at ' : ', स्थित: '}{fill(op.address, 35)}
                  </div>
                  <div className="text-right font-bold text-[11pt] mt-0.5">
                    {isEn ? `.........Opposite Party No. ${idx + 1}` : `.........विपक्षी संख्या ${idx + 1}`}
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Valuation & Assessment */}
            <div className="mt-3.5 text-[11pt] leading-relaxed">
              <div className="font-bold uppercase underline">
                {isEn
                  ? '1. CONSIDERATION AMOUNT PAID FOR THE PURPOSE OF ASSESSING COURT FEES:-'
                  : '1. न्यायालय फीस निर्धारण हेतु भुगतान की गई प्रतिफल राशि:-'}
              </div>
              <div className="mt-0.5">
                {isEn ? 'Rs. ' : 'रु. '}{fill(considerationDisplay, 12)}/- ({isEn ? 'Rupees ' : 'अक्षरे '}{fill(considerationWordsDisplay, 25)}{isEn ? ' only' : ' रुपये मात्र'})।
              </div>

              <div className="mt-2">
                <span className="font-bold">{isEn ? '2. Claimed Amount:-' : '2. कुल दावा राशि:-'}</span> {isEn ? 'Rs. ' : 'रु. '}{fill(claimedDisplay, 12)}/- ({isEn ? 'Rupees ' : 'अक्षरे '}{fill(claimedWordsDisplay, 25)}{isEn ? ' only' : ' रुपये मात्र'}), {isEn ? 'together with interest @ ' : 'ब्याज सहित @ '}{fill(cd.interestRate || '12', 4)}% {isEn ? 'per annum from the date of filing of this complaint, i.e., filing of complaint, till the date of actual payment.' : 'प्रति वर्ष परिवाद दाखिल करने की तिथि से वास्तविक भुगतान होने तक।'}
              </div>

              {(cd.valueOfGoods || cd.considerationAmount || cd.compensationAmount || cd.litigationAmount) && (
                <div className="mt-1 pl-4 space-y-0.5 text-[10.5pt]">
                  {cd.valueOfGoods && (
                    <div>
                      <span className="font-semibold">{isEn ? '(a) Value of Goods / Disputed Amount: ' : '(a) माल / सेवा का मूल्य / विवादित राशि: '}</span>
                      {isEn ? 'Rs. ' : 'रु. '}{cd.valueOfGoods}/- ({isEn ? 'Rupees ' : 'अक्षरे '}{valueOfGoodsWordsDisplay}{isEn ? ' only' : ' रुपये मात्र'})
                    </div>
                  )}
                  {(cd.considerationAmount || cd.compensationAmount) && (
                    <div>
                      <span className="font-semibold">{isEn ? '(b) Consideration Amount: ' : '(b) प्रतिफल राशि / क्षतिपूर्ति: '}</span>
                      {isEn ? 'Rs. ' : 'रु. '}{compDisplay}/- ({isEn ? 'Rupees ' : 'अक्षरे '}{compWordsDisplay}{isEn ? ' only' : ' रुपये मात्र'})
                    </div>
                  )}
                  {cd.litigationAmount && (
                    <div>
                      <span className="font-semibold">{isEn ? '(c) Litigation Amount: ' : '(c) मुकदमेबाजी एवं कानूनी खर्च: '}</span>
                      {isEn ? 'Rs. ' : 'रु. '}{cd.litigationAmount}/- ({isEn ? 'Rupees ' : 'अक्षरे '}{litigationWordsDisplay}{isEn ? ' only' : ' रुपये मात्र'})
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2">
                <span className="font-bold">{isEn ? '3. EVIDENCE & WITNESSES: -' : '3. साक्ष्य एवं गवाह: -'}</span> {isEn ? 'As stated below and as per the documents annexed herewith.' : 'यथा संलग्न दस्तावेजों एवं नीचे दिए गए विवरण के अनुसार।'}
              </div>

              {validAnnexures.length > 0 ? (
                <div className="mt-1.5 pl-4 space-y-0.5">
                  {validAnnexures.map((ann, idx) => (
                    <div key={idx}>
                      <span className="font-bold">{ann.annexureNo || (isEn ? `Annexure-${idx + 1}` : `संलग्नक-${idx + 1}`)}: </span>
                      {ann.title}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-1.5 pl-4 space-y-0.5 text-slate-700">
                  <div><span className="font-bold">Annexure-1: </span>{fill(undefined, 35)}</div>
                </div>
              )}
            </div>

            {/* 3. Witnesses in Favour of Complainant (Floats naturally directly below Evidence) */}
            <div className="mt-3.5 text-[11pt] petition-avoid-break">
              <div className="font-bold uppercase underline">
                {isEn ? 'WITNESSES IN FAVOUR OF THE COMPLAINANT:-' : 'परिवादी के पक्ष में गवाह (WITNESSES IN FAVOUR OF THE COMPLAINANT):-'}
              </div>
              <div className="mt-1 pl-4 space-y-0.5 font-semibold">
                <div>{isEn ? 'The Complainant herself/himself.' : 'परिवादी स्वयं।'}</div>
                <div>{isEn ? 'Other independent witness(es), if any.' : 'अन्य स्वतंत्र गवाह, यदि कोई हो।'}</div>
              </div>
            </div>

            {/* 4. Statement of Facts Heading */}
            <div className="mt-3.5 font-bold uppercase text-[11.5pt] leading-tight">
              {isEn ? (
                <>
                  <div>MOST RESPECTFULLY</div>
                  <div>SHOWETH:-</div>
                </>
              ) : (
                <>
                  <div>सादर निवेदन निम्नवत प्रस्तुत है</div>
                  <div>(MOST RESPECTFULLY SHOWETH):-</div>
                </>
              )}
            </div>

            {/* Sheet 1 Facts Paragraphs */}
            <div className="mt-2 space-y-2 text-[11pt] text-justify leading-relaxed">
              {sheet1Facts.map((p, idx) => (
                <div key={idx} className="indent-8">
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="text-right text-[10pt] text-slate-500 mt-auto pt-3">
            {isEn ? `Page ${petitionStartPage} of ${totalPages}` : `पृष्ठ ${petitionStartPage} / ${totalPages}`}
          </div>
        </div>
      )}

      {/* ================= CONSUMER COMPLAINT PETITION: SHEET 2 (FLEXIBLE A4) ================= */}
      {(!pageFilter ||
        pageFilter === 'petition' ||
        pageFilter === (petitionStartPage + 1) ||
        pageFilter === 6) && (
        <div className="legal-a4-sheet flex flex-col justify-between" id={`legal-page-${petitionStartPage + 1}`}>
          <div>
            {/* Overflow facts if any */}
            {overflowFacts.length > 0 && (
              <div className="space-y-2 text-[11pt] text-justify leading-relaxed mb-3">
                {overflowFacts.map((p, idx) => (
                  <div key={idx} className="indent-8">
                    {p}
                  </div>
                ))}
              </div>
            )}

            {/* 5. Prayer / Relief Clause */}
            <div>
              <div className="text-center font-bold underline text-[12pt] uppercase mb-2">
                {isEn ? 'PRAYER' : 'प्रार्थना (PRAYER)'}
              </div>

              <div className="text-[11pt] text-justify leading-relaxed">
                {isEn
                  ? "It is, therefore, most respectfully prayed that this Hon'ble District Consumer Disputes Redressal Commission may graciously be pleased to:"
                  : "अतः माननीय जिला उपभोक्ता विवाद प्रतितोष आयोग से सादर सविनय प्रार्थना है कि न्यायहित में कृपापूर्वक निम्न आदेश पारित करने की कृपा की जाए:"}
              </div>

              {data.prayer && data.prayer.trim().length > 0 ? (
                <div className="mt-2 text-[11pt] text-justify leading-relaxed whitespace-pre-line">
                  {data.prayer}
                </div>
              ) : (
                <div className="mt-2 space-y-2 text-[11pt] text-justify leading-relaxed">
                  {isEn ? (
                    <>
                      <div className="pl-2">
                        <span className="font-bold">(i) </span>
                        Direct the Opposite Parties, jointly and severally, to pay to the complainant the claimed / refund amount of Rs. {fill(data.prayerClaims?.claimAmount || cd.claimedAmount, 12)}/- (Rupees {fill(data.prayerClaims?.claimAmountWords || cd.claimedAmountWords, 25)} only), together with interest @ {fill(data.prayerClaims?.interestRate || cd.interestRate, 4)}% per annum from the date of {fill(data.prayerClaims?.interestFromDate || cd.interestFromDate || 'filing of this complaint', 12)}, till the date of actual payment.
                      </div>

                      <div className="pl-2">
                        <span className="font-bold">(ii) </span>
                        Direct the Opposite Parties, jointly and severally, to pay a sum of Rs. {fill(data.prayerClaims?.compensationAmount || cd.considerationAmount || cd.compensationAmount || '4,50,000', 12)}/- (Rupees {fill(data.prayerClaims?.compensationAmountWords || (cd.considerationAmount ? convertNumberToIndianWords(cd.considerationAmount) : 'Four Lakh Fifty Thousand'), 20)} only) to the complainant as compensation for the immense mental agony, physical harassment, financial hardship and emotional trauma suffered due to deficiency in service and unfair trade practice, together with interest @ {fill(data.prayerClaims?.interestRate || cd.interestRate, 4)}% per annum from the date of filing of this complaint, till the date of actual payment.
                      </div>

                      <div className="pl-2">
                        <span className="font-bold">(iii) </span>
                        Direct the Opposite Parties to pay Rs. {fill(data.prayerClaims?.litigationCosts || cd.litigationAmount || '50,000', 10)}/- (Rupees {fill(data.prayerClaims?.litigationCostsWords || (cd.litigationAmount ? convertNumberToIndianWords(cd.litigationAmount) : 'Fifty Thousand'), 20)} only) towards litigation expenses and incidental costs incurred by the complainant.
                      </div>

                      <div className="pl-2">
                        <span className="font-bold">(iv) </span>
                        Pass any other or further order(s), direction(s) or relief(s) as this Hon&apos;ble Commission may deem fit and proper in the facts and circumstances of the case.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pl-2">
                        <span className="font-bold">(i) </span>
                        यह कि विपक्षीगण को संयुक्त एवं पृथक रूप से निर्देश दिया जाए कि वे परिवादी को दावाकृत / धन वापसी राशि रु. {fill(data.prayerClaims?.claimAmount || cd.claimedAmount, 12)}/- (अक्षरे {fill(data.prayerClaims?.claimAmountWords || cd.claimedAmountWords, 25)} रुपये मात्र), ब्याज सहित @ {fill(data.prayerClaims?.interestRate || cd.interestRate, 4)}% प्रति वर्ष की दर से {fill(data.prayerClaims?.interestFromDate || cd.interestFromDate || 'परिवाद दाखिल करने की तिथि', 15)} से वास्तविक भुगतान होने तक अदा करें।
                      </div>

                      <div className="pl-2">
                        <span className="font-bold">(ii) </span>
                        यह कि विपक्षीगण को परिवादी को सेवा में गंभीर कमी एवं अनुचित व्यापार व्यवहार के कारण हुई भारी मानसिक संताप, शारीरिक प्रताड़ना एवं आर्थिक क्षति के हर्जाने / मुआवजे के रूप में रु. {fill(data.prayerClaims?.compensationAmount || cd.considerationAmount || cd.compensationAmount || '4,50,000', 12)}/- (अक्षरे {fill(data.prayerClaims?.compensationAmountWords || (cd.considerationAmount ? convertNumberToIndianWords(cd.considerationAmount) : 'चार लाख पचास हजार'), 20)} रुपये मात्र) का भुगतान वास्तविक भुगतान तक करने का आदेश दिया जाए।
                      </div>

                      <div className="pl-2">
                        <span className="font-bold">(iii) </span>
                        यह कि विपक्षीगण को परिवादी द्वारा परिवाद दाखिल करने में हुए वाद व्यय एवं कानूनी खर्च हेतु रु. {fill(data.prayerClaims?.litigationCosts || cd.litigationAmount || '50,000', 10)}/- (अक्षरे {fill(data.prayerClaims?.litigationCostsWords || (cd.litigationAmount ? convertNumberToIndianWords(cd.litigationAmount) : 'पचास हजार'), 20)} रुपये मात्र) अदा करने का निर्देश दिया जाए।
                      </div>

                      <div className="pl-2">
                        <span className="font-bold">(iv) </span>
                        यह कि अन्य कोई भी अनुतोष, आदेश अथवा निर्देश जो माननीय आयोग मामले के तथ्यों एवं परिस्थितियों के आलोक में उचित एवं न्यायसंगत समझे, परिवादी के पक्ष में पारित करने की कृपा की जाए।
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="mt-3.5 font-bold text-center text-[11.5pt] tracking-wide petition-avoid-break">
                {isEn ? (
                  <>
                    <div>AND FOR THIS ACT OF KINDNESS, THE COMPLAINANT AS</div>
                    <div>IN DUTY BOUND SHALL EVER PRAY.</div>
                  </>
                ) : (
                  <>
                    <div>एवं इस कृपा कार्य हेतु परिवादी सदा कर्तव्यबद्ध व</div>
                    <div>प्रार्थनारत रहेगा।</div>
                  </>
                )}
              </div>

              <div className="mt-3 flex justify-between items-end text-[11pt] petition-avoid-break">
                <div className="space-y-1">
                  <div>{isEn ? 'Place: ' : 'स्थान: '}{fill(data.verificationPlace || primaryComplainant.district, 20)}</div>
                  <div>{isEn ? 'Date: ' : 'दिनांक: '}{fill(data.verificationDate, 15)}</div>
                </div>

                <div className="text-center space-y-0.5">
                  <div>({fill(primaryComplainant.name, 25)})</div>
                  {cd.hasAdvocate === 'Yes' || (!cd.hasAdvocate && cd.advocateName) ? (
                    <>
                      <div className="font-semibold">{isEn ? 'Through Counsel' : 'द्वारा अधिवक्ता'}</div>
                      <div className="mt-1.5">{fill(cd.advocateName, 25)}</div>
                      <div className="font-bold">{isEn ? 'Advocate' : 'अधिवक्ता'}</div>
                    </>
                  ) : (
                    <div className="font-bold text-[10.5pt] mt-1">{isEn ? 'Complainant in Person' : 'परिवादी (व्यक्तिगत रूप से)'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* 6. Verification of Complaint (Rendered on Sheet 2 if verificationOnSheet2) */}
            {verificationOnSheet2 && (
              <div className="mt-3.5 pt-2.5 border-t border-dashed border-slate-300 petition-avoid-break">
                <div className="text-center font-bold underline text-[12pt] uppercase mb-2">
                  {isEn ? 'VERIFICATION' : 'सत्यापन (VERIFICATION)'}
                </div>

                <div className="text-justify text-[11pt] leading-relaxed">
                  {isEn ? (
                    <>
                      I, {fill(primaryComplainant.name, 35)}, {formatRelation(primaryComplainant.relationType, true)} {fill(primaryComplainant.parentName, 20)}, resident of Village {fill(primaryComplainant.village, 18)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, at present {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, the above-named complainant, do hereby verify that the statements made in paragraphs 1 to {paraCount} of the accompanying complaint are true and correct to my personal knowledge, information and belief and the records of the case, and that nothing material has been concealed or suppressed therefrom.
                    </>
                  ) : (
                    <>
                      मैं, {fill(primaryComplainant.name, 35)}, {formatRelation(primaryComplainant.relationType, false)} {fill(primaryComplainant.parentName, 20)}, निवासी ग्राम/मोहल्ला {fill(primaryComplainant.village, 18)}, डाकघर {fill(primaryComplainant.po, 10)}, थाना {fill(primaryComplainant.ps, 10)}, जिला {fill(primaryComplainant.district, 18)}, वर्तमान पता {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, डाकघर {fill(primaryComplainant.po, 10)}, थाना {fill(primaryComplainant.ps, 10)}, जिला {fill(primaryComplainant.district, 18)}, उपरोक्त नामित परिवादी, सत्यनिष्ठापूर्वक सत्यापित करता/करती हूँ कि संलग्न परिवाद पत्र के प्रस्तर 1 से {paraCount} में वर्णित समस्त कथन मेरे निजी ज्ञान, विश्वास, जानकारी एवं मामले के अभिलेखों के अनुसार सत्य व सही हैं तथा इसमें कोई भी सारवान तथ्य छिपाया अथवा दबाया नहीं गया है।
                    </>
                  )}
                </div>

                <div className="mt-2 text-[11pt]">
                  {isEn
                    ? <>Verified at {fill(data.verificationPlace || primaryComplainant.district, 20)} on this {verDate.day} day of {verDate.month || '________________'}, {verDate.year || currentFilingYear}.</>
                    : <>आज दिनांक {verDate.day} {verDate.month || '________________'}, {verDate.year || currentFilingYear} को {fill(data.verificationPlace || primaryComplainant.district, 20)} में सत्यापित किया गया।</>}
                </div>

                <div className="mt-3 flex justify-end text-[11pt]">
                  <div className="text-center space-y-0.5">
                    <div className="font-bold">{isEn ? 'Complainant' : 'परिवादी'}</div>
                    <div className="my-1">({fill(primaryComplainant.name, 25)})</div>
                    {cd.hasAdvocate === 'Yes' || (!cd.hasAdvocate && cd.advocateName) ? (
                      <>
                        <div className="font-semibold">{isEn ? 'Through Counsel' : 'द्वारा अधिवक्ता'}</div>
                        <div className="mt-1.5">{fill(cd.advocateName, 25)}</div>
                        <div className="font-bold">{isEn ? 'Advocate' : 'अधिवक्ता'}</div>
                      </>
                    ) : (
                      <div className="font-semibold text-[10.5pt] mt-1">{isEn ? '(Filed in Person)' : '(व्यक्तिगत रूप से दायर)'}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-right text-[10pt] text-slate-500 mt-auto pt-3">
            {isEn ? `Page ${petitionStartPage + 1} of ${totalPages}` : `पृष्ठ ${petitionStartPage + 1} / ${totalPages}`}
          </div>
        </div>
      )}

      {/* ================= CONSUMER COMPLAINT PETITION: SHEET 3 (IF VERIFICATION OVERFLOWS) ================= */}
      {!verificationOnSheet2 && (!pageFilter ||
        pageFilter === 'petition' ||
        pageFilter === (petitionStartPage + 2) ||
        pageFilter === 7) && (
        <div className="legal-a4-sheet flex flex-col justify-between" id={`legal-page-${petitionStartPage + 2}`}>
          <div>
            <div className="text-center font-bold underline text-[12pt] uppercase mb-3">
              {isEn ? 'VERIFICATION' : 'सत्यापन (VERIFICATION)'}
            </div>

            <div className="text-justify text-[11pt] leading-relaxed">
              {isEn ? (
                <>
                  I, {fill(primaryComplainant.name, 35)}, {formatRelation(primaryComplainant.relationType, true)} {fill(primaryComplainant.parentName, 20)}, resident of Village {fill(primaryComplainant.village, 18)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, at present {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, the above-named complainant, do hereby verify that the statements made in paragraphs 1 to {paraCount} of the accompanying complaint are true and correct to my personal knowledge, information and belief and the records of the case, and that nothing material has been concealed or suppressed therefrom.
                </>
              ) : (
                <>
                  मैं, {fill(primaryComplainant.name, 35)}, {formatRelation(primaryComplainant.relationType, false)} {fill(primaryComplainant.parentName, 20)}, निवासी ग्राम/मोहल्ला {fill(primaryComplainant.village, 18)}, डाकघर {fill(primaryComplainant.po, 10)}, थाना {fill(primaryComplainant.ps, 10)}, जिला {fill(primaryComplainant.district, 18)}, वर्तमान पता {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, डाकघर {fill(primaryComplainant.po, 10)}, थाना {fill(primaryComplainant.ps, 10)}, जिला {fill(primaryComplainant.district, 18)}, उपरोक्त नामित परिवादी, सत्यनिष्ठापूर्वक सत्यापित करता/करती हूँ कि संलग्न परिवाद पत्र के प्रस्तर 1 से {paraCount} में वर्णित समस्त कथन मेरे निजी ज्ञान, विश्वास, जानकारी एवं मामले के अभिलेखों के अनुसार सत्य व सही हैं तथा इसमें कोई भी सारवान तथ्य छिपाया अथवा दबाया नहीं गया है।
                </>
              )}
            </div>

            <div className="mt-3 text-[11pt]">
              {isEn
                ? <>Verified at {fill(data.verificationPlace || primaryComplainant.district, 20)} on this {verDate.day} day of {verDate.month || '________________'}, {verDate.year || currentFilingYear}.</>
                : <>आज दिनांक {verDate.day} {verDate.month || '________________'}, {verDate.year || currentFilingYear} को {fill(data.verificationPlace || primaryComplainant.district, 20)} में सत्यापित किया गया।</>}
            </div>

            <div className="mt-4 flex justify-end text-[11pt]">
              <div className="text-center space-y-0.5">
                <div className="font-bold">{isEn ? 'Complainant' : 'परिवादी'}</div>
                <div className="my-1">({fill(primaryComplainant.name, 25)})</div>
                {cd.hasAdvocate === 'Yes' || (!cd.hasAdvocate && cd.advocateName) ? (
                  <>
                    <div className="font-semibold">{isEn ? 'Through Counsel' : 'द्वारा अधिवक्ता'}</div>
                    <div className="mt-1.5">{fill(cd.advocateName, 25)}</div>
                    <div className="font-bold">{isEn ? 'Advocate' : 'अधिवक्ता'}</div>
                  </>
                ) : (
                  <div className="font-semibold text-[10.5pt] mt-1">{isEn ? '(Filed in Person)' : '(व्यक्तिगत रूप से दायर)'}</div>
                )}
              </div>
            </div>
          </div>

          <div className="text-right text-[10pt] text-slate-500 mt-auto pt-3">
            {isEn ? `Page ${petitionStartPage + 2} of ${totalPages}` : `पृष्ठ ${petitionStartPage + 2} / ${totalPages}`}
          </div>
        </div>
      )}

      {/* ================= AFFIDAVIT ================= */}
      {(!pageFilter || pageFilter === 9 || pageFilter === 'affidavit' || pageFilter === (affidavitPage - offset)) && (
        <div className="legal-a4-sheet" id="legal-page-affidavit">
          <div className="text-center font-bold text-[12.5pt] leading-snug">
            <div>{isEn ? 'IN THE COURT OF THE LEARNED PRESIDENT AND MEMBER' : 'समक्ष माननीय अध्यक्ष एवं सदस्यगण का न्यायालय'}</div>
            <div>
              {cd.commissionName
                ? cd.commissionName
                : isEn
                ? 'DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION'
                : 'जिला उपभोक्ता विवाद प्रतितोष आयोग'}, {cd.commissionPlace || '________________________'}
            </div>
          </div>

          <div className="text-center font-bold text-[11.5pt] mt-4">
            {isEn
              ? <>Complaint Case No. {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '..........'}/{currentFilingYear}</>
              : <>उपभोक्ता परिवाद वाद संख्या: {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '..........'}/{currentFilingYear}</>}
          </div>

          <div className="mt-5 flex justify-between items-baseline text-[12pt]">
            <div className="font-semibold">{fill(primaryComplainant.name, 25)}</div>
            <div className="font-bold">{isEn ? '.................... Complainant' : '.................... परिवादी'}</div>
          </div>

          <div className="text-center font-bold text-[12pt] my-2">{isEn ? 'Versus' : 'बनाम (Versus)'}</div>

          <div className="flex justify-between items-baseline text-[12pt]">
            <div className="font-semibold">{fill(primaryOp.name, 25)}{opSuffix(data.oppositeParties, isEn)}</div>
            <div className="font-bold">{isEn ? '..................... O.Ps' : '..................... विपक्षीगण'}</div>
          </div>

          <div className="text-center font-bold underline text-[13pt] uppercase mt-6 mb-4">
            {isEn ? 'AFFIDAVIT' : 'शपथ पत्र (AFFIDAVIT)'}
          </div>

          <div className="text-justify text-[12pt] leading-relaxed">
            {isEn ? (
              <>
                I, {fill(primaryComplainant.name, 35)}, {formatRelation(primaryComplainant.relationType, true)} {fill(primaryComplainant.parentName, 20)}, resident of Village {fill(primaryComplainant.village, 18)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, at present {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, the above-named complainant, do hereby solemnly affirm and state on oath as follows:
              </>
            ) : (
              <>
                मैं, {fill(primaryComplainant.name, 35)}, {formatRelation(primaryComplainant.relationType, false)} {fill(primaryComplainant.parentName, 20)}, निवासी ग्राम/मोहल्ला {fill(primaryComplainant.village, 18)}, डाकघर {fill(primaryComplainant.po, 10)}, थाना {fill(primaryComplainant.ps, 10)}, जिला {fill(primaryComplainant.district, 18)}, वर्तमान पता {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, डाकघर {fill(primaryComplainant.po, 10)}, थाना {fill(primaryComplainant.ps, 10)}, जिला {fill(primaryComplainant.district, 18)}, उपरोक्त नामित परिवादी/शपथकर्ता, सत्यनिष्ठापूर्वक शपथ लेता/लेती हूँ एवं निम्न बयान करता/करती हूँ:
              </>
            )}
          </div>

          {data.affidavit && data.affidavit.trim().length > 0 ? (
            <div className="mt-4 text-[12pt] text-justify leading-relaxed whitespace-pre-line">
              {data.affidavit}
            </div>
          ) : (
            <div className="mt-4 space-y-3 text-[12pt] text-justify leading-relaxed">
              {isEn ? (
                <>
                  <div>
                    <span className="font-bold">1. </span>
                    That I am the complainant in the accompanying consumer complaint and, being fully acquainted with the facts and circumstances of the case, I am competent to swear this affidavit.
                  </div>
                  <div>
                    <span className="font-bold">2. </span>
                    That I have read and understood the contents of the accompanying consumer complaint, and the statements made in paragraphs 1 to {paraCount} thereof are true and correct to my personal knowledge, information and belief.
                  </div>
                  <div>
                    <span className="font-bold">3. </span>
                    That all the annexures annexed with the accompanying complaint are true Xerox copies of their respective originals and are relied upon in support of the present complaint.
                  </div>
                  <div>
                    <span className="font-bold">4. </span>
                    That the statements made in the accompanying complaint are true and correct, and nothing material has been concealed or suppressed therefrom.
                  </div>
                  <div>
                    <span className="font-bold">5. </span>
                    That this affidavit is being sworn for the purpose of supporting the accompanying consumer complaint and the documents annexed thereto before this Hon&apos;ble Commission.
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-bold">1. </span>
                    यह कि मैं संलग्न उपभोक्ता परिवाद का परिवादी/शपथकर्ता हूँ तथा मामले के तथ्यों एवं परिस्थितियों से पूर्णतः भली-भांति अवगत होने के कारण यह शपथ पत्र प्रस्तुत करने हेतु पूर्णतः सक्षम हूँ।
                  </div>
                  <div>
                    <span className="font-bold">2. </span>
                    यह कि मैंने संलग्न परिवाद पत्र की विषय-वस्तु को भली-भांति पढ़ व समझ लिया है, तथा इसके प्रस्तर 1 से {paraCount} में वर्णित समस्त कथन मेरे निजी ज्ञान, विश्वास एवं अभिलेखों के अनुसार सत्य व सही हैं।
                  </div>
                  <div>
                    <span className="font-bold">3. </span>
                    यह कि संलग्न परिवाद पत्र के साथ प्रस्तुत किए गए समस्त संलग्नक (Annexures) अपने-अपने मूल दस्तावेजों की सत्य छायाप्रतियां हैं, जिन पर इस परिवाद के समर्थन में भरोसा किया गया है।
                  </div>
                  <div>
                    <span className="font-bold">4. </span>
                    यह कि संलग्न परिवाद पत्र में किया गया प्रत्येक कथन सत्य व सही है तथा इसमें किसी भी सारवान तथ्य को छिपाया अथवा दबाया नहीं गया है।
                  </div>
                  <div>
                    <span className="font-bold">5. </span>
                    यह कि यह शपथ पत्र इस माननीय आयोग के समक्ष संलग्न उपभोक्ता परिवाद एवं साक्ष्य दस्तावेजों के समर्थन हेतु प्रस्तुत किया जा रहा है।
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-6 text-[12pt]">
            {isEn
              ? <>Solemnly affirmed before me on this {affDate.day} day of {affDate.month || '________________'}, {affDate.year || currentFilingYear}.</>
              : <>आज दिनांक {affDate.day} {affDate.month || '________________'}, {affDate.year || currentFilingYear} को मेरे समक्ष सत्यनिष्ठापूर्वक शपथ ली गई।</>}
          </div>

          <div className="mt-14 flex justify-between items-end text-[12pt]">
            <div>
              <div className="font-semibold mb-1">{isEn ? 'Identified by:' : 'पहचानकर्ता:'}</div>
              <div className="border-b border-black w-48 mb-1">
                {cd.advocateName ? <span className="font-semibold">{cd.advocateName}</span> : ''}
              </div>
              <div className="font-bold">{isEn ? 'Advocate' : 'अधिवक्ता'}</div>
            </div>

            <div className="text-center">
              <div className="border-b border-black w-48 mb-1"></div>
              <div className="font-bold">{isEn ? 'Deponent' : 'शपथकर्ता (Deponent)'}</div>
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-14">
            {isConsecutive
              ? (isEn ? `Page ${affidavitPage} of ${totalPages}` : `पृष्ठ ${affidavitPage} / ${totalPages}`)
              : (isEn ? `Page ${affidavitPage} of ${totalPages}` : `पृष्ठ ${affidavitPage} / ${totalPages}`)}
          </div>
        </div>
      )}
    </div>
  );
};
