'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { TRANSLATIONS } from '../../lib/translations';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step7Affidavit: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const isEn = data.language === 'en';
  const t = TRANSLATIONS[data.language || 'hi'].step7;
  const primaryComp = data.complainants[0] || { name: '' };

  const handleFieldChange = (field: keyof ComplaintFormData, value: string) => {
    updateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="border-b border-[#F0F0F0] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
              7
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
          {errors.affidavit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {errors.affidavit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deponentName" className="block text-xs font-medium text-[#222222] mb-1.5">
                {t.deponent} <span className="text-[#888888] font-normal">({isEn ? 'Primary Complainant' : 'मुख्य परिवादी'})</span>
              </Label>
              <Input
                id="deponentName"
                type="text"
                readOnly
                value={primaryComp.name || (isEn ? 'Complainant Name' : 'परिवादी का नाम')}
                className="bg-[#F5F5F5] text-[#111111] cursor-not-allowed border-[#E5E5E5] font-medium text-xs h-9"
              />
            </div>

            <div>
              <Label htmlFor="affidavitDate" className="block text-xs font-medium text-[#222222] mb-1.5">
                {t.date}
              </Label>
              <DatePicker
                id="affidavitDate"
                value={data.affidavitDate || ''}
                onChange={(val) => handleFieldChange('affidavitDate', val)}
                placeholder={isEn ? 'Select date (DD/MM/YYYY)' : 'दिनांक चुनें (DD/MM/YYYY)'}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="affidavitClauses" className="block text-xs font-medium text-[#222222] mb-1.5">
              {isEn ? 'Numbered Sworn Affirmation Paragraphs' : 'सशपथ कथन के बिंदुवार पैराग्राफ (Numbered Affirmation Paragraphs)'} <span className="text-red-600">*</span>
            </Label>
            <p className="text-[11px] text-[#666666] mb-2">
              {isEn ? 'Standard 5 statutory affidavit clauses under Rule 14:' : 'मानक 5 कानूनी शपथ बिंदु जो न्यायालय में प्रस्तुत किए जाते हैं:'}
            </p>
            <Textarea
              id="affidavitClauses"
              rows={9}
              value={data.affidavit}
              onChange={(e) => handleFieldChange('affidavit', e.target.value)}
              className={`font-sans leading-relaxed text-xs sm:text-sm p-4 bg-white border-[#E5E5E5] focus-visible:border-[#111111] ${
                errors.affidavit ? 'border-red-500 bg-red-50/20' : ''
              }`}
            />
          </div>

          <div className="p-3.5 sm:p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5] text-xs text-[#666666] flex items-start gap-2.5">
            <span className="text-[#111111] text-sm shrink-0 mt-0.5">ⓘ</span>
            <div>
              <span className="font-semibold text-[#111111] block mb-0.5">
                {isEn ? 'Notary / Oath Commissioner Verification Space:' : 'नोटरी / ओथ कमिश्नर सत्यापन स्थान:'}
              </span>
              <p>
                {isEn
                  ? 'Space for Deponent signature, Advocate identification, and Notary seal/stamp is automatically provided on Page 9.'
                  : 'न्यायालय प्रारूप के पृष्ठ 9 पर शपथकर्ता के हस्ताक्षर, पहचानकर्ता अधिवक्ता के हस्ताक्षर एवं नोटरी की मोहर हेतु स्थान स्वतः सुरक्षित रूप से बनाया गया है।'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
