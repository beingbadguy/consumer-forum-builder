'use client';

import React, { useEffect } from 'react';
import { ComplaintFormData, FormStep } from '../../types/complaint';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { convertNumberToIndianWords } from '../../lib/numberToWords';
import { TRANSLATIONS } from '../../lib/translations';

interface StepProps {
  data: ComplaintFormData;
  updateData: React.Dispatch<React.SetStateAction<ComplaintFormData>>;
  errors: Record<string, string>;
  onNavigateStep?: (step: FormStep) => void;
}

/**
 * Builds the standard 4-clause court prayer narrative matching statutory
 * consumer complaint provisions under CPA 2019 in English or Hindi format.
 */
export function buildStandardPrayerNarrative(data: ComplaintFormData): string {
  const isEn = data.language === 'en';
  const cd = data.caseDetails;
  const primaryClaim = cd.claimedAmount || cd.valueOfGoods || '25,00,000';
  const primaryWords =
    cd.claimedAmountWords || (primaryClaim && primaryClaim !== '0' ? convertNumberToIndianWords(primaryClaim) : '');
  const interestRate = cd.interestRate || '12';
  const interestDate =
    cd.interestFromDate || cd.dateOfCauseOfAction || (isEn ? 'filing of this complaint' : 'वाद कारण की तिथि / परिवाद दाखिल करने की तिथि');

  const compensation = cd.considerationAmount || cd.compensationAmount || '4,50,000';
  const compensationWords = compensation ? convertNumberToIndianWords(compensation) : '';

  const litigation = cd.litigationAmount || '50,000';
  const litigationWords = litigation ? convertNumberToIndianWords(litigation) : '';

  if (isEn) {
    const clause1 = `(i) Direct the Opposite Parties, jointly and severally, to pay to the Complainant the claimed / refund amount of Rs. ${primaryClaim}/- ${
      primaryWords ? `(Rupees ${primaryWords} only)` : ''
    }, together with interest @ ${interestRate}% per annum from ${interestDate} till the date of actual realization.`;

    const clause2 = `(ii) Direct the Opposite Parties, jointly and severally, to pay a sum of Rs. ${
      compensation || '__________'
    }/- ${
      compensationWords ? `(Rupees ${compensationWords} only)` : ''
    } to the Complainant as compensation towards acute mental agony, physical harassment and financial hardship suffered due to deficiency in service and unfair trade practices.`;

    const clause3 = `(iii) Direct the Opposite Parties to pay a sum of Rs. ${
      litigation || '__________'
    }/- ${
      litigationWords ? `(Rupees ${litigationWords} only)` : ''
    } towards litigation expenses and legal costs incurred by the Complainant.`;

    const clause4 = `(iv) Pass any other or further order(s), direction(s) or relief(s) as this Hon'ble Commission may deem fit and proper in the interest of justice.`;

    return `${clause1}\n\n${clause2}\n\n${clause3}\n\n${clause4}`;
  }

  const clause1 = `(i) यह कि विपक्षीगण को संयुक्त एवं पृथक रूप से निर्देश दिया जाए कि वे परिवादी को दावाकृत / धन वापसी राशि रु. ${primaryClaim}/- ${
    primaryWords ? `(अक्षरे ${primaryWords} रुपये मात्र)` : ''
  }, ब्याज सहित @ ${interestRate}% प्रति वर्ष की दर से ${interestDate} से वास्तविक भुगतान होने तक अदा करें।`;

  const clause2 = `(ii) यह कि विपक्षीगण को परिवादी को सेवा में गंभीर कमी एवं अनुचित व्यापार व्यवहार के कारण हुई भारी मानसिक संताप, शारीरिक प्रताड़ना एवं आर्थिक क्षति के हर्जाने / मुआवजे के रूप में रु. ${
    compensation || '__________'
  }/- ${
    compensationWords ? `(अक्षरे ${compensationWords} रुपये मात्र)` : ''
  } का भुगतान ब्याज सहित @ ${interestRate}% प्रति वर्ष की दर से वास्तविक भुगतान तक करने का आदेश दिया जाए।`;

  const clause3 = `(iii) यह कि विपक्षीगण को परिवादी द्वारा परिवाद दाखिल करने में हुए वाद व्यय एवं कानूनी खर्च हेतु रु. ${
    litigation || '__________'
  }/- ${
    litigationWords ? `(अक्षरे ${litigationWords} रुपये मात्र)` : ''
  } अदा करने का निर्देश दिया जाए।`;

  const clause4 = `(iv) यह कि अन्य कोई भी अनुतोष, आदेश अथवा निर्देश जो माननीय आयोग मामले के तथ्यों एवं परिस्थितियों के आलोक में उचित एवं न्यायसंगत समझे, परिवादी के पक्ष में पारित करने की कृपा की जाए।`;

  return `${clause1}\n\n${clause2}\n\n${clause3}\n\n${clause4}`;
}

