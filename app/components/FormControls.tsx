'use client';

import React from 'react';
import { FormStep } from '../types/complaint';
import { AppLanguage, TRANSLATIONS } from '../lib/translations';
import { Icons } from './ui/Icons';

interface FormControlsProps {
  currentStep: FormStep;
  onPrev: () => void;
  onNext: () => void;
  onPreview: () => void;
  onDownloadDocx?: () => void;
  isExportingDocx?: boolean;
  language?: AppLanguage;
}

export const FormControls: React.FC<FormControlsProps> = ({
  currentStep,
  onPrev,
  onNext,
  onPreview,
  onDownloadDocx,
  isExportingDocx = false,
  language = 'hi',
}) => {
  const isEn = language === 'en';
  const t = TRANSLATIONS[language].controls;

  return (
    <footer className="no-print fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-[#E5E5E5] py-2.5 sm:py-3 px-4 sm:px-6 pb-[calc(env(safe-area-inset-bottom,0px)+0.625rem)]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Previous Step Button */}
        <div className="min-w-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 sm:px-4 rounded-lg text-xs sm:text-sm font-medium text-[#333333] bg-white hover:bg-[#F7F7F7] border border-[#E5E5E5] transition-colors whitespace-nowrap cursor-pointer active:scale-[0.99]"
            >
              <Icons.ArrowLeft size={15} className="text-[#666666]" />
              <span>{t.prev}</span>
            </button>
          ) : (
            <div className="w-16 sm:w-24" />
          )}
        </div>

        {/* Center: Quick Preview & Word Export */}
        <div className="flex items-center gap-2">
          {onDownloadDocx && (
            <button
              type="button"
              onClick={onDownloadDocx}
              disabled={isExportingDocx}
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 sm:px-3.5 rounded-lg text-xs sm:text-sm font-medium text-[#111111] bg-white hover:bg-[#F7F7F7] border border-[#E5E5E5] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              title={isEn ? 'Download editable MS Word (.docx) document' : 'वर्ड (.docx) प्रारूप में डाउनलोड करें'}
            >
              {isExportingDocx ? (
                <Icons.Spinner size={15} className="text-[#111111]" />
              ) : (
                <Icons.FileText size={15} className="text-[#2563EB]" />
              )}
              <span>{isEn ? 'Word (.docx)' : 'वर्ड (.docx)'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-1.5 h-10 px-3 sm:px-3.5 rounded-lg text-xs sm:text-sm font-medium text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-colors whitespace-nowrap cursor-pointer"
            title={isEn ? 'Preview document' : 'दस्तावेज पूर्वावलोकन'}
          >
            <Icons.Eye size={15} />
            <span className="hidden sm:inline">{t.draftPreview}</span>
            <span className="sm:hidden">{isEn ? 'Preview' : 'पूर्वावलोकन'}</span>
          </button>
        </div>

        {/* Right: Save & Continue / Finish Button */}
        <div>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 sm:px-6 rounded-lg text-xs sm:text-sm font-medium bg-[#111111] hover:bg-[#262626] text-white border border-[#111111] transition-colors whitespace-nowrap cursor-pointer active:scale-[0.99]"
          >
            <span>{currentStep === 8 ? t.finishAndPreview : t.saveAndNext}</span>
            {currentStep < 8 && <Icons.ArrowRight size={15} />}
          </button>
        </div>
      </div>
    </footer>
  );
};
