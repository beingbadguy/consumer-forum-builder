'use client';

import React, { useState } from 'react';

interface NavbarProps {
  onLoadSample: () => void;
  onReset: () => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
  saveStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadSample,
  onReset,
  onTogglePreview,
  isPreviewMode,
  saveStatus,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="no-print bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-base sm:text-lg shrink-0">
            ⚖️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white tracking-tight truncate">
                Consumer Complaint
              </h1>
              <span className="inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                CPA &apos;19
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              {isPreviewMode ? 'Court Document Preview' : '9-Page Proforma Generator'}
            </p>
          </div>
        </div>

        {/* Center Autosave status (Tablet & Desktop) */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">{saveStatus || 'Saved to localStorage'}</span>
        </div>

        {/* Action buttons (Right) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Desktop quick actions */}
          <button
            type="button"
            onClick={onLoadSample}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all active:scale-95 shadow-xs"
            title="Load 9-page Insurance Death Claim sample from court proforma"
          >
            <span className="text-amber-400">⚡</span>
            <span>Sample Data</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-all active:scale-95"
            title="Clear all form fields"
          >
            Reset
          </button>

          {/* Primary CTA: Preview Button */}
          <button
            type="button"
            onClick={onTogglePreview}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 ${
              isPreviewMode
                ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 ring-1 ring-amber-400/50'
            }`}
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isPreviewMode ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              )}
            </svg>
            <span className="whitespace-nowrap">
              {isPreviewMode ? 'Edit Form' : 'Preview PDF'}
            </span>
          </button>

          {/* Mobile More Options Button */}
          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/80 active:scale-95"
              aria-label="More options"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Mobile Dropdown Popover */}
            {showMobileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMobileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-700/60 mb-1">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                      Auto-Save
                    </span>
                    <span className="text-slate-300 font-medium">
                      {saveStatus || 'Saved'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onLoadSample();
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-200 hover:bg-slate-700/70 flex items-center gap-2"
                  >
                    <span className="text-amber-400 text-sm">⚡</span>
                    <span className="font-semibold">Load Sample Data</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onReset();
                    }}
                    className="w-full px-3.5 py-2 text-left text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Clear / Reset Form</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
