'use client';

import React, { useEffect, useState } from 'react';
import { ComplaintFormData } from '../../types/complaint';
import { convertNumberToIndianWords } from '../../lib/numberToWords';
import { ALL_INDIAN_STATES, getDistrictsByState } from '../../lib/indiaStatesDistricts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { TRANSLATIONS } from '../../lib/translations';

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

const CATEGORY_LABELS_HI: Record<string, string> = {
  'Insurance': 'बीमा विवाद (Insurance)',
  'Housing': 'आवास / रियल एस्टेट (Housing)',
  'Banking & Financial Services': 'बैंकिंग एवं वित्तीय सेवाएं (Banking & Financial Services)',
  'Defective Goods / Manufacturing Defect': 'दोषपूर्ण उत्पाद / निर्माण दोष (Defective Goods)',
  'Deficiency in Service': 'सेवा में कमी (Deficiency in Service)',
  'E-Commerce & Online Orders': 'ई-कॉमर्स एवं ऑनलाइन ऑर्डर (E-Commerce)',
  'Medical Negligence & Healthcare': 'चिकित्सा लापरवाही एवं अस्पताल (Medical Negligence)',
  'Airlines & Travel': 'एयरलाइंस एवं यात्रा (Airlines & Travel)',
  'Telecommunications': 'दूरसंचार एवं मोबाइल सेवाएं (Telecommunications)',
  'Automobiles & Vehicles': 'वाहन एवं ऑटोमोबाइल (Automobiles)',
  'Education & Coaching': 'शिक्षा एवं कोचिंग संस्थान (Education & Coaching)',
  'Other Consumer Disputes': 'अन्य उपभोक्ता विवाद (Other Consumer Disputes)',
};

const SECTIONS_HI = [
  { id: 'Section 35(I) (a)', label: 'धारा 35(1)(a) — व्यक्तिगत उपभोक्ता द्वारा परिवाद' },
  { id: 'Section 35(I) (b)', label: 'धारा 35(1)(b) — मान्यता प्राप्त उपभोक्ता संस्था द्वारा' },
  { id: 'Section 35(I) (c)', label: 'धारा 35(1)(c) — समान हित वाले अनेक उपभोक्ताओं की ओर से (वर्ग परिवाद)' },
];

const SECTIONS_EN = [
  { id: 'Section 35(I) (a)', label: 'Section 35(1)(a) — Complaint by Individual Consumer' },
  { id: 'Section 35(I) (b)', label: 'Section 35(1)(b) — Complaint by Recognized Consumer Association' },
  { id: 'Section 35(I) (c)', label: 'Section 35(1)(c) — Class Action on behalf of Numerous Consumers' },
];

