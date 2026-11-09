'use client';

import React, { useEffect, useRef } from 'react';
import { FormStep } from '../types/complaint';
import { AppLanguage } from '../lib/translations';
import { Icons } from './ui/Icons';

interface StepperProps {
  currentStep: FormStep;
  onStepClick: (step: FormStep) => void;
  language?: AppLanguage;
}

interface StepItem {
  id: FormStep;
  hiTitle: string;
  hiSub: string;
  enTitle: string;
  enSub: string;
}

const STEPS: StepItem[] = [
  { id: 1, hiTitle: 'बुनियादी परिवाद विवरण', hiSub: 'आयोग प्रपत्र एवं कोर्ट फीस', enTitle: 'Basic Complaint Details', enSub: 'Proforma & Valuation' },
  { id: 2, hiTitle: 'प्रमुख तिथियां व घटनाक्रम', hiSub: 'कालानुक्रमिक विवरण', enTitle: 'Important Dates & Events', enSub: 'Chronological Sequence' },
  { id: 3, hiTitle: 'आपका विवरण व विपक्षी', hiSub: 'पक्षकारों का ज्ञापन', enTitle: 'Your Details & Opposite Party', enSub: 'Memo of Parties' },
  { id: 4, hiTitle: 'आपकी शिकायत की पूरी बात', hiSub: 'मामले के मुख्य तथ्य', enTitle: 'Your Complaint Story', enSub: 'Facts of the Case' },
  { id: 5, hiTitle: 'आप कोर्ट से क्या चाहते हैं?', hiSub: 'प्रार्थना व दावा', enTitle: 'What Do You Want the Court to Do?', enSub: 'Prayer & Claims' },
  { id: 6, hiTitle: 'सत्यता सत्यापन', hiSub: 'सत्यनिष्ठा घोषणा', enTitle: 'Truth Verification', enSub: 'Truth Declaration' },
  { id: 7, hiTitle: 'शपथ पत्र घोषणा', hiSub: 'नियम 14 के तहत शपथ पत्र', enTitle: 'Declaration', enSub: 'Affidavit under Rule 14' },
  { id: 8, hiTitle: 'सहायक दस्तावेज', hiSub: 'संलग्नक व साक्ष्य', enTitle: 'Supporting Documents', enSub: 'Annexures & Exhibits' },
];

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onStepClick,
  language = 'hi',
}) => {
  const isEn = language === 'en';
  const progressPercent = Math.round((currentStep / 8) * 100);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const activeStep = STEPS[currentStep - 1];

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentStep]);

  return (
    <nav aria-label={isEn ? 'Step Progress' : 'प्रगति विवरण'} className="no-print bg-white border-b border-[#E5E5E5] sticky top-15 z-30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2.5">
        {/* Step Header summary */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
              {currentStep}
            </span>
            <div className="text-xs sm:text-sm font-medium text-[#111111] truncate">
              {isEn ? `Step ${currentStep}: ` : `चरण ${currentStep}: `}
              <span className="font-semibold text-[#111111]">{isEn ? activeStep.enTitle : activeStep.hiTitle}</span>
              <span className="text-[#666666] font-normal hidden sm:inline"> — {isEn ? activeStep.enSub : activeStep.hiSub}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 text-xs text-[#666666]">
            <span className="hidden sm:inline">
              {isEn ? `Step ${currentStep} of 8` : `चरण ${currentStep} / 8`}
            </span>
            <span className="font-medium text-[#111111] bg-[#F5F5F5] border border-[#E5E5E5] px-2 py-0.5 rounded-md text-[11px]">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Minimalist 2px Progress Bar */}
        <div className="w-full bg-[#EFEFEF] h-1 rounded-full overflow-hidden mb-2">
          <div
            className="bg-[#111111] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Horizontally Scrollable Step Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const stepTitle = isEn ? step.enTitle : step.hiTitle;

            return (
              <button
                key={step.id}
                ref={isActive ? activeTabRef : null}
                type="button"
                onClick={() => onStepClick(step.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 border cursor-pointer ${
                  isActive
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : isCompleted
                    ? 'border-[#E5E5E5] bg-[#FAFAFA] text-[#333333] hover:bg-[#F0F0F0]'
                    : 'border-transparent text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] font-medium flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-white text-[#111111]'
                      : isCompleted
                      ? 'bg-[#E5E5E5] text-[#111111]'
                      : 'bg-[#F0F0F0] text-[#888888]'
                  }`}
                >
                  {isCompleted ? <Icons.Check size={10} /> : step.id}
                </span>
                <span>{stepTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
