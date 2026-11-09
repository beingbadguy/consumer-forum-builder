import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import { ComplaintFormData, OppositeParty } from '../types/complaint';
import { convertNumberToIndianWords } from './numberToWords';

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

type DocxAlignment = (typeof AlignmentType)[keyof typeof AlignmentType];

function p(
  text: string,
  opts?: {
    bold?: boolean;
    underline?: boolean;
    align?: DocxAlignment;
    size?: number; // 24 = 12pt
    spaceBefore?: number;
    spaceAfter?: number;
    lineSpacing?: number;
  }
): Paragraph {
  return new Paragraph({
    alignment: opts?.align || AlignmentType.LEFT,
    spacing: {
      before: opts?.spaceBefore ?? 100,
      after: opts?.spaceAfter ?? 100,
      line: opts?.lineSpacing ?? 276, // 1.15 line spacing
    },
    children: [
      new TextRun({
        text,
        bold: opts?.bold ?? false,
        underline: opts?.underline ? {} : undefined,
        size: opts?.size ?? 24, // 12pt
        font: 'Times New Roman',
      }),
    ],
  });
}

function pRuns(
  runs: { text: string; bold?: boolean; underline?: boolean; size?: number }[],
  opts?: { align?: DocxAlignment; spaceBefore?: number; spaceAfter?: number }
): Paragraph {
  return new Paragraph({
    alignment: opts?.align || AlignmentType.LEFT,
    spacing: {
      before: opts?.spaceBefore ?? 100,
      after: opts?.spaceAfter ?? 100,
      line: 276,
    },
    children: runs.map(
      (r) =>
        new TextRun({
          text: r.text,
          bold: r.bold ?? false,
          underline: r.underline ? {} : undefined,
          size: r.size ?? 24,
          font: 'Times New Roman',
        })
    ),
  });
}

function createCell(
  text: string,
  opts?: {
    bold?: boolean;
    widthPercent?: number;
    align?: DocxAlignment;
    bgColor?: string;
  }
): TableCell {
  return new TableCell({
    width: opts?.widthPercent ? { size: opts.widthPercent, type: WidthType.PERCENTAGE } : undefined,
    shading: opts?.bgColor ? { fill: opts.bgColor } : undefined,
    children: [
      new Paragraph({
        alignment: opts?.align || AlignmentType.LEFT,
        spacing: { before: 80, after: 80, line: 240 },
        children: [
          new TextRun({
            text,
            bold: opts?.bold ?? false,
            size: 21, // 10.5pt
            font: 'Times New Roman',
          }),
        ],
      }),
    ],
  });
}

const tableBorder = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: '000000',
};

const cellBorders = {
  top: tableBorder,
  bottom: tableBorder,
  left: tableBorder,
  right: tableBorder,
};

