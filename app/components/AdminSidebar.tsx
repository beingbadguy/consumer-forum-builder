'use client';

import React from 'react';
import { ComplaintFormData, FormStep } from '../types/complaint';
import { AppLanguage, TRANSLATIONS } from '../lib/translations';
import { Icons } from './ui/Icons';

interface AdminSidebarProps {
  currentStep: FormStep;
  onStepClick: (step: FormStep) => void;
  formData: ComplaintFormData;
  language: AppLanguage;
  onDownloadDocx: () => void;
  onPreview: () => void;
  isExportingDocx?: boolean;
}

interface StepMeta {
  id: FormStep;
  enTitle: string;
  enSub: string;
  hiTitle: string;
  hiSub: string;
  iconName: string;
}

const STEPS_META: StepMeta[] = [
  { id: 1, enTitle: 'Proforma & Valuation', enSub: 'Commission & Claim', hiTitle: 'प्रारूप व मूल्यांकन', hiSub: 'आयोग व दावा', iconName: 'FileText' },
  { id: 2, enTitle: 'Dates & Events', enSub: 'Chronological Milestones', hiTitle: 'घटनाक्रम विवरण', hiSub: 'तिथियां व कालक्रम', iconName: 'Calendar' },
  { id: 3, enTitle: 'Memo of Parties', enSub: 'Complainant & OP', hiTitle: 'पक्षकारों का ज्ञापन', hiSub: 'परिवादी व विपक्षी', iconName: 'Scales' },
  { id: 4, enTitle: 'Complaint Petition', enSub: 'Facts & Legal Grounds', hiTitle: 'परिवाद पत्र', hiSub: 'तथ्य व कानूनी धाराएं', iconName: 'FileText' },
  { id: 5, enTitle: 'Prayer & Reliefs', enSub: 'Refund & Compensation', hiTitle: 'प्रार्थना व अनुतोष', hiSub: 'वापसी व मुआवजा', iconName: 'CheckCircle' },
  { id: 6, enTitle: 'Verification', enSub: 'Solemn Affirmation', hiTitle: 'सत्यनिष्ठा सत्यापन', hiSub: 'सत्यापन घोषणा', iconName: 'Check' },
  { id: 7, enTitle: 'Affidavit (Rule 14)', enSub: 'Sworn Deposition', hiTitle: 'शपथ पत्र (नियम 14)', hiSub: 'सशपथ बयान', iconName: 'FileText' },
  { id: 8, enTitle: 'Annexures & Evidence', enSub: 'Document Proofs', hiTitle: 'संलग्नक सूची', hiSub: 'साक्ष्य दस्तावेज', iconName: 'Plus' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentStep,
  onStepClick,
  formData,
  language,
  onDownloadDocx,
  onPreview,
  isExportingDocx = false,
}) => {
  const isEn = language === 'en';
  const cd = formData.caseDetails;
  const progressPercent = Math.round((currentStep / 8) * 100);

  // Check completion heuristics
  const isStepDone = (stepId: FormStep) => {
    if (stepId < currentStep) return true;
    if (stepId === 1) return Boolean(cd.commissionState && cd.category);
    if (stepId === 2) return formData.events.length > 0;
    if (stepId === 3) return Boolean(formData.complainants[0]?.name && formData.oppositeParties[0]?.name);
    if (stepId === 4) return Boolean(formData.complaintBody && formData.complaintBody.trim().length > 20);
    if (stepId === 5) return Boolean(formData.prayerClaims?.claimAmount || cd.claimedAmount);
    if (stepId === 6) return Boolean(formData.verificationPlace);
    if (stepId === 7) return Boolean(formData.affidavitDate);
    if (stepId === 8) return formData.annexures.length > 0;
    return false;
  };

  const primaryComplainantName = formData.complainants[0]?.name || (isEn ? 'Not specified' : 'अनिर्दिष्ट');
  const primaryOpName = formData.oppositeParties[0]?.name || (isEn ? 'Not specified' : 'अनिर्दिष्ट');
  const claimedAmount = cd.claimedAmount || cd.totalConsideration || '0';

  return (
    <div className="space-y-4">
      {/* 1. Admin Workflow Modules Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F0F0F0]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
              {isEn ? 'Filing Pipeline' : 'ड्राफ्टिंग अनुभाग'}
            </span>
            <h3 className="text-sm font-semibold text-[#111827]">
              {isEn ? '8 Statutory Modules' : '8 विधिक मॉड्यूल'}
            </h3>
          </div>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB]">
            {progressPercent}%
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-[#F3F4F6] h-1.5 rounded-full overflow-hidden mb-3.5">
          <div
            className="bg-[#111827] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Vertical Step Navigation List */}
        <nav aria-label="Filing Modules" className="space-y-1">
          {STEPS_META.map((step) => {
            const isActive = currentStep === step.id;
            const completed = isStepDone(step.id);
            const title = isEn ? step.enTitle : step.hiTitle;
            const subtitle = isEn ? step.enSub : step.hiSub;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepClick(step.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white text-[#111827]'
                        : completed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#F3F4F6] text-[#6B7280]'
                    }`}
                  >
                    {completed && !isActive ? '✓' : step.id}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-[#1F2937]'}`}>
                      {title}
                    </p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-[#9CA3AF]'}`}>
                      {subtitle}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mr-1" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. Admin Case Telemetry / Summary Widget */}
      <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5E7EB]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
            {isEn ? 'Case File Telemetry' : 'प्रकरण विवरण (सारसंक्षेप)'}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white text-[#374151] border border-[#E5E7EB]">
            {cd.complaintYear || '2026'}
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div>
            <span className="text-[10px] text-[#6B7280] block uppercase font-medium">
              {isEn ? 'Commission / Forum' : 'आयोग / न्यायालय'}
            </span>
            <p className="font-semibold text-[#111827] truncate">
              {cd.commissionDistrict ? `${cd.commissionDistrict} District Commission` : (isEn ? 'District Commission' : 'जिला उपभोक्ता आयोग')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#EFEFEF]">
            <div>
              <span className="text-[10px] text-[#6B7280] block uppercase font-medium">
                {isEn ? 'Claimed Amount' : 'कुल दावा राशि'}
              </span>
              <p className="font-bold text-[#111827] truncate">
                ₹{claimedAmount}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] block uppercase font-medium">
                {isEn ? 'Category' : 'विवाद श्रेणी'}
              </span>
              <p className="font-medium text-[#111827] truncate">
                {cd.category || (isEn ? 'Consumer' : 'उपभोक्ता')}
              </p>
            </div>
          </div>

          <div className="pt-1 border-t border-[#EFEFEF]">
            <span className="text-[10px] text-[#6B7280] block uppercase font-medium">
              {isEn ? 'Parties' : 'पक्षकार'}
            </span>
            <p className="text-[11px] text-[#374151] truncate">
              <span className="font-medium">{primaryComplainantName}</span> vs <span className="font-medium">{primaryOpName}</span>
            </p>
          </div>
        </div>

        {/* 3. Fast Action Command Buttons in Sidebar */}
        <div className="mt-4 pt-3 border-t border-[#E5E7EB] space-y-2">
          {/* Word (.docx) Download Button */}
          <button
            type="button"
            onClick={onDownloadDocx}
            disabled={isExportingDocx}
            className="w-full flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-xs font-semibold bg-white hover:bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB] transition-colors cursor-pointer shadow-2xs disabled:opacity-50 active:scale-[0.99]"
            title={isEn ? 'Download complete filing in MS Word (.docx) format' : 'सम्पूर्ण परिवाद एमएस वर्ड (.docx) में डाउनलोड करें'}
          >
            {isExportingDocx ? (
              <>
                <Icons.Spinner size={14} className="text-[#111827]" />
                <span>{isEn ? 'Generating Word Doc...' : 'वर्ड फाइल बन रही है...'}</span>
              </>
            ) : (
              <>
                <Icons.FileText size={14} className="text-[#2563EB]" />
                <span>{isEn ? 'Download MS Word (.docx)' : 'एमएस वर्ड (.docx) डाउनलोड'}</span>
              </>
            )}
          </button>

          {/* Preview & Print PDF Button */}
          <button
            type="button"
            onClick={onPreview}
            className="w-full flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-xs font-semibold bg-[#111827] hover:bg-[#1F2937] text-white transition-colors cursor-pointer shadow-2xs active:scale-[0.99]"
            title={isEn ? 'Preview and print court filing' : 'न्यायालय परिवाद का पूर्वावलोकन एवं प्रिंट करें'}
          >
            <Icons.Eye size={14} className="text-white" />
            <span>{isEn ? 'Preview & Print PDF' : 'पूर्वावलोकन एवं प्रिंट'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

