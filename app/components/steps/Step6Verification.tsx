'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { TRANSLATIONS } from '../../lib/translations';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step6Verification: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const isEn = data.language === 'en';
  const t = TRANSLATIONS[data.language || 'hi'].step6;
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
              6
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="verificationPlace" className="block text-xs font-medium text-[#222222] mb-1.5">
                {t.place} <span className="text-red-600">*</span>
              </Label>
              <Input
                id="verificationPlace"
                type="text"
                value={data.verificationPlace}
                onChange={(e) => handleFieldChange('verificationPlace', e.target.value)}
                className={errors.verificationPlace ? 'border-red-500 bg-red-50/20' : 'bg-white'}
                placeholder={isEn ? 'e.g. Patna / New Delhi / Mumbai' : 'जैसे: पटना / नई दिल्ली / लखनऊ'}
              />
              {errors.verificationPlace && (
                <p className="text-xs text-red-600 mt-1">{errors.verificationPlace}</p>
              )}
            </div>

            <div>
              <Label htmlFor="verificationDate" className="block text-xs font-medium text-[#222222] mb-1.5">
                {t.date}
              </Label>
              <DatePicker
                id="verificationDate"
                value={data.verificationDate || ''}
                onChange={(val) => handleFieldChange('verificationDate', val)}
                placeholder={isEn ? 'Select date (DD/MM/YYYY)' : 'दिनांक चुनें (DD/MM/YYYY)'}
              />
            </div>
          </div>

          {/* Verification Preview Box */}
          <div className="p-4 sm:p-5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl space-y-2.5 text-xs text-[#444444]">
            <div className="font-semibold text-[#111111] text-xs">
              {isEn ? 'Standard Court Verification Affirmation:' : 'मानक न्यायालय सत्यापन प्रारूप:'}
            </div>
            <p className="font-serif text-xs sm:text-sm text-[#222222] leading-relaxed bg-white p-3.5 rounded-lg border border-[#E5E5E5]">
              {isEn ? (
                <>
                  &ldquo;I, <strong>{primaryComp.name || 'Complainant Name'}</strong>, the above-named complainant, do hereby verify that the statements made in paragraphs 1 to 6 of the accompanying complaint are true and correct to my personal knowledge, information and belief and the records of the case, and that nothing material has been concealed or suppressed therefrom.&rdquo;
                </>
              ) : (
                <>
                  &ldquo;मैं, <strong>{primaryComp.name || 'परिवादी का नाम'}</strong>, उपरोक्त नामित परिवादी, सत्यनिष्ठापूर्वक सत्यापित करता/करती हूँ कि संलग्न परिवाद पत्र में वर्णित समस्त तथ्य मेरे निजी ज्ञान, विश्वास एवं अभिलेखों के अनुसार सत्य व सही हैं तथा इसमें कोई भी सारवान तथ्य छिपाया अथवा दबाया नहीं गया है।&rdquo;
                </>
              )}
            </p>
            <div className="pt-2 text-[11px] text-[#666666] flex items-center gap-1.5">
              <span>✍️</span>
              <span>
                {isEn
                  ? 'Signatures of the Complainant and Counsel will be automatically formatted on Page 8 of the court proforma.'
                  : 'हस्ताक्षर: परिवादी एवं अधिवक्ता के हस्ताक्षर न्यायालय प्रारूप के पृष्ठ 8 पर नीचे दाईं ओर स्वतः मुद्रित होंगे।'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
