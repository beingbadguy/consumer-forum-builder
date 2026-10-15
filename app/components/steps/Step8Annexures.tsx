'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step8Annexures: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const handleAnnexureChange = (index: number, title: string) => {
    updateData((prev) => {
      const nextAnnexures = [...prev.annexures];
      nextAnnexures[index] = {
        ...nextAnnexures[index],
        annexureNo: `Annexure-${index + 1}`,
        title,
      };
      return { ...prev, annexures: nextAnnexures };
    });
  };

  const handleAddAnnexure = () => {
    updateData((prev) => ({
      ...prev,
      annexures: [
        ...prev.annexures,
        {
          annexureNo: `Annexure-${prev.annexures.length + 1}`,
          title: '',
        },
      ],
    }));
  };

  const handleRemoveAnnexure = (index: number) => {
    if (data.annexures.length <= 1) return;
    updateData((prev) => {
      const filtered = prev.annexures.filter((_, i) => i !== index);
      // Re-index Annexure numbers
      const reindexed = filtered.map((ann, i) => ({
        ...ann,
        annexureNo: `Annexure-${i + 1}`,
      }));
      return { ...prev, annexures: reindexed };
    });
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
              List of Annexures & Documents (Matches Pages 5 & 6)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Annexure-1 to Annexure-4 display on Page 5; Annexure-5 onwards display on Page 6.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddAnnexure}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add More Annexures
          </button>
        </div>

        {errors.annexures && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errors.annexures}
          </div>
        )}

        <div className="space-y-3">
          {data.annexures.map((ann, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 sm:gap-3"
            >
              <div className="w-22 sm:w-28 shrink-0 font-bold text-xs text-slate-800 font-mono">
                {ann.annexureNo || `Annexure-${idx + 1}`}:
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={ann.title}
                  onChange={(e) => handleAnnexureChange(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  placeholder="e.g. Copy of Retail Invoice / Copy of Policy Schedule / Postal Receipt"
                />
              </div>

              {data.annexures.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAnnexure(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                  title="Remove Annexure"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Witnesses note */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-4">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Witnesses in Favour of the Complainant (Page 6)
          </div>
          <div className="text-xs text-slate-600 pl-4 space-y-1">
            <div>• The Complainant herself/himself.</div>
            <div>• Other independent witness(es), if any.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
