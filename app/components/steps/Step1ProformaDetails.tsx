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

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

const BIHAR_DISTRICTS = [
  'Araria',
  'Arwal',
  'Aurangabad',
  'Banka',
  'Begusarai',
  'Bhagalpur',
  'Bhojpur',
  'Buxar',
  'Darbhanga',
  'East Champaran',
  'Gaya',
  'Gopalganj',
  'Jamui',
  'Jehanabad',
  'Kaimur',
  'Katihar',
  'Khagaria',
  'Kishanganj',
  'Lakhisarai',
  'Madhepura',
  'Madhubani',
  'Munger',
  'Muzaffarpur',
  'Nalanda',
  'Nawada',
  'Patna',
  'Purnia',
  'Rohtas',
  'Saharsa',
  'Samastipur',
  'Saran',
  'Sheikhpura',
  'Sheohar',
  'Sitamarhi',
  'Siwan',
  'Supaul',
  'Vaishali',
  'West Champaran',
];

export const Step1ProformaDetails: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const cd = data.caseDetails;

  const handleCaseDetailChange = (field: keyof typeof cd, value: string | string[]) => {
    updateData((prev) => {
      const nextCd = { ...prev.caseDetails, [field]: value };

      // Auto update words when amount changes
      if (field === 'totalConsideration' && typeof value === 'string') {
        nextCd.totalConsiderationWords = convertNumberToIndianWords(value);
      }
      if (field === 'claimedAmount' && typeof value === 'string') {
        nextCd.claimedAmountWords = convertNumberToIndianWords(value);
      }

      // Auto sync limitation delay and condonation application if hasDelay changes
      if (field === 'hasDelay') {
        if (value === 'No') {
          nextCd.limitationDelay = 'No delay. Complaint filed within the statutory limitation period of 2 years under Section 69 of Consumer Protection Act, 2019.';
          nextCd.condonationApplicationAttached = 'N/A';
        } else {
          const daysText = nextCd.delayDays ? `${nextCd.delayDays} days` : 'specified period';
          nextCd.limitationDelay = `Yes, delay of ${daysText}. Application for condonation of delay filed herewith under Section 69(2).`;
          if (nextCd.condonationApplicationAttached === 'N/A') {
            nextCd.condonationApplicationAttached = 'Yes';
          }
        }
      }

      // If delayDays changes while hasDelay is Yes
      if (field === 'delayDays' && typeof value === 'string') {
        if (nextCd.hasDelay === 'Yes') {
          nextCd.limitationDelay = `Yes, delay of ${value || '____'} days. Application for condonation of delay filed herewith under Section 69(2).`;
        }
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

  const isHousing = cd.category === 'Housing' || cd.hasHousingProject === 'Yes';

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
              placeholder="e.g. Muzaffarpur or PATNA"
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
              placeholder="2026"
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
              Case Category (Dropdown) *
            </label>
            <select
              value={cd.category}
              onChange={(e) => {
                const val = e.target.value;
                handleCaseDetailChange('category', val);
                if (val === 'Housing') {
                  handleCaseDetailChange('hasHousingProject', 'Yes');
                }
              }}
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

        {/* Housing / Land Project Details (Annotated: drop down N/A Yes) */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Housing / Real Estate Project Category (Row 5 & 6)
              </h4>
              <p className="text-[11px] text-slate-500">
                Annotated in Proforma: Dropdown N/A / Yes for housing projects.
              </p>
            </div>
            <div className="w-44 shrink-0">
              <select
                value={cd.hasHousingProject || (cd.category === 'Housing' ? 'Yes' : 'N/A')}
                onChange={(e) => handleCaseDetailChange('hasHousingProject', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
              >
                <option value="N/A">N/A (Not Housing dispute)</option>
                <option value="Yes">Yes (Housing / Land dispute)</option>
              </select>
            </div>
          </div>

          {isHousing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Project Name (Housing)
                </label>
                <input
                  type="text"
                  value={cd.projectName || ''}
                  onChange={(e) => handleCaseDetailChange('projectName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  placeholder="e.g. Green Valley Residency, Tower C"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Page No. where mentioned
                </label>
                <input
                  type="text"
                  value={cd.projectMentionPage || ''}
                  onChange={(e) => handleCaseDetailChange('projectMentionPage', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  placeholder="e.g. Page 12 of Annexure-1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Relief Nature (Refund/Possession/Interest)
                </label>
                <input
                  type="text"
                  value={cd.refundOrPossession || ''}
                  onChange={(e) => handleCaseDetailChange('refundOrPossession', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  placeholder="Refund of principal with 12% interest"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pending Housing Consumer Complaints in respect of same project (Row 8)
                </label>
                <input
                  type="text"
                  value={cd.pendingHousingComplaints || ''}
                  onChange={(e) => handleCaseDetailChange('pendingHousingComplaints', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  placeholder="N/A or details of pending complaint(s)"
                />
              </div>
            </div>
          )}

          {/* Row 9: Identical Question of Law */}
          <div className="pt-2 border-t border-slate-200/60">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Details of any pending/disposed of Consumer Complaint involving identical question of law (Row 9)
            </label>
            <input
              type="text"
              value={cd.pendingIdenticalLaw || 'None'}
              onChange={(e) => handleCaseDetailChange('pendingIdenticalLaw', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
              placeholder="None (or case number and court details)"
            />
          </div>
        </div>
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
              placeholder="e.g. Date of filing / 15/04/2023"
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
            Cause of Action & Legal Limitation (Rows 10–13)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Section 69 of CPA 2019 sets a 2-year limitation period from the date cause of action arose. Annotated with State and District dropdowns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Date of Cause of Action (Row 10)
            </label>
            <input
              type="text"
              value={cd.dateOfCauseOfAction}
              onChange={(e) => handleCaseDetailChange('dateOfCauseOfAction', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              placeholder="e.g. 14/09/2023 or 25/03/2026"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              State of Cause of Action (Row 11 - Dropdown)
            </label>
            <select
              value={cd.stateOfCauseOfAction}
              onChange={(e) => handleCaseDetailChange('stateOfCauseOfAction', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors bg-white font-medium"
            >
              <option value="">Select State / UT</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              District of Cause of Action (Row 12 - Dropdown)
            </label>
            {cd.stateOfCauseOfAction === 'Bihar' ? (
              <select
                value={cd.districtOfCauseOfAction}
                onChange={(e) => handleCaseDetailChange('districtOfCauseOfAction', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors bg-white font-medium"
              >
                <option value="">Select District</option>
                {BIHAR_DISTRICTS.map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={cd.districtOfCauseOfAction}
                onChange={(e) => handleCaseDetailChange('districtOfCauseOfAction', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                placeholder="e.g. Patna / Muzaffarpur / New Delhi"
              />
            )}
          </div>

          {/* Row 13: Delay dropdown & No of days */}
          <div className="md:col-span-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Delay, if any, computing period of limitation (Row 13)
                </label>
                <p className="text-[11px] text-slate-500">
                  Annotated: Dropdown No delay / Yes (If Yes, specify number of days delay)
                </p>
              </div>

              <div className="w-52 shrink-0">
                <select
                  value={cd.hasDelay || (cd.limitationDelay?.toLowerCase().includes('no delay') ? 'No' : 'Yes')}
                  onChange={(e) => handleCaseDetailChange('hasDelay', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                >
                  <option value="No">No delay (Within 2 years)</option>
                  <option value="Yes">Yes (Delay occurred)</option>
                </select>
              </div>
            </div>

            {cd.hasDelay === 'Yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Days Delay
                  </label>
                  <input
                    type="text"
                    value={cd.delayDays || ''}
                    onChange={(e) => handleCaseDetailChange('delayDays', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                    placeholder="e.g. 45 days or 3 months"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Condonation Application (Row 14)
                  </label>
                  <select
                    value={cd.condonationApplicationAttached || 'Yes'}
                    onChange={(e) => handleCaseDetailChange('condonationApplicationAttached', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Yes">Yes (Attached with Notarised affidavit)</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Generated Limitation Text for Proforma:
              </label>
              <input
                type="text"
                value={cd.limitationDelay}
                onChange={(e) => handleCaseDetailChange('limitationDelay', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Legal Proforma Declarations (Page 2 Rows 14–17) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
              5
            </span>
            Proforma Declarations & Attestations (Page 2 Rows 14–17)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Standard statutory declarations annotated with dropdowns on Page 2 of Proforma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Condonation Application (Row 14)
            </label>
            <select
              value={cd.condonationApplicationAttached || 'N/A'}
              onChange={(e) => handleCaseDetailChange('condonationApplicationAttached', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
            >
              <option value="N/A">N/A (By default if no delay)</option>
              <option value="Yes">Yes (Attached with Notarised affidavit)</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attested True Copies? (Row 15)
            </label>
            <select
              value={cd.documentsAttestedTrueCopies || 'Yes'}
              onChange={(e) => handleCaseDetailChange('documentsAttestedTrueCopies', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              English Translations? (Row 16)
            </label>
            <select
              value={cd.englishTranslationsFiled || 'N/A'}
              onChange={(e) => handleCaseDetailChange('englishTranslationsFiled', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
            >
              <option value="N/A">N/A (Not Applicable)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone & Email Filed? (Row 17)
            </label>
            <select
              value={cd.phoneEmailFiled || 'Yes'}
              onChange={(e) => handleCaseDetailChange('phoneEmailFiled', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advocate Details */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
              6
            </span>
            Complainant&apos;s Advocate Details (Proforma Page 2)
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
              placeholder="e.g. AASHIF HUSSAIN or Subodh Kumar Jha"
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
              placeholder="Bar Association Building, Civil Court, Muzaffarpur"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
