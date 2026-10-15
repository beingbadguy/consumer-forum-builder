'use client';

import React from 'react';
import { ComplaintFormData, OppositeParty } from '../../types/complaint';

interface LegalPagesProps {
  data: ComplaintFormData;
  pageFilter?: number | null; // null means show all pages
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

const opSuffix = (ops: OppositeParty[]) => {
  if (ops.length <= 1) return '';
  if (ops.length === 2) return ' & Another';
  return ' & Others';
};

export const LegalPages: React.FC<LegalPagesProps> = ({ data, pageFilter }) => {
  const cd = data.caseDetails;
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

  // Helper to format date parts
  const parseDate = (dStr?: string) => {
    if (!dStr) return { day: '____', month: '________________', year: '____' };
    const dateObj = new Date(dStr);
    if (isNaN(dateObj.getTime())) {
      const parts = dStr.split(/[\/\-]/);
      if (parts.length === 3) {
        return { day: parts[0] || parts[2], month: parts[1], year: parts[2] || parts[0] };
      }
      return { day: dStr, month: '', year: '' };
    }
    const day = dateObj.getDate().toString();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear().toString();
    return { day, month, year };
  };

  const verDate = parseDate(data.verificationDate);
  const affDate = parseDate(data.affidavitDate);

  // Count total complaint paragraphs
  const paragraphs = data.complaintBody
    ? data.complaintBody.split('\n\n').filter((p) => p.trim().length > 0)
    : [];
  const paraCount = paragraphs.length > 0 ? paragraphs.length.toString() : '6';

  // Slicing Annexures for page 5 & page 6
  const annexuresPage5 = data.annexures.slice(0, 4);
  const annexuresPage6 = data.annexures.slice(4);

  return (
    <div className="flex flex-col items-center">
      {/* ================= PAGE 1 ================= */}
      {(!pageFilter || pageFilter === 1) && (
        <div className="legal-a4-sheet" id="legal-page-1">
          <div className="text-center font-bold tracking-wide text-[13pt] uppercase mb-1">
            {cd.commissionName || 'DISTRICT CONSUMER DISPUTE REDRESSAL COMMISSION'}
          </div>
          <div className="text-center text-[12pt] font-semibold mb-3">
            {cd.commissionPlace ? `${cd.commissionPlace}` : '________________________'}
          </div>

          <div className="text-center font-bold text-[12pt] uppercase underline tracking-wider mb-5">
            PROFORMA FOR FILING CONSUMER COMPLAINT
          </div>

          <table className="legal-table">
            <tbody>
              <tr>
                <td className="w-1/2 font-bold align-top">
                  CONSUMER COMPLAINT No. {cd.complaintNo ? <span className="underline font-bold">{cd.complaintNo}</span> : '................................'} OF 20{cd.complaintYear ? cd.complaintYear.slice(-2) : '______'}
                </td>
                <td className="w-1/2 align-top"></td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  Name and address of the complainant with telephone number(s) and e-mail.
                </td>
                <td className="w-1/2">
                  <div className="font-semibold">{primaryComplainant.name || '—'}</div>
                  <div className="text-[10pt] leading-tight mt-1">
                    {primaryComplainant.address ||
                      `${primaryComplainant.village ? 'Vill: ' + primaryComplainant.village + ', ' : ''}${primaryComplainant.district ? primaryComplainant.district : ''}`}
                  </div>
                  {(primaryComplainant.phone || primaryComplainant.email) && (
                    <div className="text-[10pt] mt-1 text-slate-800">
                      {primaryComplainant.phone && <span>Mob: {primaryComplainant.phone} </span>}
                      {primaryComplainant.email && <span>Email: {primaryComplainant.email}</span>}
                    </div>
                  )}
                  {data.complainants.length > 1 && (
                    <div className="text-[9pt] italic mt-1 text-slate-600">
                      (+ {data.complainants.length - 1} more Complainant(s))
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">Total Consideration paid</td>
                <td className="w-1/2">
                  {cd.totalConsideration ? `Rs. ${cd.totalConsideration}/-` : '—'}
                  {cd.totalConsiderationWords && (
                    <span className="block text-[10pt] italic">
                      (Rupees {cd.totalConsiderationWords} only)
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">Claimed Amount</td>
                <td className="w-1/2">
                  {cd.claimedAmount ? `Rs. ${cd.claimedAmount}/-` : '—'}
                  {cd.claimedAmountWords && (
                    <span className="block text-[10pt] italic">
                      (Rupees {cd.claimedAmountWords} only)
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  Nature of the consumer dispute involved (To indicate the category) Case Category (Whether Housing, Insurance, Medical etc.)
                </td>
                <td className="w-1/2 font-semibold">
                  {cd.category || 'Insurance'}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  Project Name (relates to a housing category) (Indicate page no. where mentioned)
                </td>
                <td className="w-1/2">
                  {cd.hasHousingProject === 'Yes' || cd.category === 'Housing' || cd.projectName ? (
                    <span>
                      {cd.projectName || fill(undefined, 25)}
                      {cd.projectMentionPage && (
                        <span className="text-[10pt] text-slate-700 block">
                          (Page No: {cd.projectMentionPage})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-slate-600">N/A (Not Housing dispute)</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  For Refund/Possession/ return of principal amount/interest. (relates to a housing category)
                </td>
                <td className="w-1/2">
                  {cd.hasHousingProject === 'Yes' || cd.category === 'Housing'
                    ? cd.refundOrPossession || fill(undefined, 25)
                    : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  Please specify section
                  <div className="font-normal text-[10.5pt] mt-1 space-y-0.5">
                    <div>Section 35(I) (a)</div>
                    <div>Section 35(I) (b)</div>
                    <div>Section 35(I) (c)</div>
                  </div>
                </td>
                <td className="w-1/2 align-middle">
                  <div className="font-semibold">
                    {cd.section ||
                      (cd.sectionsList && cd.sectionsList.length > 0
                        ? cd.sectionsList.join(', ')
                        : 'Section 35(I) (a)')}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  If the consumer dispute relates to a housing or land development project, details of the pending Consumer Complaint(s), if any, in respect of the same project.
                </td>
                <td className="w-1/2">
                  {cd.pendingHousingComplaints || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  Details of any pending/disposed of Consumer Complaint, if any, involving identical question of law.
                </td>
                <td className="w-1/2">
                  {cd.pendingIdenticalLaw || 'None'}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">Date of cause of action.</td>
                <td className="w-1/2">{cd.dateOfCauseOfAction || '—'}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">State of cause of action.</td>
                <td className="w-1/2">{cd.stateOfCauseOfAction || primaryComplainant.state || '—'}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">District of cause of action.</td>
                <td className="w-1/2">{cd.districtOfCauseOfAction || primaryComplainant.district || '—'}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  Delay, if any, computing the period of limitation, from the date of cause of action.
                </td>
                <td className="w-1/2">
                  {cd.limitationDelay || (cd.hasDelay === 'Yes' ? 'Yes, delay occurred. Application for condonation of delay filed.' : 'No delay. Complaint filed within the statutory limitation period under Section 69.')}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-right text-[10pt] text-slate-500 mt-2">Page 1 of 9</div>
        </div>
      )}

      {/* ================= PAGE 2 ================= */}
      {(!pageFilter || pageFilter === 2) && (
        <div className="legal-a4-sheet" id="legal-page-2">
          <table className="legal-table">
            <tbody>
              <tr>
                <td className="w-1/2 font-bold align-top">
                  CONSUMER COMPLAINT No. {cd.complaintNo ? <span className="underline font-bold">{cd.complaintNo}</span> : '................................'} OF 20{cd.complaintYear ? cd.complaintYear.slice(-2) : '______'}
                </td>
                <td className="w-1/2 align-top"></td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  In case of any delay, whether any application for condonation of delay in filing the Consumer Complaint is filed, is attached, with Notarised affidavit.
                </td>
                <td className="w-1/2">
                  {cd.condonationApplicationAttached || (cd.hasDelay === 'Yes' ? 'Yes (Attached with Notarised affidavit)' : 'N/A')}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">Whether the documents filed are attested true copies?</td>
                <td className="w-1/2 font-semibold">{cd.documentsAttestedTrueCopies || 'Yes'}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  Whether English translations of all the documents in vernacular, are filed?
                </td>
                <td className="w-1/2">{cd.englishTranslationsFiled || 'N/A'}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  Telephone Number (s) (Landline as well as Mobile) and e-mail address, are filed?
                </td>
                <td className="w-1/2 font-semibold">{cd.phoneEmailFiled || 'Yes'}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-bold">
                  Name, address, telephone Nos. (Landline as well as Mobile) and e-mail address of the Advocate for the Complainant.
                </td>
                <td className="w-1/2">
                  <div className="font-semibold">{cd.advocateName || fill(undefined, 25)}</div>
                  <div className="text-[10pt] mt-1">{cd.advocateAddress || 'Advocate, District Court'}</div>
                  {(cd.advocatePhone || cd.advocateEmail) && (
                    <div className="text-[10pt] mt-1">
                      {cd.advocatePhone && <div>Mob: {cd.advocatePhone}</div>}
                      {cd.advocateEmail && <div>Email: {cd.advocateEmail}</div>}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-14 text-center">
            <span className="font-bold underline text-[12pt] uppercase tracking-wider">VERIFICATION</span>
          </div>

          <div className="mt-8 text-justify leading-relaxed text-[12.5pt]">
            I, {fill(primaryComplainant.name, 35)}, the Complainant/Counsel/Authorised Representative, above mentioned, do hereby verify that the information provided herein above is true and complete in all respects and nothing material has been concealed therefrom.
          </div>

          <div className="mt-24 text-right">
            <div className="inline-block text-center mr-4">
              <div className="font-mono text-slate-600 mb-1">......................................................</div>
              <div className="font-semibold text-[11.5pt]">Signature of the Complainant/</div>
              <div className="font-semibold text-[11.5pt]">Counsel / Authorised Representative</div>
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-20">Page 2 of 9</div>
        </div>
      )}

      {/* ================= PAGE 3 ================= */}
      {(!pageFilter || pageFilter === 3) && (
        <div className="legal-a4-sheet" id="legal-page-3">
          <div className="text-[12pt]">Before,</div>
          <div className="pl-14 mt-4 text-[12.5pt] leading-snug">
            <div>The Court of learned President &amp; Members,</div>
            <div>{cd.commissionName || 'District Consumer Dispute Redressal Commission'},</div>
            <div>{cd.commissionPlace ? `${cd.commissionPlace}.` : '________________________.'}</div>
          </div>

          <div className="text-center font-bold text-[12pt] mt-6">
            Complaint Case No. -: {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '...........'} / 20{cd.complaintYear ? cd.complaintYear.slice(-2) : '______'}
          </div>

          <div className="mt-6 flex justify-between items-baseline text-[12pt]">
            <div className="border-b border-black flex-1 mr-2 font-semibold">
              {primaryComplainant.name || '_______________________________________________'}
              {data.complainants.length > 1 ? ` & ${data.complainants.length - 1} Others` : ''}
            </div>
            <div className="font-bold whitespace-nowrap">...........................Complainant.</div>
          </div>

          <div className="text-center font-bold text-[12pt] my-3">V/s</div>

          <div className="flex justify-between items-baseline text-[12pt]">
            <div className="border-b border-black flex-1 mr-2 font-semibold">
              {primaryOp.name || '_______________________________________________'}
              {opSuffix(data.oppositeParties)}
            </div>
            <div className="font-bold whitespace-nowrap">...............O.Ps.</div>
          </div>

          <div className="mt-8 text-center font-bold underline text-[12pt]">
            Date of Events
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
                    <td>Event description / Commencement date</td>
                    <td className="w-40"></td>
                  </tr>
                  <tr>
                    <td className="w-12 text-center">2.</td>
                    <td>Date on which grievance / cause of action arose</td>
                    <td className="w-40"></td>
                  </tr>
                  <tr>
                    <td className="w-12 text-center">3.</td>
                    <td>Legal notice / communication date</td>
                    <td className="w-40"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          <div className="mt-32 text-right">
            <div className="inline-block text-center mr-4">
              <div className="font-mono text-slate-600 mb-1">.................................</div>
              <div className="font-bold text-[12pt]">Signature of Advocate</div>
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-20">Page 3 of 9</div>
        </div>
      )}

      {/* ================= PAGE 4 ================= */}
      {(!pageFilter || pageFilter === 4) && (
        <div className="legal-a4-sheet" id="legal-page-4">
          <div className="text-[12pt]">In,</div>
          <div className="pl-14 mt-4 text-[12.5pt] leading-snug">
            <div>The Court of learned President &amp; Member,</div>
            <div>{cd.commissionName || 'District Consumer Dispute Redressal Commission'},</div>
            <div>{cd.commissionPlace ? `${cd.commissionPlace}.` : '________________________.'}</div>
          </div>

          <div className="text-center font-bold text-[12pt] mt-6">
            Complaint Case No.:- {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '...........'} / 20{cd.complaintYear ? cd.complaintYear.slice(-2) : '______'}
          </div>

          <div className="text-center font-bold underline text-[12.5pt] uppercase mt-6 mb-8">
            Memo of Parties
          </div>

          {/* Complainants list */}
          <div className="space-y-4">
            {data.complainants.map((c, i) => (
              <div key={i} className="text-[12pt] leading-relaxed">
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
              </div>
            ))}
          </div>

          {/* Opposite parties list (Formatted with Roman Numerals (i), (ii), (iii)...) */}
          <div className="mt-10 space-y-6">
            {data.oppositeParties.map((op, i) => (
              <div key={i} className="text-[12pt] leading-relaxed">
                <div className="font-semibold">
                  ({toRoman(i + 1)}) {fill(op.name, 40)}
                </div>
                <div className="mt-1 pl-6">
                  through its {fill(op.through || 'Authorized Signatory', 25)}, situated at
                </div>
                <div className="mt-1 pl-6 font-semibold">
                  {fill(op.address, 40)}
                </div>
              </div>
            ))}
            <div className="text-right font-bold text-[12pt] mt-4">
              .......................... O.Ps
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-28">Page 4 of 9</div>
        </div>
      )}

      {/* ================= PAGE 5 ================= */}
      {(!pageFilter || pageFilter === 5) && (
        <div className="legal-a4-sheet" id="legal-page-5">
          <div className="text-center font-bold text-[12.5pt] leading-snug">
            <div>IN THE COURT OF THE LEARNED PRESIDENT AND MEMBER,</div>
            <div>{cd.commissionName || 'DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION'}, {cd.commissionPlace || '________________________'}</div>
          </div>

          <div className="text-center font-bold text-[11.5pt] mt-4">
            Consumer Complaint Case No. {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '____________'} of 20{cd.complaintYear ? cd.complaintYear.slice(-2) : '______'}
          </div>

          <div className="text-center font-bold underline text-[12pt] mt-3">
            Complaint under Section 35 of the Consumer Protection Act, 2019
          </div>

          {/* Complainant Header */}
          <div className="mt-5 text-[11.5pt] leading-relaxed text-justify">
            {fill(primaryComplainant.name, 35)}, {primaryComplainant.relationType || 'wife/son/daughter of'} {fill(primaryComplainant.parentName, 20)}, Permanent resident of Village - {fill(primaryComplainant.village, 20)}, P.O. - {fill(primaryComplainant.po, 10)}, P.S. - {fill(primaryComplainant.ps, 10)}, District - {fill(primaryComplainant.district, 20)}; at present residing at {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, P.O. - {fill(primaryComplainant.po, 10)}, P.S. - {fill(primaryComplainant.ps, 10)}, District - {fill(primaryComplainant.district, 20)}.
          </div>
          <div className="text-right font-bold text-[11.5pt] mt-1">...........Complainant</div>

          <div className="text-center font-bold text-[12pt] my-3">VERSUS</div>

          {/* CRITICAL FIX: Render ALL Opposite Parties in complaint petition (Resolves 'Memo of partie मे 3 number party Add किये तो नही आया') */}
          <div className="space-y-3">
            {data.oppositeParties.map((op, idx) => (
              <div key={idx} className="text-[11.5pt] leading-relaxed">
                <div className="font-bold">{idx + 1}. {fill(op.name, 40)}</div>
                <div className="pl-4 mt-0.5">
                  Through its {fill(op.through || 'Authorized Signatory', 25)}, Situated at {fill(op.address, 35)}
                </div>
                <div className="text-right font-bold text-[11.5pt] mt-0.5">
                  .........Opposite Party No. {idx + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 text-[11.5pt] leading-relaxed">
            {/* GENERALIZED: Consideration amount heading without hardcoded life insurance terms */}
            <div className="font-bold uppercase underline">
              1. CONSIDERATION AMOUNT PAID FOR THE PURPOSE OF ASSESSING COURT FEES:-
            </div>
            <div className="mt-1">
              Rs. {fill(cd.totalConsideration, 12)}/- (Rupees {fill(cd.totalConsiderationWords, 25)} only).
            </div>

            <div className="mt-3">
              <span className="font-bold">2. Claimed Amount:-</span> Rs. {fill(cd.claimedAmount, 12)}/- (Rupees {fill(cd.claimedAmountWords, 25)} only), together with interest @ {fill(cd.interestRate, 4)}% per annum from the date of {fill(cd.interestFromDate || cd.dateOfCauseOfAction || 'filing of this complaint', 15)}, i.e., {fill(cd.interestFromDate || cd.dateOfCauseOfAction || 'filing of complaint', 12)}, till the date of actual payment.
            </div>

            <div className="mt-3">
              <span className="font-bold">3. EVIDENCE &amp; WITNESSES: -</span> As stated below and as per the documents annexed herewith.
            </div>

            <div className="mt-2 pl-4 space-y-1">
              {annexuresPage5.map((ann, idx) => (
                <div key={idx}>
                  <span className="font-bold">{ann.annexureNo || `Annexure-${idx + 1}`}: </span>
                  {fill(ann.title, 40)}
                </div>
              ))}
              {annexuresPage5.length === 0 && (
                <>
                  <div><span className="font-bold">Annexure-1: </span>_______________________________________________</div>
                  <div><span className="font-bold">Annexure-2: </span>_______________________________________________</div>
                  <div><span className="font-bold">Annexure-3: </span>_______________________________________________</div>
                  <div><span className="font-bold">Annexure-4: </span>_______________________________________________</div>
                </>
              )}
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-6">Page 5 of 9</div>
        </div>
      )}

      {/* ================= PAGE 6 ================= */}
      {(!pageFilter || pageFilter === 6) && (
        <div className="legal-a4-sheet" id="legal-page-6">
          <div className="space-y-1.5 pl-4 text-[11.5pt]">
            {annexuresPage6.map((ann, idx) => (
              <div key={idx}>
                <span className="font-bold">{ann.annexureNo || `Annexure-${idx + 5}`}: </span>
                {fill(ann.title, 40)}
              </div>
            ))}
            {annexuresPage6.length === 0 && (
              <>
                <div><span className="font-bold">Annexure-5: </span>_______________________________________________</div>
                <div><span className="font-bold">Annexure-6: </span>_______________________________________________</div>
                <div><span className="font-bold">Annexure-7: </span>_______________________________________________</div>
                <div><span className="font-bold">Annexure-8: </span>_______________________________________________</div>
              </>
            )}
            <div className="text-[10pt] italic text-slate-600 mt-1">(Add further annexures as applicable)</div>
          </div>

          <div className="mt-6 text-[12pt]">
            <div className="font-bold uppercase underline">WITNESSES IN FAVOUR OF THE COMPLAINANT:-</div>
            <div className="mt-2 pl-4 space-y-1 font-semibold">
              <div>The Complainant herself/himself.</div>
              <div>Other independent witness(es), if any.</div>
            </div>
          </div>

          <div className="mt-8 font-bold uppercase text-[12pt] leading-tight">
            <div>MOST RESPECTFULLY</div>
            <div>SHOWETH:-</div>
          </div>

          {/* Render Narrative paragraphs */}
          <div className="mt-4 space-y-3 text-[12pt] text-justify leading-relaxed">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, idx) => (
                <div key={idx} className="indent-8">
                  {p}
                </div>
              ))
            ) : (
              <div className="space-y-3 text-slate-800">
                <p className="indent-8">1. That the Complainant is a consumer within the meaning of Section 2(7) of the Consumer Protection Act, 2019, having paid valuable consideration to the Opposite Parties for goods/services.</p>
                <p className="indent-8">2. That the Opposite Parties committed gross deficiency in service under Section 2(11) and unfair trade practice under Section 2(47) of the Act by failing to honor their contractual obligations.</p>
                <p className="indent-8">3. That the cause of action first arose on dates specified in the List of Dates and Events and the complaint is filed within the limitation period under Section 69.</p>
                <p className="indent-8">4. That this Hon&apos;ble Commission has full territorial and pecuniary jurisdiction to entertain, try, and adjudicate upon the present complaint.</p>
              </div>
            )}
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-12">Page 6 of 9</div>
        </div>
      )}

      {/* ================= PAGE 7 ================= */}
      {(!pageFilter || pageFilter === 7) && (
        <div className="legal-a4-sheet" id="legal-page-7">
          <div className="text-center font-bold underline text-[13pt] uppercase mb-6">
            PRAYER
          </div>

          <div className="text-[12pt] text-justify leading-relaxed">
            It is, therefore, most respectfully prayed that this Hon&apos;ble District Consumer Disputes Redressal Commission may graciously be pleased to:
          </div>

          {/* Render Custom Prayer if provided, otherwise standard generalized court prayer clauses */}
          {data.prayer && data.prayer.trim().length > 0 ? (
            <div className="mt-4 text-[12pt] text-justify leading-relaxed whitespace-pre-line">
              {data.prayer}
            </div>
          ) : (
            <div className="mt-4 space-y-4 text-[12pt] text-justify leading-relaxed">
              <div className="pl-2">
                <span className="font-bold">(i) </span>
                Direct the Opposite Parties, jointly and severally, to pay to the complainant the claimed / refund amount of Rs. {fill(data.prayerClaims?.claimAmount || cd.claimedAmount, 12)}/- (Rupees {fill(data.prayerClaims?.claimAmountWords || cd.claimedAmountWords, 25)} only) {data.prayerClaims?.policyNo ? `payable under Policy / Account / Order No. ${data.prayerClaims.policyNo}` : ''}, together with interest @ {fill(data.prayerClaims?.interestRate || cd.interestRate, 4)}% per annum from the date of {fill(data.prayerClaims?.interestFromDate || cd.interestFromDate || 'filing of this complaint', 12)}, till the date of actual payment.
              </div>

              <div className="pl-2">
                <span className="font-bold">(ii) </span>
                Direct the Opposite Parties, jointly and severally, to pay a sum of Rs. {fill(data.prayerClaims?.compensationAmount || '3,00,000', 12)}/- (Rupees {fill(data.prayerClaims?.compensationAmountWords || 'Three Lakh', 20)} only) to the complainant as compensation for the immense mental agony, physical harassment, financial hardship and emotional trauma suffered due to deficiency in service and unfair trade practice, together with interest @ {fill(data.prayerClaims?.interestRate || cd.interestRate, 4)}% per annum from the date of filing of this complaint, till the date of actual payment.
              </div>

              <div className="pl-2">
                <span className="font-bold">(iii) </span>
                Direct the Opposite Parties to pay Rs. {fill(data.prayerClaims?.litigationCosts || '50,000', 10)}/- (Rupees {fill(data.prayerClaims?.litigationCostsWords || 'Fifty Thousand', 20)} only) towards litigation expenses and incidental costs incurred by the complainant.
              </div>

              <div className="pl-2">
                <span className="font-bold">(iv) </span>
                Pass any other or further order(s), direction(s) or relief(s) as this Hon&apos;ble Commission may deem fit and proper in the facts and circumstances of the case.
              </div>
            </div>
          )}

          <div className="mt-10 font-bold text-center text-[12pt] tracking-wide">
            <div>AND FOR THIS ACT OF KINDNESS, THE COMPLAINANT AS</div>
            <div>IN DUTY BOUND SHALL EVER PRAY.</div>
          </div>

          <div className="mt-8 flex justify-between items-end text-[12pt]">
            <div className="space-y-2">
              <div>Place: {fill(data.verificationPlace || primaryComplainant.district, 20)}</div>
              <div>Date: {fill(data.verificationDate, 15)}</div>
            </div>

            <div className="text-center space-y-1">
              <div>({fill(primaryComplainant.name, 25)})</div>
              <div className="font-semibold">Through Counsel</div>
              <div className="mt-3">{fill(cd.advocateName, 25)}</div>
              <div className="font-bold">Advocate</div>
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-20">Page 7 of 9</div>
        </div>
      )}

      {/* ================= PAGE 8 ================= */}
      {(!pageFilter || pageFilter === 8) && (
        <div className="legal-a4-sheet" id="legal-page-8">
          <div className="text-center font-bold underline text-[13pt] uppercase mb-8">
            VERIFICATION
          </div>

          <div className="text-justify text-[12pt] leading-relaxed">
            I, {fill(primaryComplainant.name, 35)}, {primaryComplainant.relationType || 'wife/son/daughter of'} {fill(primaryComplainant.parentName, 20)}, resident of Village {fill(primaryComplainant.village, 18)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, at present {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, the above-named complainant, do hereby verify that the statements made in paragraphs 1 to {paraCount} of the accompanying complaint are true and correct to my personal knowledge, information and belief and the records of the case, and that nothing material has been concealed or suppressed therefrom.
          </div>

          <div className="mt-8 text-[12pt]">
            Verified at {fill(data.verificationPlace || primaryComplainant.district, 20)} on this {verDate.day} day of {verDate.month || '________________'}, 20{verDate.year ? verDate.year.slice(-2) : '______'}.
          </div>

          <div className="mt-28 flex justify-end text-[12pt]">
            <div className="text-center space-y-1">
              <div className="font-bold">Complainant</div>
              <div className="my-2">({fill(primaryComplainant.name, 25)})</div>
              <div className="font-semibold">Through Counsel</div>
              <div className="mt-4">{fill(cd.advocateName, 25)}</div>
              <div className="font-bold">Advocate</div>
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-36">Page 8 of 9</div>
        </div>
      )}

      {/* ================= PAGE 9 ================= */}
      {(!pageFilter || pageFilter === 9) && (
        <div className="legal-a4-sheet" id="legal-page-9">
          <div className="text-center font-bold text-[12.5pt] leading-snug">
            <div>IN THE COURT OF THE LEARNED PRESIDENT AND MEMBER</div>
            <div>{cd.commissionName || 'DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION'}, {cd.commissionPlace || '________________________'}</div>
          </div>

          <div className="text-center font-bold text-[11.5pt] mt-4">
            Complaint Case No. {cd.complaintNo ? <span className="underline">{cd.complaintNo}</span> : '..........'}/20{cd.complaintYear ? cd.complaintYear.slice(-2) : '______'}
          </div>

          <div className="mt-5 flex justify-between items-baseline text-[12pt]">
            <div className="font-semibold">{fill(primaryComplainant.name, 25)}</div>
            <div className="font-bold">.................... Complainant</div>
          </div>

          <div className="text-center font-bold text-[12pt] my-2">Versus</div>

          <div className="flex justify-between items-baseline text-[12pt]">
            <div className="font-semibold">{fill(primaryOp.name, 25)}{opSuffix(data.oppositeParties)}</div>
            <div className="font-bold">..................... O.Ps</div>
          </div>

          <div className="text-center font-bold underline text-[13pt] uppercase mt-6 mb-4">
            AFFIDAVIT
          </div>

          <div className="text-justify text-[12pt] leading-relaxed">
            I, {fill(primaryComplainant.name, 35)}, {primaryComplainant.relationType || 'wife/son/daughter of'} {fill(primaryComplainant.parentName, 20)}, resident of Village {fill(primaryComplainant.village, 18)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, at present {fill(primaryComplainant.presentAddress || primaryComplainant.village, 20)}, P.O. {fill(primaryComplainant.po, 10)}, P.S. {fill(primaryComplainant.ps, 10)}, District {fill(primaryComplainant.district, 18)}, the above-named complainant, do hereby solemnly affirm and state on oath as follows:
          </div>

          <div className="mt-4 space-y-3 text-[12pt] text-justify leading-relaxed">
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
          </div>

          <div className="mt-6 text-[12pt]">
            Solemnly affirmed before me on this {affDate.day} day of {affDate.month || '________________'}, 20{affDate.year ? affDate.year.slice(-2) : '______'}.
          </div>

          <div className="mt-14 flex justify-between items-end text-[12pt]">
            <div>
              <div className="font-semibold mb-1">Identified by:</div>
              <div className="border-b border-black w-48 mb-1">
                {cd.advocateName ? <span className="font-semibold">{cd.advocateName}</span> : ''}
              </div>
              <div className="font-bold">Advocate</div>
            </div>

            <div className="text-center">
              <div className="border-b border-black w-48 mb-1"></div>
              <div className="font-bold">Deponent</div>
            </div>
          </div>
          <div className="text-right text-[10pt] text-slate-500 mt-14">Page 9 of 9</div>
        </div>
      )}
    </div>
  );
};
