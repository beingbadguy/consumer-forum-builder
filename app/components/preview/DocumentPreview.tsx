'use client';

import React, { useState } from 'react';
import { ComplaintFormData } from '../../types/complaint';
import { LegalPages } from './LegalPages';
import { exportToPdf, printDocument } from '../../lib/pdfExport';

interface DocumentPreviewProps {
  data: ComplaintFormData;
  onBackToEdit: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  data,
  onBackToEdit,
}) => {
  const [selectedPage, setSelectedPage] = useState<number | null>(null); // null = all 9 pages
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 840) {
      const fitScale = Math.round(((window.innerWidth - 24) / 794) * 100);
      return Math.max(40, fitScale);
    }
    return 100;
  });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isFitToScreen, setIsFitToScreen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 840;
    }
    return false;
  });

  const toggleFitToScreen = () => {
    if (isFitToScreen) {
      setZoomLevel(100);
      setIsFitToScreen(false);
    } else {
      const screenWidth = window.innerWidth;
      const fitScale = Math.round(((screenWidth - 24) / 794) * 100);
      setZoomLevel(Math.min(100, Math.max(40, fitScale)));
      setIsFitToScreen(true);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const filename = `Consumer_Complaint_${data.caseDetails.category || 'Complaint'}_${
        data.complainants[0]?.name ? data.complainants[0].name.replace(/\s+/g, '_') : 'Filing'
      }.pdf`;
      setSelectedPage(null);
      setTimeout(async () => {
        await exportToPdf('legal-document-export', filename);
        setIsExporting(false);
      }, 300);
    } catch (err) {
      console.error(err);
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    setSelectedPage(null);
    setTimeout(() => {
      printDocument();
    }, 200);
  };

  return (
    <div className="preview-viewport min-h-screen py-4 sm:py-6 px-2 sm:px-6">
      {/* Top sticky controls bar */}
      <div className="no-print sticky top-3 sm:top-4 z-40 max-w-5xl mx-auto bg-slate-900/95 backdrop-blur-md text-white p-2.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-700/80 mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-2">
          {/* Back button */}
          <button
            onClick={onBackToEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-xs active:scale-95 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Edit Form</span>
          </button>

          {/* Quick Fit / Zoom Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleFitToScreen}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isFitToScreen
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Toggle mobile fit screen scale"
            >
              {isFitToScreen ? '📱 Fit: ON' : '🔍 100%'}
            </button>

            {/* Desktop Zoom buttons */}
            <div className="hidden md:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700 text-xs text-slate-300">
              <button
                onClick={() => {
                  setZoomLevel((z) => Math.max(40, z - 10));
                  setIsFitToScreen(false);
                }}
                className="px-1.5 hover:text-white font-bold"
                title="Zoom Out"
              >
                -
              </button>
              <span className="w-10 text-center font-mono">{zoomLevel}%</span>
              <button
                onClick={() => {
                  setZoomLevel((z) => Math.min(140, z + 10));
                  setIsFitToScreen(false);
                }}
                className="px-1.5 hover:text-white font-bold"
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Print button */}
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors active:scale-95 flex items-center gap-1.5"
              title="Print / Save as PDF via Browser"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Download PDF button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Page Switcher Horizontal Pills */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1 shrink-0">
            Pages:
          </span>
          <button
            onClick={() => setSelectedPage(null)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
              selectedPage === null
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white bg-slate-800/60'
            }`}
          >
            All 9
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPage(p)}
              className={`w-7 h-7 text-xs font-semibold rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                selectedPage === p
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-700/60 bg-slate-800/40'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Screen container with smooth responsive scaling and scroll */}
      <div className="w-full overflow-x-auto no-scrollbar flex justify-center pb-16">
        <div
          id="legal-document-export"
          className="transition-transform duration-200 origin-top"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            marginBottom: zoomLevel < 100 ? `-${(100 - zoomLevel) * 25}px` : '0',
          }}
        >
          <LegalPages data={data} pageFilter={selectedPage} />
        </div>
      </div>
    </div>
  );
};
