'use client';

import React, { useState } from 'react';
import { ComplaintFormData } from '../../types/complaint';
import { LegalPages } from './LegalPages';
import { exportToPdf, printDocument } from '../../lib/pdfExport';
import { exportToDocx } from '../../lib/docxExport';
import { TRANSLATIONS } from '../../lib/translations';
import { Icons } from '../ui/Icons';

interface DocumentPreviewProps {
  data: ComplaintFormData;
  onBackToEdit: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  data,
  onBackToEdit,
}) => {
  const isEn = data.language === 'en';
  const t = TRANSLATIONS[data.language || 'hi'].preview;

  const [selectedPage, setSelectedPage] = useState<number | string | null>(null); // null = all pages
  const [numberingMode, setNumberingMode] = useState<'proforma1' | 'consecutive'>('proforma1');
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 840) {
      const fitScale = Math.round(((window.innerWidth - 24) / 794) * 100);
      return Math.max(40, fitScale);
    }
    return 100;
  });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
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

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    try {
      const filename = `Consumer_Complaint_${data.caseDetails.category || 'Complaint'}_${
        data.complainants[0]?.name ? data.complainants[0].name.replace(/\s+/g, '_') : 'Filing'
      }.docx`;
      await exportToDocx(data, filename);
      setIsExportingDocx(false);
    } catch (err) {
      console.error(err);
      alert(isEn ? 'Failed to generate Word document.' : 'वर्ड दस्तावेज बनाने में त्रुटि हुई।');
      setIsExportingDocx(false);
    }
  };

  const handlePrint = () => {
    setSelectedPage(null);
    setTimeout(() => {
      printDocument();
    }, 200);
  };

  return (
    <div className="preview-viewport min-h-screen py-4 sm:py-6 px-2 sm:px-6 bg-[#F4F4F5]">
      {/* Top sticky controls bar */}
      <div className="no-print sticky top-3 sm:top-4 z-40 max-w-[1080px] mx-auto bg-white text-[#111111] p-3 sm:p-3.5 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E5E5E5] mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Back button */}
          <button
            type="button"
            onClick={onBackToEdit}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs sm:text-sm font-medium bg-white hover:bg-[#F5F5F5] text-[#111111] border border-[#E5E5E5] transition-all shadow-none shrink-0 active:scale-[0.98]"
          >
            <Icons.ArrowLeft size={16} className="shrink-0 text-[#111111]" />
            <span>{t.backToEdit}</span>
          </button>

          {/* Quick Fit / Zoom Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFitToScreen}
              className={`h-9 px-3 rounded-lg text-xs font-medium transition-all border ${
                isFitToScreen
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#444444] border-[#E5E5E5] hover:bg-[#F5F5F5]'
              }`}
              title={isEn ? 'Toggle mobile fit zoom' : 'मोबाइल स्क्रीन अनुसार ज़ूम टॉगल करें'}
            >
              {isFitToScreen ? (isEn ? 'Fit Screen: ON' : 'स्क्रीन अनुसार: चालू') : (isEn ? '100% Zoom' : '100% ज़ूम')}
            </button>

            {/* Desktop Zoom buttons */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#FAFAFA] h-9 px-2.5 rounded-lg border border-[#E5E5E5] text-xs text-[#444444]">
              <button
                type="button"
                onClick={() => {
                  setZoomLevel((z) => Math.max(40, z - 10));
                  setIsFitToScreen(false);
                }}
                className="w-5 text-center hover:text-[#111111] font-semibold text-sm"
                title={isEn ? 'Zoom Out' : 'ज़ूम कम करें'}
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-medium text-[#111111]">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => {
                  setZoomLevel((z) => Math.min(140, z + 10));
                  setIsFitToScreen(false);
                }}
                className="w-5 text-center hover:text-[#111111] font-semibold text-sm"
                title={isEn ? 'Zoom In' : 'ज़ूम बढ़ाएं'}
              >
                +
              </button>
            </div>

            {/* Pagination mode toggle */}
            <button
              type="button"
              onClick={() => setNumberingMode((m) => (m === 'proforma1' ? 'consecutive' : 'proforma1'))}
              className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium bg-white hover:bg-[#F5F5F5] text-[#555555] border border-[#E5E5E5] transition-colors"
              title={isEn ? 'Toggle between Proforma (P1-P9) and Consecutive (P1-P10) page numbering' : 'प्रोफ़ॉर्मा (P1-P9) अथवा लगातार (P1-P10) पृष्ठ संख्या प्रारूप'}
            >
              <span className="text-[#888888]">{isEn ? 'Format:' : 'प्रारूप:'}</span>
              <span className="text-[#111111] font-semibold">
                {numberingMode === 'proforma1' ? t.numModeProforma : t.numModeConsecutive}
              </span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="h-9 px-3.5 rounded-lg text-xs sm:text-sm font-medium bg-white hover:bg-[#F5F5F5] text-[#111111] border border-[#E5E5E5] transition-all flex items-center gap-1.5 shadow-none"
              title={isEn ? 'Print via browser or save as PDF' : 'ब्राउज़र द्वारा प्रिंट करें या पीडीएफ के रूप में सहेजें'}
            >
              <Icons.Printer size={16} className="shrink-0 text-[#111111]" />
              <span>{t.print}</span>
            </button>

            {/* Download Word (.docx) button */}
            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="flex items-center gap-1.5 h-9 px-3.5 sm:px-4 rounded-lg text-xs sm:text-sm font-medium bg-white hover:bg-[#F5F5F5] text-[#111111] border border-[#E5E5E5] transition-all shadow-none disabled:opacity-50 active:scale-[0.98] cursor-pointer"
              title={isEn ? 'Download editable MS Word (.docx) document' : 'संपादन योग्य एमएस वर्ड (.docx) दस्तावेज डाउनलोड करें'}
            >
              {isExportingDocx ? (
                <>
                  <Icons.Spinner size={16} className="text-[#111111]" />
                  <span>{t.generatingDocx}</span>
                </>
              ) : (
                <>
                  <Icons.FileText size={16} className="shrink-0 text-[#2563EB]" />
                  <span>{t.downloadDocx}</span>
                </>
              )}
            </button>

            {/* Download PDF button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 h-9 px-4 sm:px-5 rounded-lg text-xs sm:text-sm font-medium bg-[#111111] hover:bg-[#262626] text-white transition-all shadow-none disabled:opacity-50 active:scale-[0.98]"
            >
              {isExporting ? (
                <>
                  <Icons.Spinner size={16} className="text-white" />
                  <span>{isEn ? 'Generating PDF...' : 'पीडीएफ बन रहा है...'}</span>
                </>
              ) : (
                <>
                  <Icons.Download size={16} className="shrink-0 text-white" />
                  <span>{t.downloadPdf}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Page Switcher Horizontal Strip */}
        <div className="mt-3 pt-3 border-t border-[#F0F0F0] flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] text-[#888888] font-semibold uppercase tracking-wider mr-1 shrink-0">
            {isEn ? 'Select Page:' : 'पृष्ठ चुनें:'}
          </span>
          <button
            type="button"
            onClick={() => setSelectedPage(null)}
            className={`px-3 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === null
                ? 'bg-[#111111] text-white shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {isEn ? 'All (Complete Filing)' : 'सभी (सम्पूर्ण परिवाद)'}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage('index')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === 'index'
                ? 'bg-[#111111] text-white shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {t.indexPill}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage(1)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === 1
                ? 'bg-[#111111] text-white shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {isEn ? 'P1: Proforma' : 'प्र. 1: प्रपत्र'}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage(2)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === 2
                ? 'bg-[#111111] text-white shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {isEn ? 'P2: Proforma' : 'प्र. 2: प्रपत्र'}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage(3)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === 3
                ? 'bg-[#111111] text-white shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {isEn ? 'P3: Events' : 'प्र. 3: घटनाक्रम'}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage(4)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === 4
                ? 'bg-[#111111] text-white shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {isEn ? 'P4: Parties' : 'प्र. 4: पक्षकार'}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage('petition')}
            className={`px-3 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === 'petition'
                ? 'bg-[#111111] text-white font-medium shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {isEn ? 'P5-6: Petition' : 'प्र. 5-6: परिवाद पत्र'}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage(5)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === 5
                ? 'bg-[#111111] text-white shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {isEn ? 'P5: Petition 1' : 'प्र. 5: याचिका 1'}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage(6)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === 6
                ? 'bg-[#111111] text-white shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {isEn ? 'P6: Petition 2' : 'प्र. 6: याचिका 2'}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPage('affidavit')}
            className={`px-3 py-1 text-xs font-medium rounded-md shrink-0 transition-all ${
              selectedPage === 'affidavit' || selectedPage === 7 || selectedPage === 9
                ? 'bg-[#111111] text-white font-medium shadow-none'
                : 'text-[#555555] hover:text-[#111111] bg-white hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {isEn ? 'Affidavit' : 'शपथ पत्र'}
          </button>
        </div>
      </div>

      {/* Sheet rendering viewport with zoom applied */}
      <div className="flex justify-center pb-16 overflow-x-auto no-scrollbar">
        <div
          id="legal-document-export"
          className="transition-transform duration-150 origin-top flex flex-col items-center gap-8"
          style={{
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          <LegalPages
            data={data}
            pageFilter={selectedPage}
            numberingMode={numberingMode}
          />
        </div>
      </div>
    </div>
  );
};
