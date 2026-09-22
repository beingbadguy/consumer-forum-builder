'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';
import { convertNumberToIndianWords } from '../../lib/numberToWords';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step5Prayer: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const claims = data.prayerClaims || {};

  const handleClaimFieldChange = (field: string, value: string) => {
    updateData((prev) => {
      const nextClaims = { ...(prev.prayerClaims || {}), [field]: value };

      if (field === 'claimAmount') {
        nextClaims.claimAmountWords = convertNumberToIndianWords(value);
      }
      if (field === 'compensationAmount') {
        nextClaims.compensationAmountWords = convertNumberToIndianWords(value);
      }
      if (field === 'litigationCosts') {
        nextClaims.litigationCostsWords = convertNumberToIndianWords(value);
      }

      return {
        ...prev,
        prayerClaims: nextClaims,
      };
    });
  };

  const handlePrayerChange = (val: string) => {
    updateData((prev) => ({
      ...prev,
      prayer: val,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
              1
            </span>
            Reliefs & Compensation Sought (Prayer Clauses - Page 7)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Specify the primary relief, compensation for mental harassment, and litigation costs.
          </p>
        </div>

        {errors.prayer && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errors.prayer}
          </div>
        )}

        {/* Clause (i): Primary Claim */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            (i) Primary Claim / Refund / Policy Amount
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Claim Amount (₹)</label>
              <input
                type="text"
                value={claims.claimAmount || data.caseDetails.claimedAmount || ''}
                onChange={(e) => handleClaimFieldChange('claimAmount', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                placeholder="25,00,000"
              />
              {claims.claimAmountWords && (
                <p className="text-[11px] text-amber-700 mt-1 italic">
                  (Rupees {claims.claimAmountWords} only)
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Policy / Order / Reference No.</label>
              <input
                type="text"
                value={claims.policyNo || ''}
                onChange={(e) => handleClaimFieldChange('policyNo', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                placeholder="e.g. 23891044"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Interest Rate (% p.a.)</label>
              <input
                type="text"
                value={claims.interestRate || data.caseDetails.interestRate || '12'}
                onChange={(e) => handleClaimFieldChange('interestRate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                placeholder="12"
              />
            </div>
          </div>
        </div>

        {/* Clause (ii): Compensation */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            (ii) Compensation for Mental Agony, Physical Harassment & Hardship
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Compensation Amount (₹)</label>
              <input
                type="text"
                value={claims.compensationAmount || ''}
                onChange={(e) => handleClaimFieldChange('compensationAmount', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                placeholder="e.g. 3,00,000"
              />
              {claims.compensationAmountWords && (
                <p className="text-[11px] text-amber-700 mt-1 italic">
                  (Rupees {claims.compensationAmountWords} only)
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Litigation Expenses (₹) - Clause (iii)</label>
              <input
                type="text"
                value={claims.litigationCosts || ''}
                onChange={(e) => handleClaimFieldChange('litigationCosts', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                placeholder="e.g. 50,000"
              />
              {claims.litigationCostsWords && (
                <p className="text-[11px] text-amber-700 mt-1 italic">
                  (Rupees {claims.litigationCostsWords} only)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Optional Custom Prayer Textarea */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Custom Prayer Narrative (Optional: Overrides/Augments structured clauses)
          </label>
          <textarea
            rows={5}
            value={data.prayer}
            onChange={(e) => handlePrayerChange(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs font-serif leading-relaxed bg-white"
            placeholder="Leave empty to use standard court prayer clauses generated from above amounts, or enter custom prayer text."
          />
        </div>
      </div>
    </div>
  );
};