export async function generateDocxBlob(data: ComplaintFormData): Promise<Blob> {
  const cd = data.caseDetails;
  const isEn = data.language === 'en';

  const considerationDisplay = cd.totalConsideration || cd.valueOfGoods || cd.considerationAmount || '';
  const considerationWordsDisplay =
    cd.totalConsiderationWords || (considerationDisplay ? convertNumberToIndianWords(considerationDisplay) : '');

  const calcClaimed =
    parseCurrencyNumber(cd.valueOfGoods) +
    parseCurrencyNumber(cd.compensationAmount || cd.considerationAmount) +
    parseCurrencyNumber(cd.litigationAmount);
  const claimedDisplay = cd.claimedAmount || (calcClaimed > 0 ? formatToIndianCurrency(calcClaimed) : '');
  const claimedWordsDisplay =
    cd.claimedAmountWords || (claimedDisplay ? convertNumberToIndianWords(claimedDisplay) : '');

  const currentFilingYear =
    cd.complaintYear && cd.complaintYear.trim().length === 4 && Number(cd.complaintYear) >= 2024
      ? cd.complaintYear.trim()
      : new Date().getFullYear().toString();

  const primaryComplainant = data.complainants[0] || {
    name: '________________________',
    relationType: 'W/O',
    parentName: '________________',
    village: '________________',
    po: '________',
    ps: '________',
    pinCode: '________',
    district: '________________',
    state: '________',
    presentAddress: '',
    address: '',
    phone: '',
    email: '',
  };

  const primaryOp = data.oppositeParties[0] || {
    name: '________________________',
    through: 'Authorized Signatory',
    address: '________________________',
  };

  const validAnnexures = (data.annexures || []).filter(
    (a) => (a.title && a.title.trim().length > 0) || (a.annexureNo && a.annexureNo.trim().length > 0)
  );

  // Facts paragraphs
  const paragraphs = data.complaintBody
    ? data.complaintBody.split('\n\n').filter((p) => p.trim().length > 0)
    : [];
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
  const paraCount = factsList.length.toString();

  const commissionTitle =
    cd.commissionName ||
    (isEn ? 'DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION' : 'जिला उपभोक्ता विवाद प्रतितोष आयोग');
  const commissionPlace = cd.commissionPlace || '________________________';

  // Build Document Children
  const children: (Paragraph | Table)[] = [];

  // =========================================================================
  // 1. INDEX PAGE
  // =========================================================================
  children.push(
    p(commissionTitle, { bold: true, align: AlignmentType.CENTER, size: 26, spaceBefore: 0, spaceAfter: 60 }),
    p(commissionPlace, { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 120 }),
    p(
      isEn
        ? `CONSUMER COMPLAINT NO. ${cd.complaintNo || '................'} OF ${currentFilingYear}`
        : `उपभोक्ता परिवाद वाद संख्या: ${cd.complaintNo || '................'} वर्ष ${currentFilingYear}`,
      { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 160 }
    ),
    pRuns(
      [
        { text: isEn ? 'IN THE MATTER OF:\n' : 'मामले में (IN THE MATTER OF):\n', bold: true },
        { text: `${primaryComplainant.name || '________________________'}   ` },
        { text: isEn ? '... COMPLAINANT(S)\n' : '... परिवादी\n', bold: true },
        { text: isEn ? 'VERSUS\n' : 'बनाम (VERSUS)\n', bold: true },
        { text: `${primaryOp.name || '________________________'}   ` },
        { text: isEn ? '... OPPOSITE PARTY/PARTIES' : '... विपक्षीगण', bold: true },
      ],
      { align: AlignmentType.CENTER, spaceAfter: 200 }
    ),
    p(isEn ? 'INDEX' : 'अनुक्रमणिका (INDEX)', {
      bold: true,
      underline: true,
      align: AlignmentType.CENTER,
      size: 26,
      spaceBefore: 120,
      spaceAfter: 140,
    })
  );

  // Index Table
  const indexTableRows: TableRow[] = [
    new TableRow({
      children: [
        createCell(isEn ? 'Sl. No.' : 'क्र. सं.', { bold: true, widthPercent: 12, align: AlignmentType.CENTER, bgColor: 'F2F2F2' }),
        createCell(isEn ? 'Particulars of Documents' : 'प्रपत्रों / दस्तावेजों का विवरण', { bold: true, widthPercent: 72, bgColor: 'F2F2F2' }),
        createCell(isEn ? 'Page No.' : 'पृष्ठ सं.', { bold: true, widthPercent: 16, align: AlignmentType.CENTER, bgColor: 'F2F2F2' }),
      ],
    }),
    new TableRow({
      children: [
        createCell('1.', { align: AlignmentType.CENTER }),
        createCell(isEn ? 'Proforma for Filing Consumer Complaint (Part 1 & 2)' : 'उपभोक्ता परिवाद दाखिल करने हेतु प्रपत्र (भाग 1 व 2)'),
        createCell('1 – 2', { align: AlignmentType.CENTER }),
      ],
    }),
    new TableRow({
      children: [
        createCell('2.', { align: AlignmentType.CENTER }),
        createCell(isEn ? 'List of Dates & Events' : 'तारीखों एवं घटनाओं का विवरण (Dates & Events)'),
        createCell('3', { align: AlignmentType.CENTER }),
      ],
    }),
    new TableRow({
      children: [
        createCell('3.', { align: AlignmentType.CENTER }),
        createCell(isEn ? 'Memo of Parties (Complainants & Opposite Parties)' : 'पक्षकारों का ज्ञापन (Memo of Parties)'),
        createCell('4', { align: AlignmentType.CENTER }),
      ],
    }),
    new TableRow({
      children: [
        createCell('4.', { align: AlignmentType.CENTER }),
        createCell(isEn ? 'Consumer Complaint Petition under Section 35 of CPA, 2019' : 'उपभोक्ता परिवाद पत्र (धारा 35, उपभोक्ता संरक्षण अधिनियम, 2019)'),
        createCell('5 – 6', { align: AlignmentType.CENTER }),
      ],
    }),
    new TableRow({
      children: [
        createCell('5.', { align: AlignmentType.CENTER }),
        createCell(isEn ? 'Affidavit in Support of Complaint' : 'परिवाद के समर्थन में शपथ पत्र (Affidavit in Support)'),
        createCell('7', { align: AlignmentType.CENTER }),
      ],
    }),
  ];

  validAnnexures.forEach((ann, idx) => {
    indexTableRows.push(
      new TableRow({
        children: [
          createCell(`${6 + idx}.`, { align: AlignmentType.CENTER }),
          createCell(`${ann.annexureNo || `Annexure-${idx + 1}`}: ${ann.title || (isEn ? 'Supporting Document' : 'साक्ष्य दस्तावेज')}`),
          createCell(`${8 + idx}`, { align: AlignmentType.CENTER }),
        ],
      })
    );
  });

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: indexTableRows,
    })
  );

  children.push(
    pRuns(
      [
        { text: '\n\n\n' },
        { text: isEn ? 'Place: ' : 'स्थान: ' },
        { text: `${primaryComplainant.district || '________________'}\n` },
        { text: isEn ? 'Date: ' : 'दिनांक: ' },
        { text: `${data.verificationDate || '________________'}\n\n` },
        { text: cd.hasAdvocate === 'Yes' || cd.advocateName ? (isEn ? 'Signature of Advocate' : 'हस्ताक्षर अधिवक्ता') : (isEn ? 'Signature of Complainant' : 'हस्ताक्षर परिवादी'), bold: true },
      ],
      { align: AlignmentType.RIGHT, spaceBefore: 200 }
    ),
    new Paragraph({ children: [new PageBreak()] })
  );

  // =========================================================================
  // 2. PROFORMA PART 1 & 2
  // =========================================================================
  children.push(
    p(commissionTitle, { bold: true, align: AlignmentType.CENTER, size: 26, spaceBefore: 0, spaceAfter: 60 }),
    p(commissionPlace, { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 120 }),
    p(isEn ? 'PROFORMA FOR FILING CONSUMER COMPLAINT' : 'उपभोक्ता परिवाद दाखिल करने हेतु प्रपत्र (PROFORMA)', {
      bold: true,
      underline: true,
      align: AlignmentType.CENTER,
      size: 26,
      spaceAfter: 180,
    })
  );

  const proformaRows: TableRow[] = [
    new TableRow({
      children: [
        createCell(isEn ? 'Name of Commission / District' : 'आयोग का नाम व जिला', { bold: true, widthPercent: 40 }),
        createCell(`${commissionTitle}, ${commissionPlace}`, { widthPercent: 60 }),
      ],
    }),
    new TableRow({
      children: [
        createCell(isEn ? 'State / Union Territory' : 'राज्य / केंद्र शासित प्रदेश', { bold: true }),
        createCell(cd.commissionState || primaryComplainant.state || '________________'),
      ],
    }),
    new TableRow({
      children: [
        createCell(isEn ? 'Dispute Category & Section' : 'विवाद की श्रेणी एवं लागू धारा', { bold: true }),
        createCell(`${cd.category || 'Consumer Dispute'} | Section 35(1)(a) CPA 2019`),
      ],
    }),
    new TableRow({
      children: [
        createCell(isEn ? 'Consumer Complaint No. / Filing Year' : 'परिवाद संख्या / आवेदन वर्ष', { bold: true }),
        createCell(`${cd.complaintNo || 'Registry will allot'} / ${currentFilingYear}`),
      ],
    }),
    new TableRow({
      children: [
        createCell(isEn ? 'Name & Address of Complainant' : 'परिवादी का नाम व पूर्ण पता', { bold: true }),
        createCell(
          `${primaryComplainant.name}, ${formatRelation(primaryComplainant.relationType, isEn)} ${primaryComplainant.parentName}\nVillage: ${primaryComplainant.village}, P.O.: ${primaryComplainant.po}, P.S.: ${primaryComplainant.ps}, District: ${primaryComplainant.district}, Pin: ${primaryComplainant.pinCode}\nPhone: ${primaryComplainant.phone || 'N/A'}, Email: ${primaryComplainant.email || 'N/A'}`
        ),
      ],
    }),
    new TableRow({
      children: [
        createCell(isEn ? 'Name & Address of Opposite Party(ies)' : 'विपक्षीगण का नाम व पूर्ण पता', { bold: true }),
        createCell(
          data.oppositeParties.map((op, i) => `${i + 1}. ${op.name} (${op.through || 'Authorized Signatory'}), ${op.address}`).join('\n')
        ),
      ],
    }),
    new TableRow({
      children: [
        createCell(isEn ? '1. Consideration Amount paid for Court Fees' : '1. न्यायालय फीस हेतु प्रतिफल राशि', { bold: true }),
        createCell(`Rs. ${considerationDisplay}/- (Rupees ${considerationWordsDisplay} only)`),
      ],
    }),
    new TableRow({
      children: [
        createCell(isEn ? '2. Claimed / Compensation Amount' : '2. कुल दावाकृत / क्षतिपूर्ति राशि', { bold: true }),
        createCell(`Rs. ${claimedDisplay}/- (Rupees ${claimedWordsDisplay} only), interest @ ${cd.interestRate || '12'}% p.a.`),
      ],
    }),
    new TableRow({
      children: [
        createCell(isEn ? 'Territorial & Pecuniary Jurisdiction' : 'प्रादेशिक एवं आर्थिक क्षेत्राधिकार', { bold: true }),
        createCell(isEn ? 'District Commission has full pecuniary & territorial jurisdiction.' : 'माननीय जिला आयोग को पूर्ण आर्थिक व प्रादेशिक क्षेत्राधिकार प्राप्त है।'),
      ],
    }),
    new TableRow({
      children: [
        createCell(isEn ? 'Limitation / Cause of Action Date' : 'परिसीमा / वाद कारण उत्पन्न होने की तिथि', { bold: true }),
        createCell(cd.dateOfCauseOfAction || (isEn ? 'Within statutory 2-year limitation period under Section 69' : 'धारा 69 के तहत 2 वर्ष की सांविधिक परिसीमा के भीतर')),
      ],
    }),
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: proformaRows,
    }),
    pRuns(
      [
        { text: '\n' },
        { text: isEn ? 'Verification:\n' : 'सत्यापन:\n', bold: true },
        { text: isEn ? 'Verified that the particulars stated above are true and correct to the best of my knowledge and belief.\n\n' : 'सत्यापित किया जाता है कि उपरोक्त विवरण मेरे ज्ञान व विश्वास के अनुसार पूर्णतः सत्य व सही है।\n\n' },
        { text: isEn ? 'Signature of Complainant / Advocate' : 'हस्ताक्षर परिवादी / अधिवक्ता', bold: true },
      ],
      { align: AlignmentType.RIGHT, spaceBefore: 120 }
    ),
    new Paragraph({ children: [new PageBreak()] })
  );

  // =========================================================================
  // 3. LIST OF DATES & EVENTS
  // =========================================================================
  children.push(
    p(commissionTitle, { bold: true, align: AlignmentType.CENTER, size: 26, spaceBefore: 0, spaceAfter: 60 }),
    p(commissionPlace, { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 120 }),
    p(
      isEn
        ? `Complaint Case No. ${cd.complaintNo || '...........'} / ${currentFilingYear}`
        : `उपभोक्ता परिवाद वाद संख्या: ${cd.complaintNo || '...........'} / ${currentFilingYear}`,
      { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 140 }
    ),
    pRuns(
      [
        { text: `${primaryComplainant.name}   ` },
        { text: isEn ? '... Complainant\n' : '... परिवादी\n', bold: true },
        { text: isEn ? 'V/s\n' : 'बनाम\n', bold: true },
        { text: `${primaryOp.name}   ` },
        { text: isEn ? '... O.Ps' : '... विपक्षीगण', bold: true },
      ],
      { align: AlignmentType.CENTER, spaceAfter: 200 }
    ),
    p(isEn ? 'DATE OF EVENTS (List of Dates & Events)' : 'घटनाओं एवं महत्वपूर्ण तिथियों का विवरण (List of Dates & Events)', {
      bold: true,
      underline: true,
      align: AlignmentType.CENTER,
      size: 26,
      spaceAfter: 160,
    })
  );

  const eventRows: TableRow[] = [
    new TableRow({
      children: [
        createCell(isEn ? 'S.No.' : 'क्र.सं.', { bold: true, widthPercent: 12, align: AlignmentType.CENTER, bgColor: 'F2F2F2' }),
        createCell(isEn ? 'Particulars / Description of Event' : 'घटना का विवरण', { bold: true, widthPercent: 68, bgColor: 'F2F2F2' }),
        createCell(isEn ? 'Date' : 'दिनांक', { bold: true, widthPercent: 20, align: AlignmentType.CENTER, bgColor: 'F2F2F2' }),
      ],
    }),
  ];

  if (data.events.length > 0) {
    data.events.forEach((evt, idx) => {
      eventRows.push(
        new TableRow({
          children: [
            createCell(`${idx + 1}.`, { align: AlignmentType.CENTER }),
            createCell(evt.description || ''),
            createCell(evt.date || '', { align: AlignmentType.CENTER }),
          ],
        })
      );
    });
  } else {
    eventRows.push(
      new TableRow({
        children: [
          createCell('1.', { align: AlignmentType.CENTER }),
          createCell(isEn ? 'Commencement date / Consideration paid' : 'आरंभ तिथि / प्रतिफल भुगतान'),
          createCell('___________', { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          createCell('2.', { align: AlignmentType.CENTER }),
          createCell(isEn ? 'Deficiency in service / Cause of action arose' : 'सेवा में कमी / वाद कारण उत्पन्न'),
          createCell('___________', { align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          createCell('3.', { align: AlignmentType.CENTER }),
          createCell(isEn ? 'Legal notice / Grievance representation sent' : 'कानूनी नोटिस / शिकायत पत्र प्रेषित'),
          createCell('___________', { align: AlignmentType.CENTER }),
        ],
      })
    );
  }

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: eventRows,
    }),
    pRuns(
      [
        { text: '\n\n' },
        { text: cd.hasAdvocate === 'Yes' || cd.advocateName ? (isEn ? 'Signature of Advocate' : 'हस्ताक्षर अधिवक्ता') : (isEn ? 'Signature of Complainant' : 'हस्ताक्षर परिवादी'), bold: true },
      ],
      { align: AlignmentType.RIGHT, spaceBefore: 160 }
    ),
    new Paragraph({ children: [new PageBreak()] })
  );

  // =========================================================================
  // 4. MEMO OF PARTIES
  // =========================================================================
  children.push(
    p(commissionTitle, { bold: true, align: AlignmentType.CENTER, size: 26, spaceBefore: 0, spaceAfter: 60 }),
    p(commissionPlace, { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 120 }),
    p(
      isEn
        ? `Complaint Case No. ${cd.complaintNo || '...........'} / ${currentFilingYear}`
        : `उपभोक्ता परिवाद वाद संख्या: ${cd.complaintNo || '...........'} / ${currentFilingYear}`,
      { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 140 }
    ),
    p(isEn ? 'MEMO OF PARTIES' : 'पक्षकारों का ज्ञापन (MEMO OF PARTIES)', {
      bold: true,
      underline: true,
      align: AlignmentType.CENTER,
      size: 26,
      spaceAfter: 180,
    })
  );

  data.complainants.forEach((c, idx) => {
    children.push(
      pRuns(
        [
          { text: `${idx + 1}. ${c.name}, `, bold: true },
          { text: `${formatRelation(c.relationType, isEn)} ${c.parentName}, ` },
          { text: `Resident of Village- ${c.village}, P.O.- ${c.po}, P.S.- ${c.ps}, District- ${c.district}${c.state ? `, ${c.state}` : ''}, Pin- ${c.pinCode}.\n` },
          { text: isEn ? `... Complainant No. ${idx + 1}` : `... परिवादी संख्या ${idx + 1}`, bold: true },
        ],
        { spaceAfter: 140 }
      )
    );
  });

  children.push(
    p(isEn ? 'VERSUS' : 'बनाम (VERSUS)', { bold: true, align: AlignmentType.CENTER, size: 24, spaceBefore: 120, spaceAfter: 120 })
  );

  data.oppositeParties.forEach((op, idx) => {
    children.push(
      pRuns(
        [
          { text: `(${idx + 1}) ${op.name}\n`, bold: true },
          { text: isEn ? `through its ${op.through || 'Authorized Signatory'}, situated at ` : `द्वारा इसके ${op.through || 'अधिकृत हस्ताक्षरकर्ता'}, स्थित- ` },
          { text: `${op.address}\n` },
          { text: isEn ? `... Opposite Party No. ${idx + 1}` : `... विपक्षी संख्या ${idx + 1}`, bold: true },
        ],
        { spaceAfter: 140 }
      )
    );
  });

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // =========================================================================
  // 5. CONSUMER COMPLAINT PETITION (SECTION 35 CPA 2019)
  // =========================================================================
  children.push(
    p(
      isEn
        ? 'IN THE COURT OF THE LEARNED PRESIDENT AND MEMBER,'
        : 'समक्ष माननीय अध्यक्ष एवं सदस्यगण का न्यायालय,',
      { bold: true, align: AlignmentType.CENTER, size: 26, spaceBefore: 0, spaceAfter: 40 }
    ),
    p(`${commissionTitle}, ${commissionPlace}`, { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 100 }),
    p(
      isEn
        ? `Consumer Complaint Case No. ${cd.complaintNo || '____________'} of ${currentFilingYear}`
        : `उपभोक्ता परिवाद वाद संख्या: ${cd.complaintNo || '____________'} वर्ष ${currentFilingYear}`,
      { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 100 }
    ),
    p(
      isEn
        ? 'Complaint under Section 35 of the Consumer Protection Act, 2019'
        : 'उपभोक्ता संरक्षण अधिनियम, 2019 की धारा 35 के अंतर्गत परिवाद पत्र',
      { bold: true, underline: true, align: AlignmentType.CENTER, size: 26, spaceAfter: 160 }
    ),
    pRuns(
      [
        {
          text: `${primaryComplainant.name}, ${formatRelation(primaryComplainant.relationType, isEn)} ${primaryComplainant.parentName}, Permanent resident of Village - ${primaryComplainant.village}, P.O. - ${primaryComplainant.po}, P.S. - ${primaryComplainant.ps}, District - ${primaryComplainant.district}; at present residing at ${primaryComplainant.presentAddress || primaryComplainant.village}, P.O. - ${primaryComplainant.po}, P.S. - ${primaryComplainant.ps}, District - ${primaryComplainant.district}.\n`,
        },
        { text: isEn ? '... Complainant' : '... परिवादी', bold: true },
      ],
      { spaceAfter: 120 }
    ),
    p(isEn ? 'VERSUS' : 'बनाम (VERSUS)', { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 120 })
  );

  data.oppositeParties.forEach((op, idx) => {
    children.push(
      pRuns(
        [
          { text: `${idx + 1}. ${op.name}\n`, bold: true },
          { text: isEn ? `Through its ${op.through || 'Authorized Signatory'}, Situated at: ${op.address}\n` : `द्वारा इसके ${op.through || 'अधिकृत हस्ताक्षरकर्ता'}, स्थित: ${op.address}\n` },
          { text: isEn ? `... Opposite Party No. ${idx + 1}` : `... विपक्षी संख्या ${idx + 1}`, bold: true },
        ],
        { spaceAfter: 100 }
      )
    );
  });

  // Consideration & Claimed Amounts
  children.push(
    p(
      isEn
        ? '1. CONSIDERATION AMOUNT PAID FOR THE PURPOSE OF ASSESSING COURT FEES:-'
        : '1. न्यायालय फीस निर्धारण हेतु भुगतान की गई प्रतिफल राशि:-',
      { bold: true, underline: true, spaceBefore: 140, spaceAfter: 40 }
    ),
    p(`Rs. ${considerationDisplay}/- (Rupees ${considerationWordsDisplay} only).`, { spaceAfter: 100 }),
    pRuns(
      [
        { text: isEn ? '2. Claimed Amount:- ' : '2. कुल दावा राशि:- ', bold: true },
        { text: `Rs. ${claimedDisplay}/- (Rupees ${claimedWordsDisplay} only), together with interest @ ${cd.interestRate || '12'}% per annum from the date of filing of this complaint, i.e., filing of complaint, till the date of actual payment.` },
      ],
      { spaceAfter: 100 }
    )
  );

  if (cd.valueOfGoods || cd.considerationAmount || cd.compensationAmount || cd.litigationAmount) {
    const breakdownRuns: { text: string; bold?: boolean }[] = [];
    if (cd.valueOfGoods) {
      breakdownRuns.push(
        { text: isEn ? '  (a) Value of Goods / Disputed Amount: ' : '  (a) माल / सेवा का मूल्य: ', bold: true },
        { text: `Rs. ${cd.valueOfGoods}/-\n` }
      );
    }
    if (cd.considerationAmount || cd.compensationAmount) {
      breakdownRuns.push(
        { text: isEn ? '  (b) Compensation Claimed: ' : '  (b) क्षतिपूर्ति राशि: ', bold: true },
        { text: `Rs. ${cd.compensationAmount || cd.considerationAmount}/-\n` }
      );
    }
    if (cd.litigationAmount) {
      breakdownRuns.push(
        { text: isEn ? '  (c) Litigation Amount: ' : '  (c) कानूनी खर्च: ', bold: true },
        { text: `Rs. ${cd.litigationAmount}/-\n` }
      );
    }
    children.push(pRuns(breakdownRuns, { spaceAfter: 100 }));
  }

  // Evidence & Witnesses
  children.push(
    pRuns(
      [
        { text: isEn ? '3. EVIDENCE & WITNESSES: - ' : '3. साक्ष्य एवं गवाह: - ', bold: true },
        { text: isEn ? 'As stated below and as per the documents annexed herewith.' : 'यथा संलग्न दस्तावेजों एवं नीचे दिए गए विवरण के अनुसार।' },
      ],
      { spaceAfter: 60 }
    )
  );

  if (validAnnexures.length > 0) {
    validAnnexures.forEach((ann, idx) => {
      children.push(
        pRuns(
          [
            { text: `  ${ann.annexureNo || `Annexure-${idx + 1}`}: `, bold: true },
            { text: ann.title || '' },
          ],
          { spaceAfter: 40 }
        )
      );
    });
  } else {
    children.push(p('  Annexure-1: _______________________________________________', { spaceAfter: 40 }));
  }

  // Witnesses in favour of complainant
  children.push(
    p(isEn ? 'WITNESSES IN FAVOUR OF THE COMPLAINANT:-' : 'परिवादी के पक्ष में गवाह (WITNESSES IN FAVOUR OF THE COMPLAINANT):-', {
      bold: true,
      underline: true,
      spaceBefore: 120,
      spaceAfter: 40,
    }),
    p(isEn ? '  1. The Complainant herself/himself.\n  2. Other independent witness(es), if any.' : '  1. परिवादी स्वयं।\n  2. अन्य स्वतंत्र गवाह, यदि कोई हो।', {
      bold: true,
      spaceAfter: 140,
    }),
    p(isEn ? 'MOST RESPECTFULLY SHOWETH:-' : 'सादर निवेदन निम्नवत प्रस्तुत है (MOST RESPECTFULLY SHOWETH):-', {
      bold: true,
      size: 26,
      spaceBefore: 140,
      spaceAfter: 100,
    })
  );

  // Facts Paragraphs
  factsList.forEach((fact) => {
    children.push(p(fact, { spaceAfter: 120 }));
  });

  // Prayer
  children.push(
    p(isEn ? 'PRAYER' : 'प्रार्थना (PRAYER)', {
      bold: true,
      underline: true,
      align: AlignmentType.CENTER,
      size: 26,
      spaceBefore: 160,
      spaceAfter: 100,
    }),
    p(
      isEn
        ? "It is, therefore, most respectfully prayed that this Hon'ble District Consumer Disputes Redressal Commission may graciously be pleased to:"
        : "अतः माननीय जिला उपभोक्ता विवाद प्रतितोष आयोग से सादर सविनय प्रार्थना है कि न्यायहित में कृपापूर्वक निम्न आदेश पारित करने की कृपा की जाए:",
      { spaceAfter: 100 }
    )
  );

  if (data.prayer && data.prayer.trim().length > 0) {
    children.push(p(data.prayer, { spaceAfter: 120 }));
  } else {
    children.push(
      p(
        isEn
          ? `(i) Direct the Opposite Parties, jointly and severally, to pay to the complainant the claimed / refund amount of Rs. ${claimedDisplay}/- (Rupees ${claimedWordsDisplay} only), together with interest @ ${cd.interestRate || '12'}% per annum from the date of filing of this complaint, till the date of actual payment.`
          : `(i) यह कि विपक्षीगण को संयुक्त एवं पृथक रूप से निर्देश दिया जाए कि वे परिवादी को दावाकृत / धन वापसी राशि रु. ${claimedDisplay}/- (अक्षरे ${claimedWordsDisplay} रुपये मात्र), ब्याज सहित @ ${cd.interestRate || '12'}% प्रति वर्ष की दर से वास्तविक भुगतान होने तक अदा करें।`,
        { spaceAfter: 100 }
      ),
      p(
        isEn
          ? `(ii) Direct the Opposite Parties, jointly and severally, to pay a sum of Rs. ${cd.compensationAmount || cd.considerationAmount || '4,50,000'}/- to the complainant as compensation for the immense mental agony, physical harassment, financial hardship and emotional trauma suffered due to deficiency in service and unfair trade practice, together with interest @ ${cd.interestRate || '12'}% per annum.`
          : `(ii) यह कि विपक्षीगण को परिवादी को सेवा में गंभीर कमी एवं अनुचित व्यापार व्यवहार के कारण हुई भारी मानसिक संताप, शारीरिक प्रताड़ना एवं आर्थिक क्षति के हर्जाने / मुआवजे के रूप में रु. ${cd.compensationAmount || cd.considerationAmount || '4,50,000'}/- का भुगतान करने का आदेश दिया जाए।`,
        { spaceAfter: 100 }
      ),
      p(
        isEn
          ? `(iii) Direct the Opposite Parties to pay Rs. ${cd.litigationAmount || '50,000'}/- towards litigation expenses and incidental costs incurred by the complainant.`
          : `(iii) यह कि विपक्षीगण को परिवादी द्वारा परिवाद दाखिल करने में हुए वाद व्यय एवं कानूनी खर्च हेतु रु. ${cd.litigationAmount || '50,000'}/- अदा करने का निर्देश दिया जाए।`,
        { spaceAfter: 100 }
      ),
      p(
        isEn
          ? '(iv) Pass any other or further order(s), direction(s) or relief(s) as this Hon\'ble Commission may deem fit and proper in the facts and circumstances of the case.'
          : '(iv) यह कि अन्य कोई भी अनुतोष, आदेश अथवा निर्देश जो माननीय आयोग मामले के तथ्यों एवं परिस्थितियों के आलोक में उचित एवं न्यायसंगत समझे, परिवादी के पक्ष में पारित करने की कृपा की जाए।',
        { spaceAfter: 120 }
      )
    );
  }

  children.push(
    p(
      isEn
        ? 'AND FOR THIS ACT OF KINDNESS, THE COMPLAINANT AS IN DUTY BOUND SHALL EVER PRAY.'
        : 'एवं इस कृपा कार्य हेतु परिवादी सदा कर्तव्यबद्ध व प्रार्थनारत रहेगा।',
      { bold: true, align: AlignmentType.CENTER, spaceBefore: 120, spaceAfter: 140 }
    ),
    pRuns(
      [
        { text: isEn ? 'Place: ' : 'स्थान: ' },
        { text: `${primaryComplainant.district || '________________'}\n` },
        { text: isEn ? 'Date: ' : 'दिनांक: ' },
        { text: `${data.verificationDate || '________________'}\n\n` },
        { text: cd.hasAdvocate === 'Yes' || cd.advocateName ? (isEn ? 'Through Counsel / Advocate' : 'द्वारा अधिवक्ता') : (isEn ? 'Complainant in Person' : 'परिवादी (व्यक्तिगत रूप से)'), bold: true },
      ],
      { align: AlignmentType.RIGHT, spaceAfter: 180 }
    ),
    // Verification
    p(isEn ? 'VERIFICATION' : 'सत्यापन (VERIFICATION)', {
      bold: true,
      underline: true,
      align: AlignmentType.CENTER,
      size: 26,
      spaceBefore: 160,
      spaceAfter: 100,
    }),
    p(
      isEn
        ? `I, ${primaryComplainant.name}, ${formatRelation(primaryComplainant.relationType, true)} ${primaryComplainant.parentName}, resident of Village ${primaryComplainant.village}, P.O. ${primaryComplainant.po}, P.S. ${primaryComplainant.ps}, District ${primaryComplainant.district}, the above-named complainant, do hereby verify that the statements made in paragraphs 1 to ${paraCount} of the accompanying complaint are true and correct to my personal knowledge, information and belief and the records of the case, and that nothing material has been concealed or suppressed therefrom.`
        : `मैं, ${primaryComplainant.name}, ${formatRelation(primaryComplainant.relationType, false)} ${primaryComplainant.parentName}, निवासी ग्राम ${primaryComplainant.village}, डाकघर ${primaryComplainant.po}, थाना ${primaryComplainant.ps}, जिला ${primaryComplainant.district}, उपरोक्त नामित परिवादी, सत्यनिष्ठापूर्वक सत्यापित करता/करती हूँ कि संलग्न परिवाद पत्र के प्रस्तर 1 से ${paraCount} में वर्णित समस्त कथन मेरे निजी ज्ञान, विश्वास एवं अभिलेखों के अनुसार सत्य व सही हैं तथा इसमें कोई भी सारवान तथ्य छिपाया अथवा दबाया नहीं गया है।`,
      { spaceAfter: 120 }
    ),
    p(
      isEn
        ? `Verified at ${primaryComplainant.district || '________________'} on this ${data.verificationDate || '________________'}.`
        : `आज दिनांक ${data.verificationDate || '________________'} को ${primaryComplainant.district || '________________'} में सत्यापित किया गया।`,
      { spaceAfter: 120 }
    ),
    pRuns(
      [
        { text: '\n\n' },
        { text: isEn ? 'Signature of Complainant' : 'हस्ताक्षर परिवादी', bold: true },
      ],
      { align: AlignmentType.RIGHT, spaceAfter: 140 }
    ),
    new Paragraph({ children: [new PageBreak()] })
  );

  // =========================================================================
  // 6. AFFIDAVIT IN SUPPORT OF COMPLAINT
  // =========================================================================
  children.push(
    p(commissionTitle, { bold: true, align: AlignmentType.CENTER, size: 26, spaceBefore: 0, spaceAfter: 60 }),
    p(commissionPlace, { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 120 }),
    p(
      isEn
        ? `Complaint Case No. ${cd.complaintNo || '..........'} / ${currentFilingYear}`
        : `उपभोक्ता परिवाद वाद संख्या: ${cd.complaintNo || '..........'} / ${currentFilingYear}`,
      { bold: true, align: AlignmentType.CENTER, size: 24, spaceAfter: 140 }
    ),
    pRuns(
      [
        { text: `${primaryComplainant.name}   ` },
        { text: isEn ? '... Complainant\n' : '... परिवादी\n', bold: true },
        { text: isEn ? 'Versus\n' : 'बनाम (Versus)\n', bold: true },
        { text: `${primaryOp.name}   ` },
        { text: isEn ? '... O.Ps' : '... विपक्षीगण', bold: true },
      ],
      { align: AlignmentType.CENTER, spaceAfter: 180 }
    ),
    p(isEn ? 'AFFIDAVIT' : 'शपथ पत्र (AFFIDAVIT)', {
      bold: true,
      underline: true,
      align: AlignmentType.CENTER,
      size: 26,
      spaceAfter: 160,
    }),
    p(
      isEn
        ? `I, ${primaryComplainant.name}, ${formatRelation(primaryComplainant.relationType, true)} ${primaryComplainant.parentName}, resident of Village ${primaryComplainant.village}, P.O. ${primaryComplainant.po}, P.S. ${primaryComplainant.ps}, District ${primaryComplainant.district}, the above-named complainant, do hereby solemnly affirm and state on oath as follows:`
        : `मैं, ${primaryComplainant.name}, ${formatRelation(primaryComplainant.relationType, false)} ${primaryComplainant.parentName}, निवासी ग्राम ${primaryComplainant.village}, डाकघर ${primaryComplainant.po}, थाना ${primaryComplainant.ps}, जिला ${primaryComplainant.district}, उपरोक्त नामित परिवादी/शपथकर्ता, सत्यनिष्ठापूर्वक शपथ लेता/लेती हूँ एवं निम्न बयान करता/करती हूँ:`,
      { spaceAfter: 120 }
    ),
    p(
      isEn
        ? '1. That I am the complainant in the accompanying consumer complaint and, being fully acquainted with the facts and circumstances of the case, I am competent to swear this affidavit.\n\n' +
          `2. That I have read and understood the contents of the accompanying consumer complaint, and the statements made in paragraphs 1 to ${paraCount} thereof are true and correct to my personal knowledge, information and belief.\n\n` +
          '3. That all the annexures annexed with the accompanying complaint are true Xerox copies of their respective originals and are relied upon in support of the present complaint.\n\n' +
          '4. That the statements made in the accompanying complaint are true and correct, and nothing material has been concealed or suppressed therefrom.\n\n' +
          '5. That this affidavit is being sworn for the purpose of supporting the accompanying consumer complaint and the documents annexed thereto before this Hon\'ble Commission.'
        : '1. यह कि मैं संलग्न उपभोक्ता परिवाद का परिवादी/शपथकर्ता हूँ तथा मामले के तथ्यों एवं परिस्थितियों से पूर्णतः भली-भांति अवगत होने के कारण यह शपथ पत्र प्रस्तुत करने हेतु पूर्णतः सक्षम हूँ।\n\n' +
          `2. यह कि मैंने संलग्न परिवाद पत्र की विषय-वस्तु को भली-भांति पढ़ व समझ लिया है, तथा इसके प्रस्तर 1 से ${paraCount} में वर्णित समस्त कथन मेरे निजी ज्ञान, विश्वास एवं अभिलेखों के अनुसार सत्य व सही हैं।\n\n` +
          '3. यह कि संलग्न परिवाद पत्र के साथ प्रस्तुत किए गए समस्त संलग्नक (Annexures) अपने-अपने मूल दस्तावेजों की सत्य छायाप्रतियां हैं, जिन पर इस परिवाद के समर्थन में भरोसा किया गया है।\n\n' +
          '4. यह कि संलग्न परिवाद पत्र में किया गया प्रत्येक कथन सत्य व सही है तथा इसमें किसी भी सारवान तथ्य को छिपाया अथवा दबाया नहीं गया है।\n\n' +
          '5. यह कि यह शपथ पत्र इस माननीय आयोग के समक्ष संलग्न उपभोक्ता परिवाद एवं साक्ष्य दस्तावेजों के समर्थन हेतु प्रस्तुत किया जा रहा है।',
      { spaceAfter: 140 }
    ),
    p(
      isEn
        ? `Solemnly affirmed before me on this ${data.affidavitDate || '________________'}.`
        : `आज दिनांक ${data.affidavitDate || '________________'} को मेरे समक्ष सत्यनिष्ठापूर्वक शपथ ली गई।`,
      { spaceAfter: 140 }
    ),
    pRuns(
      [
        { text: isEn ? 'Identified by: ____________________\nAdvocate\n\n' : 'पहचानकर्ता: ____________________\nअधिवक्ता\n\n', bold: true },
        { text: isEn ? 'Deponent (Complainant)' : 'शपथकर्ता (परिवादी)', bold: true },
      ],
      { align: AlignmentType.RIGHT, spaceBefore: 120 }
    )
  );

  // Assemble Complete Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1800, // 1.25 inch court margin
              right: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export async function exportToDocx(
  data: ComplaintFormData,
  filename = 'Consumer_Complaint.docx'
): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const blob = await generateDocxBlob(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to generate MS Word (.docx) document:', err);
    throw err;
  }
}
