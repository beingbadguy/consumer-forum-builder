'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step6Verification: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const primaryComp = data.complainants[0] || { name: '' };

  const handleFieldChange = (field: keyof ComplaintFormData, value: string) => {
    updateData((prev) => ({
      ...prev,
      [field]: value,
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
            Verification Clause (Matches Page 8 of PDF)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Formal verification by the Complainant verifying facts under oath before the Commission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Place of Verification *
            </label>
            <input
              type="text"
              value={data.verificationPlace}
              onChange={(e) => handleFieldChange('verificationPlace', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
                errors.verificationPlace ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
              }`}
              placeholder="e.g. Patna or New Delhi"
            />
            {errors.verificationPlace && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.verificationPlace}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Date of Verification
            </label>
            <input
              type="date"
              value={data.verificationDate}
              onChange={(e) => handleFieldChange('verificationDate', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
            />
          </div>
        </div>

        {/* Verification Preview Box */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs leading-relaxed text-slate-700">
          <div className="font-bold text-slate-900 uppercase">Court Verification Standard Format:</div>
          <p className="italic font-serif text-[13px] text-slate-800">
            &ldquo;I, <strong>{primaryComp.name || 'Complainant Name'}</strong>, the above-named complainant, do hereby verify that the statements made in the accompanying complaint are true and correct to my personal knowledge, information and belief and the records of the case, and that nothing material has been concealed or suppressed therefrom.&rdquo;
          </p>
          <div className="pt-2 text-[11px] text-slate-500">
            Signatures: Complainant and Advocate will appear right-aligned at the bottom of Page 8.
          </div>
        </div>
      </div>
    </div>
  );
};
