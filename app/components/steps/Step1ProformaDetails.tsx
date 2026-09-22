'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';
import { convertNumberToIndianWords } from '../../lib/numberToWords';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

const CATEGORIES = [
  'Insurance',
  'Housing',
  'Banking & Financial Services',
  'Defective Goods / Manufacturing Defect',
  'Deficiency in Service',
  'E-Commerce & Online Orders',
  'Medical Negligence & Healthcare',
  'Airlines & Travel',
  'Telecommunications',
  'Automobiles & Vehicles',
  'Education & Coaching',
  'Other Consumer Disputes',
];

const SECTIONS = [
  { id: 'Section 35(I) (a)', label: 'Section 35(1)(a) - Filed by an individual consumer' },
  { id: 'Section 35(I) (b)', label: 'Section 35(1)(b) - Filed by a recognized consumer association' },
  { id: 'Section 35(I) (c)', label: 'Section 35(1)(c) - One or more consumers on behalf of numerous consumers (Class Action)' },
];

export const Step1ProformaDetails: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const cd = data.caseDetails;

  const handleCaseDetailChange = (field: keyof typeof cd, value: any) => {
    updateData((prev) => {
      const nextCd = { ...prev.caseDetails, [field]: value };

      // Auto update words when amount changes
      if (field === 'totalConsideration') {
        nextCd.totalConsiderationWords = convertNumberToIndianWords(value);
      }
      if (field === 'claimedAmount') {
        nextCd.claimedAmountWords = convertNumberToIndianWords(value);
      }

      return {
        ...prev,
        caseDetails: nextCd,
      };
    });
  };

  const handleSectionToggle = (secId: string) => {
    updateData((prev) => {
      const currentList = prev.caseDetails.sectionsList || [];
      const exists = currentList.includes(secId);
      const nextList = exists
        ? currentList.filter((s) => s !== secId)
        : [...currentList, secId];

      return {
        ...prev,
        caseDetails: {
          ...prev.caseDetails,
          sectionsList: nextList,
          section: nextList.join(', '),
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Commission Information */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
              1
            </span>
            Commission & Forum Information
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Specify the Consumer Commission where this complaint will be instituted (Matches Page 1 of Proforma).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Commission Forum Name
            </label>
            <input
              type="text"
              value={cd.commissionName}
              onChange={(e) => handleCaseDetailChange('commissionName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="DISTRICT CONSUMER DISPUTE REDRESSAL COMMISSION"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              District / State / Place of Commission
            </label>
            <input
              type="text"
              value={cd.commissionPlace}
              onChange={(e) => handleCaseDetailChange('commissionPlace', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="e.g. PATNA or NEW DELHI"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Complaint Number (Optional / Registry)
            </label>
            <input
              type="text"
              value={cd.complaintNo}
              onChange={(e) => handleCaseDetailChange('complaintNo', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="e.g. 142 or leave blank for court clerk"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Filing Year
            </label>
            <input
              type="text"
              value={cd.complaintYear}
              onChange={(e) => handleCaseDetailChange('complaintYear', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="2024"
            />
          </div>
        </div>
      </div>

      {/* Case Category & Statutory Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
              2
            </span>
            Dispute Category & Statutory Section
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Required for assessing jurisdiction and court fee calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Case Category *
            </label>
            <select
              value={cd.category}
              onChange={(e) => handleCaseDetailChange('category', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors bg-white ${
                errors.category ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
              }`}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Applicable Section under CPA, 2019 *
            </label>
            <div className="space-y-2 mt-2">
              {SECTIONS.map((sec) => {
                const isChecked = cd.sectionsList?.includes(sec.id);
                return (
                  <label
                    key={sec.id}
                    className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer text-xs transition-colors ${
                      isChecked
                        ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-medium'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSectionToggle(sec.id)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                    />
                    <span>{sec.label}</span>
                  </label>
                );
              })}
            </div>
            {errors.section && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.section}</p>
            )}
          </div>
        </div>

        {/* Housing conditional fields */}
        {cd.category === 'Housing' && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Housing / Real Estate Specific Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Project Name (Housing)</label>
                <input
                  type="text"
                  value={cd.projectName || ''}
                  onChange={(e) => handleCaseDetailChange('projectName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  placeholder="e.g. Green Valley Residency, Tower C"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Relief Nature (Refund/Possession/Interest)</label>
                <input
                  type="text"
                  value={cd.refundOrPossession || ''}
                  onChange={(e) => handleCaseDetailChange('refundOrPossession', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  placeholder="Refund of principal with 12% interest"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Consideration & Claim Valuation */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
              3
            </span>
            Pecuniary Valuation & Claim Amounts
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Total consideration paid determines court fees and pecuniary jurisdiction (District: up to ₹50 Lakhs).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Total Consideration Paid (₹) *
            </label>
            <input
              type="text"
              value={cd.totalConsideration}
              onChange={(e) => handleCaseDetailChange('totalConsideration', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors ${
                errors.totalConsideration ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
              }`}
              placeholder="e.g. 1,20,000"
            />
            {cd.totalConsiderationWords && (
              <p className="text-xs text-amber-700 mt-1 italic">
                (Rupees {cd.totalConsiderationWords} only)
              </p>
            )}
            {errors.totalConsideration && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.totalConsideration}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Total Claimed Amount (₹) *
            </label>
            <input
              type="text"
              value={cd.claimedAmount}
              onChange={(e) => handleCaseDetailChange('claimedAmount', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors ${
                errors.claimedAmount ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
              }`}
              placeholder="e.g. 25,00,000"
            />
            {cd.claimedAmountWords && (
              <p className="text-xs text-amber-700 mt-1 italic">
                (Rupees {cd.claimedAmountWords} only)
              </p>
            )}
            {errors.claimedAmount && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.claimedAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Interest Claimed (% p.a.)
            </label>
            <input
              type="text"
              value={cd.interestRate}
              onChange={(e) => handleCaseDetailChange('interestRate', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="12"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Interest From Date
            </label>
            <input
              type="text"
              value={cd.interestFromDate}
              onChange={(e) => handleCaseDetailChange('interestFromDate', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="e.g. 15/04/2023 or Date of Death"
            />
          </div>
        </div>
      </div>

      {/* Cause of Action & Limitation Details */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
              4
            </span>
            Cause of Action & Legal Limitation
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Section 69 of CPA 2019 sets a 2-year limitation period from the date cause of action arose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Date of Cause of Action
            </label>
            <input
              type="text"
              value={cd.dateOfCauseOfAction}
              onChange={(e) => handleCaseDetailChange('dateOfCauseOfAction', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="e.g. 14/09/2023"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              State of Cause of Action
            </label>
            <input
              type="text"
              value={cd.stateOfCauseOfAction}
              onChange={(e) => handleCaseDetailChange('stateOfCauseOfAction', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="e.g. Bihar"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              District of Cause of Action
            </label>
            <input
              type="text"
              value={cd.districtOfCauseOfAction}
              onChange={(e) => handleCaseDetailChange('districtOfCauseOfAction', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="e.g. Patna"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Delay, if any, computing limitation period
            </label>
            <input
              type="text"
              value={cd.limitationDelay}
              onChange={(e) => handleCaseDetailChange('limitationDelay', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="No delay. Complaint filed within 2 years from date of cause of action under Sec 69."
            />
          </div>
        </div>
      </div>

      {/* Advocate Details */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
              5
            </span>
            Complainant's Advocate Details (Proforma Page 2)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Counsel information appearing on the proforma verification and signatures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Advocate Name
            </label>
            <input
              type="text"
              value={cd.advocateName}
              onChange={(e) => handleCaseDetailChange('advocateName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="e.g. Rajesh Kumar Singh"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Advocate Phone / Mobile
            </label>
            <input
              type="text"
              value={cd.advocatePhone}
              onChange={(e) => handleCaseDetailChange('advocatePhone', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="9431098765"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Advocate Chamber / Office Address
            </label>
            <input
              type="text"
              value={cd.advocateAddress}
              onChange={(e) => handleCaseDetailChange('advocateAddress', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="Chamber No. 44, Bar Association Building, Civil Court"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
