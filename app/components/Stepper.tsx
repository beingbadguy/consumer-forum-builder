'use client';

import React, { useEffect, useRef } from 'react';
import { FormStep } from '../types/complaint';

interface StepperProps {
  currentStep: FormStep;
  onStepClick: (step: FormStep) => void;
}

const STEPS: { id: FormStep; title: string; subtitle: string; icon: string }[] = [
  { id: 1, title: 'Proforma', subtitle: 'Commission & Fees', icon: '🏛️' },
  { id: 2, title: 'Events', subtitle: 'Dates & Timeline', icon: '📅' },
  { id: 3, title: 'Parties', subtitle: 'Complainant & O.Ps', icon: '👥' },
  { id: 4, title: 'Complaint', subtitle: 'Showeth Grounds', icon: '📜' },
  { id: 5, title: 'Prayer', subtitle: 'Reliefs Claimed', icon: '⚖️' },
  { id: 6, title: 'Verification', subtitle: 'Declaration', icon: '✍️' },
  { id: 7, title: 'Affidavit', subtitle: 'Sworn on Oath', icon: '🛡️' },
  { id: 8, title: 'Annexures', subtitle: 'Documents', icon: '📎' },
];

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const progressPercent = Math.round((currentStep / 8) * 100);
  const activePillRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll the active pill into view on mobile
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentStep]);

  return (
    <div className="no-print bg-white border-b border-slate-200/80 sticky top-15 sm:top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5">
        {/* Mobile & Desktop Header: Step Counter & Progress */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 text-amber-400 text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0">
              {currentStep}
            </span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              {STEPS[currentStep - 1].title}:{' '}
              <span className="font-medium text-slate-500 hidden sm:inline">
                {STEPS[currentStep - 1].subtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Step {currentStep} of 8
            </span>
            <span className="text-[11px] sm:text-xs font-bold font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80 shrink-0">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2.5 sm:mb-3">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Horizontal scrollable step strip on all screen sizes */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1">
          {STEPS.map((s) => {
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;

            return (
              <button
                key={s.id}
                ref={isActive ? activePillRef : null}
                type="button"
                onClick={() => onStepClick(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 border active:scale-95 ${
                  isActive
                    ? 'border-amber-500 bg-amber-50 text-slate-950 shadow-xs ring-1 ring-amber-500/30'
                    : isCompleted
                    ? 'border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    : 'border-transparent text-slate-400 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-amber-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : s.id}
                </span>

                <span className="text-xs">{s.title}</span>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse ml-0.5"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