export const Step5Prayer: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
  onNavigateStep,
}) => {
  const lang = data.language || 'hi';
  const isEn = lang === 'en';
  const t = TRANSLATIONS[lang].step5;
  const cd = data.caseDetails;

  // Auto-sync prayer narrative and prayerClaims on mount if empty or not synchronized
  useEffect(() => {
    updateData((prev) => {
      let changed = false;
      let nextPrayer = prev.prayer;
      const nextClaims = { ...(prev.prayerClaims || {}) };

      // Prefill narrative if empty
      if (!nextPrayer || !nextPrayer.trim()) {
        nextPrayer = buildStandardPrayerNarrative(prev);
        changed = true;
      }

      // Sync prayer claims with Step 1 caseDetails breakdown
      const claimAmt = cd.claimedAmount || cd.valueOfGoods || '';
      const compAmt = cd.considerationAmount || cd.compensationAmount || '';
      const litAmt = cd.litigationAmount || '';
      const intRate = cd.interestRate || '12';
      const intDate = cd.interestFromDate || cd.dateOfCauseOfAction || '';

      if (nextClaims.claimAmount !== claimAmt) {
        nextClaims.claimAmount = claimAmt;
        nextClaims.claimAmountWords = cd.claimedAmountWords || convertNumberToIndianWords(claimAmt);
        changed = true;
      }
      if (nextClaims.compensationAmount !== compAmt) {
        nextClaims.compensationAmount = compAmt;
        nextClaims.compensationAmountWords = convertNumberToIndianWords(compAmt);
        changed = true;
      }
      if (nextClaims.litigationCosts !== litAmt) {
        nextClaims.litigationCosts = litAmt;
        nextClaims.litigationCostsWords = convertNumberToIndianWords(litAmt);
        changed = true;
      }
      if (nextClaims.interestRate !== intRate) {
        nextClaims.interestRate = intRate;
        changed = true;
      }
      if (nextClaims.interestFromDate !== intDate) {
        nextClaims.interestFromDate = intDate;
        changed = true;
      }
      if (nextClaims.policyNo) {
        delete nextClaims.policyNo;
        changed = true;
      }

      if (changed) {
        return {
          ...prev,
          prayer: nextPrayer,
          prayerClaims: nextClaims,
        };
      }
      return prev;
    });
  }, [
    cd.claimedAmount,
    cd.claimedAmountWords,
    cd.valueOfGoods,
    cd.considerationAmount,
    cd.compensationAmount,
    cd.litigationAmount,
    cd.interestRate,
    cd.interestFromDate,
    cd.dateOfCauseOfAction,
    updateData,
  ]);

  const handlePrayerChange = (val: string) => {
    updateData((prev) => ({
      ...prev,
      prayer: val,
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
              5
            </span>
            <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
              {t.title}
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs text-[#666666]">
            {t.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          {errors.prayer && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {errors.prayer}
            </div>
          )}

          {/* Navigation banner indicating fields are prefilled from Step 1 */}
          <div className="p-3.5 sm:p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#111111]">
            <div className="flex items-start gap-2.5">
              <span className="text-[#111111] text-sm shrink-0 mt-0.5">ⓘ</span>
              <div>
                <p className="text-xs font-semibold text-[#111111]">
                  {isEn ? 'Prefilled Claim & Valuation Amounts' : 'स्वतः भरित दावा एवं मूल्यांकन राशियां'}
                </p>
                <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">
                  {t.bannerInfo}
                </p>
              </div>
            </div>
            {onNavigateStep && (
              <button
                type="button"
                onClick={() => onNavigateStep(1)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#111111] bg-white hover:bg-[#F5F5F5] px-3 py-1.5 rounded-lg border border-[#E5E5E5] self-start sm:self-auto shrink-0 transition-colors shadow-none"
              >
                {t.goToStep1}
              </button>
            )}
          </div>

          {/* Read-Only Prefilled Breakdown matching Step 1 */}
          <div className="p-4 sm:p-5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl space-y-3.5">
            <div className="border-b border-[#E5E5E5] pb-2">
              <h4 className="text-xs font-semibold text-[#111111]">
                {isEn ? 'Pecuniary Valuation Breakdown (Linked with Step 1)' : 'आर्थिक मूल्यांकन विवरण (चरण 1 से लिंक)'}
              </h4>
            </div>

            {/* Row 1: 3 Breakdown Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="prayerValueOfGoods" className="text-xs font-medium text-[#222222]">
                    {isEn ? 'Value of Goods (₹)' : 'माल / सेवा का मूल्य (₹)'}
                  </Label>
                  <span className="text-[10px] text-[#444444] font-medium bg-[#EFEFEF] px-1.5 py-0.5 rounded">
                    {isEn ? 'Auto-filled' : 'स्वतः भरित'}
                  </span>
                </div>
                <Input
                  id="prayerValueOfGoods"
                  type="text"
                  value={cd.valueOfGoods || ''}
                  disabled
                  readOnly
                  placeholder={isEn ? 'e.g. 20,00,000' : 'जैसे: 20,00,000'}
                  className="bg-[#F5F5F5] text-[#111111] cursor-not-allowed border-[#E5E5E5] select-none font-medium h-9 text-xs"
                />
                <p className="text-[10px] text-[#666666] mt-1 leading-tight">
                  {isEn ? 'Insurance Sum Assured, Disputed Amount, or Value of Goods Purchased.' : 'बीमा सम एश्योर्ड राशि, विवादित राशि अथवा क्रय मूल्य।'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="prayerConsiderationAmount" className="text-xs font-medium text-[#222222]">
                    {isEn ? 'Consideration Amount (₹)' : 'प्रतिफल राशि (Consideration) (₹)'}
                  </Label>
                  <span className="text-[10px] text-[#444444] font-medium bg-[#EFEFEF] px-1.5 py-0.5 rounded">
                    {isEn ? 'Auto-filled' : 'स्वतः भरित'}
                  </span>
                </div>
                <Input
                  id="prayerConsiderationAmount"
                  type="text"
                  value={cd.considerationAmount || cd.compensationAmount || ''}
                  disabled
                  readOnly
                  placeholder={isEn ? 'e.g. 4,50,000' : 'जैसे: 4,50,000'}
                  className="bg-[#F5F5F5] text-[#111111] cursor-not-allowed border-[#E5E5E5] select-none font-medium h-9 text-xs"
                />
                <p className="text-[10px] text-[#666666] mt-1 leading-tight">
                  {isEn ? 'Amount paid or payable for goods/services / compensation.' : 'सामान/सेवा हेतु भुगतान की गई या देय राशि / क्षतिपूर्ति।'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="prayerLitigationAmount" className="text-xs font-medium text-[#222222]">
                    {isEn ? 'Litigation Amount (₹)' : 'मुकदमेबाजी खर्च (Litigation) (₹)'}
                  </Label>
                  <span className="text-[10px] text-[#444444] font-medium bg-[#EFEFEF] px-1.5 py-0.5 rounded">
                    {isEn ? 'Auto-filled' : 'स्वतः भरित'}
                  </span>
                </div>
                <Input
                  id="prayerLitigationAmount"
                  type="text"
                  value={cd.litigationAmount || ''}
                  disabled
                  readOnly
                  placeholder={isEn ? 'e.g. 50,000' : 'जैसे: 50,000'}
                  className="bg-[#F5F5F5] text-[#111111] cursor-not-allowed border-[#E5E5E5] select-none font-medium h-9 text-xs"
                />
                <p className="text-[10px] text-[#666666] mt-1 leading-tight">
                  {isEn ? 'Expenses incurred in legal notice and proceedings.' : 'मुकदमेबाजी, नोटिस एवं कानूनी कार्रवाई में हुआ खर्च।'}
                </p>
              </div>
            </div>

            {/* Row 2: Total Claimed Amount & Interest */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-3.5 border-t border-[#E5E5E5]">
              <div>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <Label htmlFor="prayerClaimedAmount" className="text-xs font-semibold text-[#111111]">
                    {isEn ? 'Total Claimed Amount (₹)' : 'कुल दावा राशि (₹)'} <span className="text-red-600">*</span>
                  </Label>
                  <span className="text-[10px] text-[#666666] font-medium">
                    {isEn ? 'Combined Total' : 'संयुक्त कुल योग'}
                  </span>
                </div>
                <Input
                  id="prayerClaimedAmount"
                  type="text"
                  value={cd.claimedAmount || ''}
                  disabled
                  readOnly
                  placeholder={isEn ? 'Total Claimed Amount' : 'कुल दावा राशि'}
                  className="bg-[#F5F5F5] text-[#111111] cursor-not-allowed border-[#E5E5E5] select-none font-semibold h-9.5 text-xs text-base sm:text-sm"
                />
                {cd.claimedAmountWords && (
                  <p className="text-[11px] text-[#666666] mt-1 font-mono">
                    ({isEn ? 'Rupees ' : 'अक्षरे '}{cd.claimedAmountWords}{isEn ? ' only' : ' रुपये मात्र'})
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="prayerInterestRate" className="text-xs font-medium text-[#222222]">
                    {isEn ? 'Interest Claimed (% p.a.)' : 'दावाकृत ब्याज दर (% प्रति वर्ष)'}
                  </Label>
                  <span className="text-[10px] text-[#444444] font-medium bg-[#EFEFEF] px-1.5 py-0.5 rounded">
                    {isEn ? 'Auto-filled' : 'स्वतः भरित'}
                  </span>
                </div>
                <Input
                  id="prayerInterestRate"
                  type="text"
                  value={cd.interestRate || '12'}
                  disabled
                  readOnly
                  placeholder="12"
                  className="bg-[#F5F5F5] text-[#111111] cursor-not-allowed border-[#E5E5E5] select-none font-medium h-9.5 text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="prayerInterestFromDate" className="text-xs font-medium text-[#222222]">
                    {isEn ? 'Interest From Date' : 'ब्याज आरंभ तिथि'}
                  </Label>
                  <span className="text-[10px] text-[#444444] font-medium bg-[#EFEFEF] px-1.5 py-0.5 rounded">
                    {isEn ? 'Auto-filled' : 'स्वतः भरित'}
                  </span>
                </div>
                <Input
                  id="prayerInterestFromDate"
                  type="text"
                  value={cd.interestFromDate || cd.dateOfCauseOfAction || (isEn ? 'Date of Filing' : 'दाखिल करने की तिथि')}
                  disabled
                  readOnly
                  placeholder={isEn ? 'Interest From Date' : 'ब्याज आरंभ तिथि'}
                  className="bg-[#F5F5F5] text-[#111111] cursor-not-allowed border-[#E5E5E5] select-none font-medium h-9.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Customer Prayer Narrative Textarea (NO Reset button as requested) */}
          <div className="pt-2 space-y-2">
            <div>
              <Label htmlFor="customPrayerText" className="block text-xs font-semibold text-[#111111]">
                {t.narrativeLabel}
              </Label>
              <p className="text-[11px] text-[#666666]">
                {t.narrativeSub}
              </p>
            </div>
            <Textarea
              id="customPrayerText"
              rows={11}
              value={data.prayer}
              onChange={(e) => handlePrayerChange(e.target.value)}
              placeholder={isEn ? 'Enter your prayer clauses here...' : 'प्रार्थना खंड यहाँ लिखें या संपादित करें...'}
              className="text-xs sm:text-sm font-sans leading-relaxed bg-white border-[#E5E5E5] focus-visible:border-[#111111] p-4"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
