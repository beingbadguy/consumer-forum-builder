'use client';

import React from 'react';
import { FormStep } from '../types/complaint';

interface FormControlsProps {
  currentStep: FormStep;
  onPrev: () => void;
  onNext: () => void;
  onPreview: () => void;
}

export const FormControls: React.FC<FormControlsProps> = ({
  currentStep,
  onPrev,
  onNext,
  onPreview,
}) => {
  return (
    <div className="no-print fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-3 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Back button */}
        <div className="w-24 sm:w-36">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all w-full justify-center border border-slate-200/60"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Center: Step indicators / Quick Preview */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPreview}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Preview current legal draft"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Preview PDF</span>
          </button>
        </div>

        {/* Right: Continue / Finish Button */}
        <div className="w-auto sm:w-auto">
          <button
            type="button"
            onClick={onNext}
            className="flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-amber-400 active:scale-95 transition-all shadow-md shadow-slate-900/20 whitespace-nowrap"
          >
            <span>{currentStep === 8 ? 'Finish & View PDF' : 'Save & Continue'}</span>
            <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
