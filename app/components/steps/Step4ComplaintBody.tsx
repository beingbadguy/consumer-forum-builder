'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step4ComplaintBody: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const handleBodyChange = (value: string) => {
    updateData((prev) => ({
      ...prev,
      complaintBody: value,
    }));
  };

  const handleGenerateTemplate = () => {
    const comp = data.complainants[0] || { name: 'Complainant' };
    const op = data.oppositeParties[0] || { name: 'Opposite Party' };
    const cd = data.caseDetails;

    const draft = `1. That the Complainant is a consumer within the meaning of Section 2(7) of the Consumer Protection Act, 2019, having paid consideration to the Opposite Parties for goods/services.

2. That the Opposite Party No. 1 is carrying on business as an authorized entity, and Opposite Party No. 2 is the registered corporate headquarters having overall operational and administrative control.

3. That the Complainant paid total consideration amounting to Rs. ${cd.totalConsideration || '1,20,000'}/- (Rupees ${cd.totalConsiderationWords || 'One Lakh Twenty Thousand'} only) to the Opposite Parties.

4. That the Opposite Parties committed gross deficiency in service and unfair trade practice under Section 2(11) and Section 2(47) of the Act by failing to honor their contractual obligations, causing severe financial loss and mental harassment.

5. That the cause of action first arose on ${cd.dateOfCauseOfAction || '14/09/2023'} and continues to subsist. The complaint is filed well within the 2-year limitation period prescribed under Section 69 of the Consumer Protection Act, 2019.

6. That this Hon'ble Commission has full territorial and pecuniary jurisdiction to entertain, try, and adjudicate upon the present complaint.`;

    handleBodyChange(draft);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                1
              </span>
              Consumer Complaint Main Body (Most Respectfully Showeth)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Renders the formal numbered legal allegations on Page 6 of the court proforma.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors shadow-sm"
          >
            ⚡ Auto-Draft Standard Legal Text
          </button>
        </div>

        {errors.complaintBody && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errors.complaintBody}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Numbered Paragraphs (Separate each paragraph with an empty line) *
          </label>
          <textarea
            rows={14}
            value={data.complaintBody}
            onChange={(e) => handleBodyChange(e.target.value)}
            className={`w-full p-4 rounded-xl border text-sm font-serif leading-relaxed focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors bg-white ${
              errors.complaintBody ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
            }`}
            placeholder="1. That the Complainant is a consumer...&#10;&#10;2. That the Opposite Parties committed gross deficiency in service...&#10;&#10;3. That the cause of action arose on..."
          />
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          <div className="font-semibold text-slate-800 mb-1">Court Drafting Rules:</div>
          <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
            <li>State Consumer Locus Standi under Section 2(7) of CPA 2019.</li>
            <li>Detail transaction, invoice, policy or agreement numbers and dates.</li>
            <li>Specify Deficiency in Service under Sec 2(11) and Unfair Trade Practice under Sec 2(47).</li>
            <li>Conclude with Cause of Action, Pecuniary Jurisdiction, and Limitation statement.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