function parseCurrencyNumber(val?: string): number {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function formatToIndianCurrency(num: number): string {
  if (num === 0) return '';
  const parts = Math.round(num).toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + decimalPart;
}

export const Step1ProformaDetails: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const isEn = data.language === 'en';
  const t = TRANSLATIONS[data.language || 'hi'].step1;
  const cd = data.caseDetails;
  const currentApplyingYear = new Date().getFullYear().toString();

  // Dynamic States from API (backed by authoritative local Indian dataset)
  const [statesList, setStatesList] = useState<string[]>(ALL_INDIAN_STATES);
  const [commissionDistricts, setCommissionDistricts] = useState<string[]>([]);
  const [causeOfActionDistricts, setCauseOfActionDistricts] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchStates() {
      try {
        const res = await fetch('/api/locations');
        if (res.ok) {
          const json = await res.json();
          if (json.states && Array.isArray(json.states) && isMounted) {
            setStatesList(json.states);
          }
        }
      } catch {
        if (isMounted) setStatesList(ALL_INDIAN_STATES);
      }
    }
    fetchStates();
    return () => {
      isMounted = false;
    };
  }, []);

  // Ensure filing year is always autofilled with the current application year
  useEffect(() => {
    if (cd.complaintYear !== currentApplyingYear) {
      updateData((prev) => ({
        ...prev,
        caseDetails: {
          ...prev.caseDetails,
          complaintYear: currentApplyingYear,
        },
      }));
    }
  }, [cd.complaintYear, currentApplyingYear, updateData]);

  const activeCommissionState = cd.commissionState || (cd.commissionPlace === 'PATNA' ? 'Bihar' : '');

  useEffect(() => {
    let isMounted = true;
    if (!activeCommissionState) {
      setCommissionDistricts([]);
      return;
    }

    async function fetchDistricts() {
      try {
        const res = await fetch(`/api/locations?state=${encodeURIComponent(activeCommissionState)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.districts && Array.isArray(json.districts) && isMounted) {
            setCommissionDistricts(json.districts);
            return;
          }
        }
      } catch {
        // fallback
      }
      if (isMounted) {
        setCommissionDistricts(getDistrictsByState(activeCommissionState));
      }
    }
    fetchDistricts();
    return () => {
      isMounted = false;
    };
  }, [activeCommissionState]);

  // Districts for Section 4 (Cause of Action)
  useEffect(() => {
    let isMounted = true;
    if (!cd.stateOfCauseOfAction) {
      setCauseOfActionDistricts([]);
      return;
    }

    async function fetchDistricts() {
      try {
        const res = await fetch(`/api/locations?state=${encodeURIComponent(cd.stateOfCauseOfAction)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.districts && Array.isArray(json.districts) && isMounted) {
            setCauseOfActionDistricts(json.districts);
            return;
          }
        }
      } catch {
        // fallback
      }
      if (isMounted) {
        setCauseOfActionDistricts(getDistrictsByState(cd.stateOfCauseOfAction));
      }
    }
    fetchDistricts();
    return () => {
      isMounted = false;
    };
  }, [cd.stateOfCauseOfAction]);

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

      // Auto-populate totalConsideration from valueOfGoods if not yet provided
      if (field === 'valueOfGoods' && typeof value === 'string') {
        if (!nextCd.totalConsideration || !nextCd.totalConsideration.trim()) {
          nextCd.totalConsideration = value;
          nextCd.totalConsiderationWords = convertNumberToIndianWords(value);
        }
      }

      // Sync considerationAmount and compensationAmount
      if (field === 'considerationAmount' && typeof value === 'string') {
        nextCd.compensationAmount = value;
      }
      if (field === 'compensationAmount' && typeof value === 'string') {
        nextCd.considerationAmount = value;
      }

      // Automatic Total Calculation:
      // Total Amount = Value of Goods + Consideration / Compensation Amount + Litigation Amount
      if (
        field === 'valueOfGoods' ||
        field === 'considerationAmount' ||
        field === 'compensationAmount' ||
        field === 'litigationAmount'
      ) {
        const valGoods = parseCurrencyNumber(
          field === 'valueOfGoods' ? (value as string) : nextCd.valueOfGoods
        );
        const valCons = parseCurrencyNumber(
          field === 'considerationAmount' || field === 'compensationAmount'
            ? (value as string)
            : (nextCd.considerationAmount || nextCd.compensationAmount)
        );
        const valLit = parseCurrencyNumber(
          field === 'litigationAmount' ? (value as string) : nextCd.litigationAmount
        );

        const total = valGoods + valCons + valLit;
        if (total > 0) {
          nextCd.claimedAmount = formatToIndianCurrency(total);
          nextCd.claimedAmountWords = convertNumberToIndianWords(nextCd.claimedAmount);
        } else if (
          (!nextCd.valueOfGoods || !nextCd.valueOfGoods.trim()) &&
          (!nextCd.considerationAmount || !nextCd.considerationAmount.trim()) &&
          (!nextCd.compensationAmount || !nextCd.compensationAmount.trim()) &&
          (!nextCd.litigationAmount || !nextCd.litigationAmount.trim())
        ) {
          nextCd.claimedAmount = '';
          nextCd.claimedAmountWords = '';
        }
      }

      // Auto sync limitation delay and condonation application if hasDelay changes
      if (field === 'hasDelay') {
        if (value === 'No') {
          nextCd.limitationDelay =
            'कोई विलंब नहीं। परिवाद उपभोक्ता संरक्षण अधिनियम, 2019 की धारा 69 के तहत 2 वर्ष की सांविधिक परिसीमा के भीतर दायर किया गया है।';
          nextCd.condonationApplicationAttached = 'N/A';
        } else {
          const daysText = nextCd.delayDays ? `${nextCd.delayDays} दिन` : 'निर्दिष्ट अवधि';
          nextCd.limitationDelay = `हाँ, ${daysText} का विलंब। धारा 69(2) के तहत विलंब माफी का आवेदन संलग्न है।`;
          if (nextCd.condonationApplicationAttached === 'N/A') {
            nextCd.condonationApplicationAttached = 'Yes';
          }
        }
      }

      // If delayDays changes while hasDelay is Yes
      if (field === 'delayDays' && typeof value === 'string') {
        if (nextCd.hasDelay === 'Yes') {
          nextCd.limitationDelay = `हाँ, ${value || '____'} दिन का विलंब। धारा 69(2) के तहत विलंब माफी का आवेदन संलग्न है।`;
        }
      }

      return {
        ...prev,
        caseDetails: nextCd,
      };
    });
  };

  // State selection handler for Forum Commission
  const handleCommissionStateChange = (stateName: string) => {
    updateData((prev) => {
      const availableDists = getDistrictsByState(stateName);
      const isDistrictStillValid = availableDists.includes(prev.caseDetails.commissionDistrict || '');
      const newDistrict = isDistrictStillValid ? prev.caseDetails.commissionDistrict : '';
      const newPlace = newDistrict ? newDistrict.toUpperCase() : '';

      return {
        ...prev,
        caseDetails: {
          ...prev.caseDetails,
          commissionState: stateName,
          commissionDistrict: newDistrict,
          commissionPlace: newPlace,
        },
      };
    });
  };

  // District selection handler for Forum Commission
  const handleCommissionDistrictChange = (districtName: string) => {
    updateData((prev) => ({
      ...prev,
      caseDetails: {
        ...prev.caseDetails,
        commissionDistrict: districtName,
        commissionPlace: districtName ? districtName.toUpperCase() : '',
      },
    }));
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
      {/* 1. Commission & Forum Information */}
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
              1
            </span>
            <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
              {isEn ? '1. Consumer Commission Details (Commission & Filing Details)' : '1. आयोग एवं परिवाद विवरण (Commission & Filing Details)'}
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs text-[#666666]">
            {isEn
              ? 'Select the consumer commission having territorial jurisdiction where this complaint is to be filed (matches Page 1 of Court Proforma).'
              : 'उस उपभोक्ता आयोग का चयन करें जहाँ यह परिवाद दायर किया जाना है (न्यायालय प्रपत्र के पृष्ठ 1 से संबंधित)।'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Commission Forum Name */}
            <div className="md:col-span-2">
              <Label htmlFor="commissionName" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'Consumer Commission Name' : 'उपभोक्ता आयोग का नाम'} <span className="text-red-600">*</span>
              </Label>
              <Input
                id="commissionName"
                type="text"
                value={cd.commissionName}
                onChange={(e) => handleCaseDetailChange('commissionName', e.target.value)}
                placeholder="DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION"
                className="bg-white"
              />
            </div>

            {/* 2. List all states */}
            <div>
              <Label htmlFor="commissionState" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'State / Union Territory (State / UT)' : 'राज्य / केंद्र शासित प्रदेश (State / UT)'} <span className="text-red-600">*</span>
              </Label>
              <Select
                id="commissionState"
                value={activeCommissionState}
                onChange={(e) => handleCommissionStateChange(e.target.value)}
                className="bg-white"
              >
                <option value="">{isEn ? 'Select State' : 'राज्य चुनें'}</option>
                {statesList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </Select>
            </div>

            {/* 3. List all districts of the selected state */}
            <div>
              <Label htmlFor="commissionDistrict" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'District of Commission' : 'आयोग का जिला (District of Commission)'} <span className="text-red-600">*</span>
              </Label>
              <Select
                id="commissionDistrict"
                disabled={!activeCommissionState}
                value={cd.commissionDistrict || cd.commissionPlace || ''}
                onChange={(e) => handleCommissionDistrictChange(e.target.value)}
                className="bg-white"
              >
                <option value="">
                  {activeCommissionState
                    ? (isEn ? 'Select District' : 'जिला चुनें')
                    : (isEn ? 'Select State First' : 'पहले राज्य चुनें')}
                </option>
                {commissionDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </Select>
            </div>

            {/* 4. Complaint Number (Disabled, Office created) */}
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <Label htmlFor="complaintNo" className="text-xs font-medium text-[#222222]">
                  {isEn ? 'Complaint Number' : 'परिवाद संख्या (Complaint Number)'}
                </Label>
                <Badge variant="neutral" className="text-[10px] font-medium py-0.5 px-2">
                  {isEn ? 'Allotted by Registry / Office' : 'कार्यालय / रजिस्ट्री द्वारा आवंटित होगी'}
                </Badge>
              </div>
              <Input
                id="complaintNo"
                type="text"
                disabled
                noTransliterate={true}
                value={cd.complaintNo || ''}
                placeholder={isEn ? 'To be allotted by registry / office' : 'कार्यालय / रजिस्ट्री द्वारा आवंटित होगी'}
                className="bg-[#F7F7F7] text-[#888888] cursor-not-allowed border-[#E5E5E5] placeholder:text-[#AAAAAA] placeholder:italic select-none"
              />
              <p className="text-[11px] text-[#666666] mt-1">
                {isEn
                  ? 'Complaint number is officially assigned by the commission registry upon filing. Leave blank.'
                  : 'परिवाद संख्या न्यायालय में वाद दायर होने पर रजिस्ट्री द्वारा दी जाती है। अतः इसे रिक्त छोड़ें।'}
              </p>
            </div>

            {/* 5. Filing Year (autofilled current year, disabled) */}
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <Label htmlFor="complaintYear" className="text-xs font-medium text-[#222222]">
                  {isEn ? 'Filing Year' : 'आवेदन वर्ष (Filing Year)'}
                </Label>
                <Badge variant="outline" className="text-[10px] font-medium py-0.5 px-2 text-[#444444] bg-[#FAFAFA] border-[#E5E5E5]">
                  {isEn ? `Current Year: ${currentApplyingYear}` : `वर्तमान वर्ष: ${currentApplyingYear}`}
                </Badge>
              </div>
              <Input
                id="complaintYear"
                type="text"
                disabled
                readOnly
                noTransliterate={true}
                value={currentApplyingYear}
                placeholder={currentApplyingYear}
                className="bg-[#F7F7F7] text-[#111111] cursor-not-allowed border-[#E5E5E5] select-none font-medium"
              />
              <p className="text-[11px] text-[#666666] mt-1">
                {isEn
                  ? <>Filing year is automatically set to current year (<span className="font-medium text-[#111111]">{currentApplyingYear}</span>).</>
                  : <>आवेदन वर्ष स्वतः चालू वर्ष (<span className="font-medium text-[#111111]">{currentApplyingYear}</span>) पर निर्धारित है।</>}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Dispute Category & Statutory Section */}
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
              2
            </span>
            <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
              {isEn ? '2. Dispute Category & Statutory Sections' : '2. विवाद की श्रेणी एवं लागू धाराएं (Dispute Category & Section)'}
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs text-[#666666]">
            {isEn
              ? 'Jurisdiction and statutory legal provisions under the Consumer Protection Act, 2019.'
              : 'उपभोक्ता संरक्षण अधिनियम, 2019 के अंतर्गत अधिकार क्षेत्र एवं विधिक प्रावधान।'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'Dispute Category' : 'केस की श्रेणी (Dispute Category)'} <span className="text-red-600">*</span>
              </Label>
              <Select
                id="category"
                value={cd.category}
                onChange={(e) => {
                  const val = e.target.value;
                  handleCaseDetailChange('category', val);
                  if (val === 'Housing') {
                    handleCaseDetailChange('hasHousingProject', 'Yes');
                  }
                }}
                className={`bg-white ${errors.category ? 'border-red-500 bg-red-50/20' : ''}`}
              >
                <option value="">{isEn ? 'Select Category' : 'श्रेणी चुनें'}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {isEn ? cat : (CATEGORY_LABELS_HI[cat] || cat)}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.category}</p>
              )}
            </div>

            <div>
              <Label className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'Applicable Statutory Section' : 'लागू कानूनी धारा (Applicable Section)'} <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-2 mt-1">
                {(isEn ? SECTIONS_EN : SECTIONS_HI).map((sec) => {
                  const isChecked = cd.sectionsList?.includes(sec.id);
                  return (
                    <label
                      key={sec.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#111111] bg-[#F7F7F7] font-semibold text-[#111111]'
                          : 'border-[#E5E5E5] hover:bg-[#FAFAFA] text-[#444444]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSectionToggle(sec.id)}
                        className="mt-0.5 rounded text-[#111111] accent-[#111111]"
                      />
                      <span>{sec.label}</span>
                    </label>
                  );
                })}
              </div>
              {errors.section && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.section}</p>
              )}
            </div>
          </div>

          {/* Housing / Land Project Details */}
          <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] pb-2.5">
              <div>
                <h3 className="text-xs font-semibold text-[#111111]">
                  {isEn ? 'Housing / Plot Builder Project Category (Rows 5 & 6)' : 'आवास / भूखंड परियोजना श्रेणी (पंक्ति 5 व 6)'}
                </h3>
                <p className="text-[11px] text-[#666666]">
                  {isEn ? 'Fill if the dispute pertains to flat, plot, or real estate developer.' : 'यदि मामला फ्लैट, भूखंड अथवा रियल एस्टेट बिल्डर से संबंधित है।'}
                </p>
              </div>
              <div className="w-full sm:w-48 shrink-0">
                <Select
                  value={cd.hasHousingProject || (cd.category === 'Housing' ? 'Yes' : 'N/A')}
                  onChange={(e) => handleCaseDetailChange('hasHousingProject', e.target.value)}
                  className="font-medium bg-white"
                >
                  <option value="N/A">{isEn ? 'N/A (Not a Housing Dispute)' : 'N/A (आवास विवाद नहीं है)'}</option>
                  <option value="Yes">{isEn ? 'Yes (Housing / Builder Dispute)' : 'हाँ (आवास / बिल्डर विवाद)'}</option>
                </Select>
              </div>
            </div>

            {isHousing && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div>
                  <Label htmlFor="projectName" className="block text-xs font-medium text-[#222222] mb-1">
                    {isEn ? 'Project Name' : 'प्रोजेक्ट का नाम (Project Name)'}
                  </Label>
                  <Input
                    id="projectName"
                    type="text"
                    value={cd.projectName || ''}
                    onChange={(e) => handleCaseDetailChange('projectName', e.target.value)}
                    placeholder={isEn ? 'Project / Society Name' : 'प्रोजेक्ट / सोसायटी का नाम'}
                    className="bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="projectMentionPage" className="block text-xs font-medium text-[#222222] mb-1">
                    {isEn ? 'Page Number Where Mentioned' : 'पृष्ठ संख्या जहाँ उल्लेख है'}
                  </Label>
                  <Input
                    id="projectMentionPage"
                    type="text"
                    value={cd.projectMentionPage || ''}
                    onChange={(e) => handleCaseDetailChange('projectMentionPage', e.target.value)}
                    placeholder={isEn ? 'e.g. Page 15 or Annexure-2' : 'जैसे: पृष्ठ 15 अथवा संलग्नक-2'}
                    className="bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="refundOrPossession" className="block text-xs font-medium text-[#222222] mb-1">
                    {isEn ? 'Nature of Relief (Refund / Possession)' : 'राहत की प्रकृति (Refund / Possession)'}
                  </Label>
                  <Input
                    id="refundOrPossession"
                    type="text"
                    value={cd.refundOrPossession || ''}
                    onChange={(e) => handleCaseDetailChange('refundOrPossession', e.target.value)}
                    placeholder={isEn ? 'Refund / Possession' : 'धन वापसी (Refund) / कब्जा (Possession)'}
                    className="bg-white"
                  />
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="pendingHousingComplaints" className="block text-xs font-medium text-[#222222] mb-1">
                    {isEn ? 'Complaints Pending for Same Project (Row 8)' : 'समान प्रोजेक्ट के संबंध में लंबित परिवाद (पंक्ति 8)'}
                  </Label>
                  <Input
                    id="pendingHousingComplaints"
                    type="text"
                    value={cd.pendingHousingComplaints || ''}
                    onChange={(e) => handleCaseDetailChange('pendingHousingComplaints', e.target.value)}
                    placeholder={isEn ? 'N/A or number of pending complaints' : 'N/A अथवा लंबित परिवाद की संख्या'}
                    className="bg-white"
                  />
                </div>
              </div>
            )}

            {/* Row 9: Identical Question of Law */}
            <div className="pt-2 border-t border-[#E5E5E5]">
              <Label htmlFor="pendingIdenticalLaw" className="block text-xs font-medium text-[#222222] mb-1">
                {isEn
                  ? 'Details of any other Complaint with Identical Question of Law (Row 9)'
                  : 'समान कानूनी प्रश्न वाले किसी अन्य लंबित / निस्तारित परिवाद का विवरण (पंक्ति 9)'}
              </Label>
              <Input
                id="pendingIdenticalLaw"
                type="text"
                value={cd.pendingIdenticalLaw === 'None' || cd.pendingIdenticalLaw === 'Non' || !cd.pendingIdenticalLaw ? 'N/A' : cd.pendingIdenticalLaw}
                onChange={(e) => handleCaseDetailChange('pendingIdenticalLaw', e.target.value)}
                placeholder={isEn ? 'N/A (Keep N/A if not applicable)' : 'N/A (लागू नहीं होने पर N/A रखें)'}
                className="bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Consideration & Claim Valuation */}
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
              3
            </span>
            <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
              {isEn ? '3. Pecuniary Valuation & Claim Breakdown' : '3. आर्थिक मूल्यांकन एवं दावा राशि (Pecuniary Valuation & Claim Breakdown)'}
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs text-[#666666]">
            {isEn
              ? 'Total consideration determines the Court Fee and Commission jurisdiction (District Commission: up to ₹50 Lakhs).'
              : 'कुल प्रतिफल राशि से न्यायालय फीस (Court Fee) एवं अधिकार क्षेत्र (District Commission: 50 लाख रुपये तक) तय होता है।'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalConsideration" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn
                  ? 'Total Consideration Paid (₹)'
                  : 'कुल प्रतिफल राशि (Total Consideration Paid) (₹)'} <span className="text-red-600">*</span> {isEn ? '(Purchase Price / Premium)' : '(क्रय मूल्य / प्रीमियम)'}
              </Label>
              <Input
                id="totalConsideration"
                type="text"
                noTransliterate={true}
                value={cd.totalConsideration}
                onChange={(e) => handleCaseDetailChange('totalConsideration', e.target.value)}
                className={`bg-white ${errors.totalConsideration ? 'border-red-500 bg-red-50/20' : ''}`}
                placeholder={isEn ? 'e.g. 20,00,000' : 'जैसे: 20,00,000'}
              />
              {cd.totalConsiderationWords && (
                <p className="text-xs text-[#666666] mt-1 font-mono">
                  ({isEn ? 'Rupees ' : 'अक्षरे '}{cd.totalConsiderationWords}{isEn ? ' only' : ' रुपये मात्र'})
                </p>
              )}
              {errors.totalConsideration && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.totalConsideration}</p>
              )}
            </div>

            {/* Goods / Services Breakdown Fields */}
            <div className="md:col-span-2 p-4 sm:p-5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#E5E5E5] pb-2.5">
                <div>
                  <h4 className="text-xs font-semibold text-[#111111]">
                    {isEn
                      ? 'Goods / Services Amount Breakdown (Pecuniary Valuation)'
                      : 'माल / सेवा राशि का मूल्यांकन विवरण (Goods / Services Amount Breakdown)'}
                  </h4>
                  <p className="text-[11px] text-[#666666]">
                    {isEn
                      ? 'Enter individual components below. Their combined total automatically calculates Total Claimed Amount.'
                      : 'तीनों घटकों का मान दर्ज करें। इनका कुल योग स्वतः "कुल दावा राशि" में जुड़ जाएगा।'}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-semibold py-1 px-2.5 bg-white text-[#111111] border-[#E5E5E5] self-start sm:self-auto shrink-0">
                  {isEn ? 'Combined Total: ₹' : 'कुल संयुक्त योग: ₹'}{cd.claimedAmount || '0'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                <div>
                  <Label htmlFor="valueOfGoods" className="block text-xs font-medium text-[#222222] mb-1">
                    {isEn ? 'Value of Goods (₹)' : 'माल / सेवा का मूल्य (Value of Goods) (₹)'}
                  </Label>
                  <Input
                    id="valueOfGoods"
                    type="text"
                    noTransliterate={true}
                    value={cd.valueOfGoods || ''}
                    onChange={(e) => handleCaseDetailChange('valueOfGoods', e.target.value)}
                    placeholder={isEn ? 'e.g. 20,00,000' : 'जैसे: 20,00,000'}
                    className="bg-white"
                  />
                  <p className="text-[10px] text-[#666666] mt-1 leading-tight">
                    {isEn
                      ? 'Insurance Sum Assured, Disputed Amount, or Value of Goods/Services Purchased.'
                      : 'बीमा सम एश्योर्ड राशि, विवादित राशि अथवा खरीदे गए सामान/सेवा का मूल्य।'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="considerationAmount" className="block text-xs font-medium text-[#222222] mb-1">
                    {isEn ? 'Consideration Amount (₹)' : 'प्रतिफल राशि (Consideration Amount) (₹)'}
                  </Label>
                  <Input
                    id="considerationAmount"
                    type="text"
                    noTransliterate={true}
                    value={cd.considerationAmount || cd.compensationAmount || ''}
                    onChange={(e) => {
                      handleCaseDetailChange('considerationAmount', e.target.value);
                      handleCaseDetailChange('compensationAmount', e.target.value);
                    }}
                    placeholder={isEn ? 'e.g. 4,50,000' : 'जैसे: 4,50,000'}
                    className="bg-white"
                  />
                  <p className="text-[10px] text-[#666666] mt-1 leading-tight">
                    {isEn
                      ? 'Amount paid or payable for purchasing the goods or services.'
                      : 'सामान या सेवा खरीदने के लिए भुगतान की गई या देय राशि।'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="litigationAmount" className="block text-xs font-medium text-[#222222] mb-1">
                    {isEn ? 'Litigation Amount (₹)' : 'मुकदमेबाजी खर्च (Litigation Amount) (₹)'}
                  </Label>
                  <Input
                    id="litigationAmount"
                    type="text"
                    noTransliterate={true}
                    value={cd.litigationAmount || ''}
                    onChange={(e) => handleCaseDetailChange('litigationAmount', e.target.value)}
                    placeholder={isEn ? 'e.g. 50,000' : 'जैसे: 50,000'}
                    className="bg-white"
                  />
                  <p className="text-[10px] text-[#666666] mt-1 leading-tight">
                    {isEn
                      ? 'Amount involved in the litigation or dispute expenses.'
                      : 'मुकदमेबाजी, नोटिस एवं कानूनी कार्रवाई में हुआ खर्च।'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <Label htmlFor="claimedAmount" className="text-xs font-semibold text-[#111111]">
                  {isEn ? 'Total Claimed Amount (₹)' : 'कुल दावा राशि (Total Claimed Amount) (₹)'} <span className="text-red-600">*</span>
                </Label>
                <span className="text-[10px] text-[#666666] font-medium">
                  {isEn ? 'Combined Total of Breakdown' : 'तीनों घटकों का कुल योग'}
                </span>
              </div>
              <Input
                id="claimedAmount"
                type="text"
                noTransliterate={true}
                value={cd.claimedAmount}
                disabled
                className={`bg-[#F7F7F7] text-[#111111] font-semibold select-none cursor-not-allowed ${
                  errors.claimedAmount ? 'border-red-500 bg-red-50/20' : ''
                }`}
                placeholder={isEn ? 'Total Claimed Amount' : 'कुल दावा राशि'}
              />
              {cd.claimedAmountWords && (
                <p className="text-xs text-[#666666] mt-1 font-mono">
                  ({isEn ? 'Rupees ' : 'अक्षरे '}{cd.claimedAmountWords}{isEn ? ' only' : ' रुपये मात्र'})
                </p>
              )}
              {errors.claimedAmount && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.claimedAmount}</p>
              )}
            </div>

            <div>
              <Label htmlFor="interestRate" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'Claimed Interest Rate (% p.a.)' : 'दावाकृत ब्याज दर (% प्रति वर्ष)'}
              </Label>
              <Input
                id="interestRate"
                type="text"
                noTransliterate={true}
                value={cd.interestRate}
                onChange={(e) => handleCaseDetailChange('interestRate', e.target.value)}
                placeholder={isEn ? 'e.g. 12' : 'जैसे: 12'}
                className="bg-white"
              />
            </div>

            <div>
              <Label htmlFor="interestFromDate" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'Interest Commencement Date' : 'ब्याज आरंभ तिथि'}
              </Label>
              <DatePicker
                id="interestFromDate"
                value={cd.interestFromDate || ''}
                onChange={(val) => handleCaseDetailChange('interestFromDate', val)}
                placeholder={isEn ? 'Select date (DD/MM/YYYY)' : 'दिनांक चुनें (DD/MM/YYYY)'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Cause of Action & Limitation Details */}
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
              4
            </span>
            <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
              {isEn ? '4. Cause of Action & Limitation Details' : '4. वाद कारण एवं परिसीमा विवरण (Cause of Action & Limitation)'}
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs text-[#666666]">
            {isEn
              ? 'Court Proforma Rows 10 to 14 (2 years statutory limitation period under Section 69).'
              : 'न्यायालय प्रपत्र की पंक्ति 10 से 14 तक (धारा 69 के तहत 2 वर्ष की परिसीमा)।'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dateOfCauseOfAction" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'Date of Cause of Action (Row 10)' : 'वाद कारण की तिथि (पंक्ति 10)'}
              </Label>
              <DatePicker
                id="dateOfCauseOfAction"
                value={cd.dateOfCauseOfAction || ''}
                onChange={(val) => handleCaseDetailChange('dateOfCauseOfAction', val)}
                placeholder={isEn ? 'Select date (DD/MM/YYYY)' : 'दिनांक चुनें (DD/MM/YYYY)'}
              />
            </div>

            <div>
              <Label htmlFor="stateOfCauseOfAction" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'State of Cause of Action (Row 11)' : 'वाद कारण का राज्य (पंक्ति 11)'}
              </Label>
              <Select
                id="stateOfCauseOfAction"
                value={cd.stateOfCauseOfAction}
                onChange={(e) => handleCaseDetailChange('stateOfCauseOfAction', e.target.value)}
                className="bg-white font-medium"
              >
                <option value="">{isEn ? 'Select State' : 'राज्य चुनें'}</option>
                {statesList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="districtOfCauseOfAction" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'District of Cause of Action (Row 12)' : 'वाद कारण का जिला (पंक्ति 12)'}
              </Label>
              {causeOfActionDistricts.length > 0 ? (
                <Select
                  id="districtOfCauseOfAction"
                  value={cd.districtOfCauseOfAction}
                  onChange={(e) => handleCaseDetailChange('districtOfCauseOfAction', e.target.value)}
                  className="bg-white font-medium"
                >
                  <option value="">{isEn ? 'Select District' : 'जिला चुनें'}</option>
                  {causeOfActionDistricts.map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  id="districtOfCauseOfAction"
                  type="text"
                  value={cd.districtOfCauseOfAction}
                  onChange={(e) => handleCaseDetailChange('districtOfCauseOfAction', e.target.value)}
                  placeholder={isEn ? 'Enter District' : 'जिला दर्ज करें'}
                  className="bg-white"
                />
              )}
            </div>

            {/* Row 13: Delay & Condonation */}
            <div className="md:col-span-3 p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] pb-2.5">
                <div>
                  <Label className="block text-xs font-semibold text-[#111111]">
                    {isEn ? 'Delay in Filing (Row 13)' : 'दाखिल करने में विलंब (पंक्ति 13)'}
                  </Label>
                  <p className="text-[11px] text-[#666666]">
                    {isEn
                      ? 'If more than 2 years have elapsed, condonation of delay application under Section 69(2) is required.'
                      : '2 वर्ष से अधिक समय बीतने पर धारा 69(2) के तहत विलंब माफी का आवेदन आवश्यक होता है।'}
                  </p>
                </div>

                <div className="w-full sm:w-56 shrink-0">
                  <Select
                    value={cd.hasDelay || (cd.limitationDelay?.toLowerCase().includes('no delay') || cd.limitationDelay?.includes('कोई विलंब नहीं') ? 'No' : 'Yes')}
                    onChange={(e) => handleCaseDetailChange('hasDelay', e.target.value)}
                    className="font-medium bg-white"
                  >
                    <option value="No">{isEn ? 'No Delay (Within 2 Years)' : 'कोई विलंब नहीं (2 वर्ष के भीतर)'}</option>
                    <option value="Yes">{isEn ? 'Yes (Delay in Filing)' : 'हाँ (विलंब हुआ है)'}</option>
                  </Select>
                </div>
              </div>

              {cd.hasDelay === 'Yes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <Label htmlFor="delayDays" className="block text-xs font-medium text-[#222222] mb-1">
                      {isEn ? 'Number of Days of Delay' : 'विलंब के दिनों की संख्या'}
                    </Label>
                    <Input
                      id="delayDays"
                      type="text"
                      noTransliterate={true}
                      value={cd.delayDays || ''}
                      onChange={(e) => handleCaseDetailChange('delayDays', e.target.value)}
                      placeholder={isEn ? 'e.g. 45 Days' : 'जैसे: 45 दिन'}
                      className="bg-white font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="condonationAttached" className="block text-xs font-medium text-[#222222] mb-1">
                      {isEn ? 'Condonation Application (Row 14)' : 'विलंब माफी आवेदन (पंक्ति 14)'}
                    </Label>
                    <Select
                      id="condonationAttached"
                      value={cd.condonationApplicationAttached || 'Yes'}
                      onChange={(e) => handleCaseDetailChange('condonationApplicationAttached', e.target.value)}
                      className="bg-white"
                    >
                      <option value="Yes">{isEn ? 'Yes (Attached with Affidavit)' : 'हाँ (शपथ पत्र सहित संलग्न है)'}</option>
                      <option value="No">{isEn ? 'No' : 'नहीं'}</option>
                    </Select>
                  </div>
                </div>
              )}

              {cd.hasDelay !== 'Yes' && (
                <div>
                  <Label htmlFor="limitationDelay" className="block text-[11px] text-[#666666] mb-1">
                    {isEn ? 'Auto-generated limitation statement for Proforma:' : 'प्रपत्र हेतु स्वतः निर्मित परिसीमा कथन:'}
                  </Label>
                  <Input
                    id="limitationDelay"
                    type="text"
                    value={cd.limitationDelay}
                    onChange={(e) => handleCaseDetailChange('limitationDelay', e.target.value)}
                    className="bg-white text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Legal Proforma Declarations */}
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
              5
            </span>
            <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
              {isEn ? '5. Statutory Proforma Declarations (Rows 15–17)' : '5. औपचारिक विधिक घोषणाएं (Proforma Declarations — Rows 15–17)'}
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs text-[#666666]">
            {isEn ? 'Statutory declarations on Page 2 of the Court Proforma.' : 'न्यायालय प्रपत्र के पृष्ठ 2 पर सांविधिक घोषणाएं।'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="documentsAttestedTrueCopies" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'Are documents attested true copies? (Row 15)' : 'क्या दस्तावेज सत्यापित सत्य प्रतियां हैं? (पंक्ति 15)'}
              </Label>
              <Select
                id="documentsAttestedTrueCopies"
                value={cd.documentsAttestedTrueCopies || 'Yes'}
                onChange={(e) => handleCaseDetailChange('documentsAttestedTrueCopies', e.target.value)}
                className="bg-white font-medium"
              >
                <option value="Yes">{isEn ? 'Yes' : 'हाँ (Yes)'}</option>
                <option value="No">{isEn ? 'No' : 'नहीं (No)'}</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="englishTranslationsFiled" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'Are English translations filed? (Row 16)' : 'क्या अंग्रेजी अनुवाद संलग्न है? (पंक्ति 16)'}
              </Label>
              <Select
                id="englishTranslationsFiled"
                value={cd.englishTranslationsFiled || 'N/A'}
                onChange={(e) => handleCaseDetailChange('englishTranslationsFiled', e.target.value)}
                className="bg-white font-medium"
              >
                <option value="N/A">{isEn ? 'N/A' : 'लागू नहीं (N/A)'}</option>
                <option value="Yes">{isEn ? 'Yes' : 'हाँ (Yes)'}</option>
                <option value="No">{isEn ? 'No' : 'नहीं (No)'}</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="phoneEmailFiled" className="block text-xs font-medium text-[#222222] mb-1.5">
                {isEn ? 'Are phone & email provided? (Row 17)' : 'क्या फोन व ईमेल दर्ज है? (पंक्ति 17)'}
              </Label>
              <Select
                id="phoneEmailFiled"
                value={cd.phoneEmailFiled || 'Yes'}
                onChange={(e) => handleCaseDetailChange('phoneEmailFiled', e.target.value)}
                className="bg-white font-medium"
              >
                <option value="Yes">{isEn ? 'Yes' : 'हाँ (Yes)'}</option>
                <option value="No">{isEn ? 'No' : 'नहीं (No)'}</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Advocate Details */}
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
              6
            </span>
            <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
              {isEn ? "6. Complainant's Advocate Details" : "6. परिवादी के अधिवक्ता का विवरण (Complainant's Advocate)"}
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs text-[#666666]">
            {isEn
              ? 'Whether complaint is filed through an advocate / legal counsel or in person.'
              : 'यदि परिवाद अधिवक्ता के माध्यम से दाखिल किया जा रहा है अथवा व्यक्तिगत रूप से।'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="max-w-md">
            <Label htmlFor="hasAdvocate" className="block text-xs font-medium text-[#222222] mb-1.5">
              {isEn ? 'Is this complaint being filed through an advocate?' : 'क्या यह परिवाद अधिवक्ता के माध्यम से दाखिल किया जा रहा है?'}
            </Label>
            <Select
              id="hasAdvocate"
              value={cd.hasAdvocate || (cd.advocateName ? 'Yes' : 'No')}
              onChange={(e) => {
                const val = e.target.value;
                handleCaseDetailChange('hasAdvocate', val);
                if (val === 'No') {
                  handleCaseDetailChange('advocateName', '');
                  handleCaseDetailChange('advocatePhone', '');
                  handleCaseDetailChange('advocateAddress', '');
                }
              }}
              className="bg-white font-medium"
            >
              <option value="No">{isEn ? 'No (In Person by Complainant — without advocate)' : 'नहीं (व्यक्तिगत रूप से परिवादी द्वारा — बिना अधिवक्ता)'}</option>
              <option value="Yes">{isEn ? 'Yes (Through Advocate / Legal Counsel)' : 'हाँ (अधिवक्ता / लीगल कौंसिल के माध्यम से)'}</option>
            </Select>
          </div>

          {(cd.hasAdvocate === 'Yes' || (!cd.hasAdvocate && cd.advocateName)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#F0F0F0]">
              <div>
                <Label htmlFor="advocateName" className="block text-xs font-medium text-[#222222] mb-1.5">
                  {isEn ? 'Advocate Full Name' : 'अधिवक्ता का पूरा नाम'} <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="advocateName"
                  type="text"
                  value={cd.advocateName}
                  onChange={(e) => handleCaseDetailChange('advocateName', e.target.value)}
                  placeholder={isEn ? 'Enter Advocate Name' : 'अधिवक्ता का नाम दर्ज करें'}
                  className="bg-white"
                />
              </div>

              <div>
                <Label htmlFor="advocatePhone" className="block text-xs font-medium text-[#222222] mb-1.5">
                  {isEn ? 'Advocate Mobile / Phone Number' : 'अधिवक्ता का मोबाइल / संपर्क नंबर'}
                </Label>
                <Input
                  id="advocatePhone"
                  type="text"
                  noTransliterate={true}
                  value={cd.advocatePhone}
                  onChange={(e) => handleCaseDetailChange('advocatePhone', e.target.value)}
                  placeholder={isEn ? '10-digit mobile number' : '10 अंकों का मोबाइल नंबर'}
                  className="bg-white font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="advocateAddress" className="block text-xs font-medium text-[#222222] mb-1.5">
                  {isEn ? 'Advocate Chamber / Office Address' : 'अधिवक्ता का चैंबर / कार्यालय का पता'}
                </Label>
                <Input
                  id="advocateAddress"
                  type="text"
                  value={cd.advocateAddress}
                  onChange={(e) => handleCaseDetailChange('advocateAddress', e.target.value)}
                  placeholder={isEn ? 'Full Chamber / Office Address' : 'चैंबर / कार्यालय का पूरा पता'}
                  className="bg-white"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
