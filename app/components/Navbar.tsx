'use client';

import React, { useState } from 'react';
import { AppLanguage, TRANSLATIONS } from '../lib/translations';
import { Icons } from './ui/Icons';

interface NavbarProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onToggleDemo: () => void;
  isDemoFilled: boolean;
  onReset: () => void;
  onTogglePreview: () => void;
  onDownloadDocx?: () => void;
  isExportingDocx?: boolean;
  isPreviewMode: boolean;
  saveStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onToggleDemo,
  isDemoFilled,
  onReset,
  onTogglePreview,
  onDownloadDocx,
  isExportingDocx = false,
  isPreviewMode,
  saveStatus,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  return (
    <header className="no-print bg-white border-b border-[#E5E5E5] text-[#111111] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Brand Identity: Consumer Mitra (Left) */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center shrink-0">
            <Icons.Scales size={18} className="text-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] sm:text-base text-[#111111] tracking-tight truncate">
                {t.brand.title}
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-medium tracking-wide rounded bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5] shrink-0">
                {isEn ? 'Admin Console' : 'प्रशासन कंसोल'}
              </span>
            </div>
            <p className="text-[11px] text-[#666666] font-normal truncate hidden sm:block">
              {t.brand.subtitle}
            </p>
          </div>
        </div>

        {/* Center Autosave Status & Case Tag */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#666666] bg-[#FAFAFA] px-2.5 py-1 rounded-md border border-[#E5E5E5]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-[#444444]">
              {saveStatus ? t.nav.saved : t.nav.autosaved}
            </span>
          </div>

          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
            SEC 35 CPA 2019
          </span>
        </div>

        {/* Action Controls & Language Switcher (Right) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Segmented Language Switcher */}
          <div className="flex items-center bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'hi'
                  ? 'bg-white text-[#111111] font-semibold shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
              title="हिन्दी में स्विच करें"
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-[#111111] font-semibold shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
              title="Switch to English"
            >
              English
            </button>
          </div>

          {/* Fill / Unfill Demo Data Button */}
          <button
            type="button"
            onClick={onToggleDemo}
            className={`hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
              isDemoFilled
                ? 'bg-[#111111] text-white border-[#111111] hover:bg-[#262626]'
                : 'text-[#333333] bg-white hover:bg-[#F7F7F7] border-[#E5E5E5]'
            }`}
            title={isDemoFilled ? t.nav.sampleDataRemove : t.nav.sampleDataFill}
          >
            {isDemoFilled ? (
              <>
                <Icons.X size={14} />
                <span>{t.nav.sampleDataRemove}</span>
              </>
            ) : (
              <>
                <Icons.Sparkles size={14} className="text-[#666666]" />
                <span>{t.nav.sampleDataFill}</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-medium text-[#666666] hover:text-rose-600 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
            title={t.nav.resetForm}
          >
            <Icons.RotateCcw size={14} />
            <span>{t.nav.resetForm}</span>
          </button>

          {/* Download Word (.docx) Button in Header */}
          {onDownloadDocx && !isPreviewMode && (
            <button
              type="button"
              onClick={onDownloadDocx}
              disabled={isExportingDocx}
              className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs sm:text-[13px] font-medium bg-white text-[#111111] hover:bg-[#F5F5F5] border border-[#E5E5E5] transition-colors cursor-pointer disabled:opacity-50"
              title={isEn ? 'Download editable MS Word (.docx) document' : 'वर्ड (.docx) प्रारूप में डाउनलोड करें'}
            >
              {isExportingDocx ? (
                <>
                  <Icons.Spinner size={14} className="text-[#111111]" />
                  <span>{t.preview.generatingDocx}</span>
                </>
              ) : (
                <>
                  <Icons.FileText size={14} className="text-[#2563EB]" />
                  <span>{t.nav.wordBtn}</span>
                </>
              )}
            </button>
          )}

          {/* Primary Action Button: Preview PDF / Edit Form */}
          <button
            type="button"
            onClick={onTogglePreview}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs sm:text-[13px] font-medium bg-[#111111] text-white hover:bg-[#262626] border border-[#111111] transition-colors cursor-pointer active:scale-[0.99]"
          >
            {isPreviewMode ? (
              <>
                <Icons.Edit size={14} />
                <span>{t.nav.editBtn}</span>
              </>
            ) : (
              <>
                <Icons.Eye size={14} />
                <span>{t.nav.previewBtn}</span>
              </>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden p-2 text-[#444444] hover:text-[#111111] rounded-lg hover:bg-[#F7F7F7] transition-colors"
            aria-label="Toggle Menu"
          >
            {showMobileMenu ? <Icons.X size={18} /> : <Icons.Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="sm:hidden bg-white border-t border-[#E5E5E5] px-4 py-3 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between py-1 border-b border-[#F0F0F0]">
            <span className="text-xs text-[#666666]">Language / भाषा</span>
            <div className="flex items-center bg-[#F5F5F5] border border-[#E5E5E5] rounded-md p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  onLanguageChange('hi');
                  setShowMobileMenu(false);
                }}
                className={`px-2 py-0.5 rounded ${
                  language === 'hi' ? 'bg-white text-[#111111] font-semibold shadow-xs' : 'text-[#666666]'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => {
                  onLanguageChange('en');
                  setShowMobileMenu(false);
                }}
                className={`px-2 py-0.5 rounded ${
                  language === 'en' ? 'bg-white text-[#111111] font-semibold shadow-xs' : 'text-[#666666]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onToggleDemo();
              setShowMobileMenu(false);
            }}
            className="w-full text-left py-2.5 px-3 text-xs font-medium text-[#222222] hover:bg-[#F7F7F7] rounded-lg flex items-center gap-2 border border-[#E5E5E5]"
          >
            {isDemoFilled ? <Icons.X size={14} /> : <Icons.Sparkles size={14} />}
            <span>{isDemoFilled ? t.nav.sampleDataRemove : t.nav.sampleDataFill}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onReset();
              setShowMobileMenu(false);
            }}
            className="w-full text-left py-2.5 px-3 text-xs font-medium text-rose-600 hover:bg-rose-50/60 rounded-lg flex items-center gap-2 border border-rose-200"
          >
            <Icons.RotateCcw size={14} />
            <span>{t.nav.resetForm}</span>
          </button>

          <div className="pt-1 text-[11px] text-[#888888] flex items-center justify-between">
            <span>{saveStatus ? t.nav.saved : t.nav.autosaved}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      )}
    </header>
  );
};
