'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step7Affidavit: React.FC<StepProps> = ({
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

  const handleResetToStandardAffidavit = () => {
    const standard = `1. That I am the complainant in the accompanying consumer complaint and, being fully acquainted with the facts and circumstances of the case, I am competent to swear this affidavit.
2. That I have read and understood the contents of the accompanying consumer complaint, and the statements made therein are true and correct to my personal knowledge, information and belief.
3. That all the annexures annexed with the accompanying complaint are true Xerox copies of their respective originals and are relied upon in support of the present complaint.
4. That the statements made in the accompanying complaint are true and correct, and nothing material has been concealed or suppressed therefrom.
5. That this affidavit is being sworn for the purpose of supporting the accompanying consumer complaint and the documents annexed thereto before this Hon'ble Commission.`;

    handleFieldChange('affidavit', standard);
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
              Affidavit in Support of Complaint (Matches Page 9 of PDF)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Affidavit sworn by the Deponent on oath before the Oath Commissioner / Notary.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetToStandardAffidavit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors shadow-sm"
          >
            Reset to Standard 5 Clauses
          </button>
        </div>

        {errors.affidavit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errors.affidavit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Deponent Name (Complainant)
            </label>
            <input
              type="text"
              readOnly
              value={primaryComp.name || 'Complainant Name'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Date of Solemn Affirmation
            </label>
            <input
              type="date"
              value={data.affidavitDate}
              onChange={(e) => handleFieldChange('affidavitDate', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Sworn Affirmation Statements (Numbered Paragraphs) *
          </label>
          <textarea
            rows={8}
            value={data.affidavit}
            onChange={(e) => handleFieldChange('affidavit', e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-300 text-xs font-serif leading-relaxed bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            placeholder="1. That I am the complainant...&#10;2. That I have read and understood...&#10;3. That all annexures are true Xerox copies..."
          />
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          Page 9 automatically formats the legal court header, Deponent details, solemn affirmation line, Deponent signature block, and Advocate Identification line.
        </div>
      </div>
    </div>
  );
};
