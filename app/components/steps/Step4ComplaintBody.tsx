'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TRANSLATIONS } from '../../lib/translations';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step4ComplaintBody: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const isEn = data.language === 'en';
  const t = TRANSLATIONS[data.language || 'hi'].step4;

  const handleBodyChange = (value: string) => {
    updateData((prev) => ({
      ...prev,
      complaintBody: value,
    }));
  };

  const handlePetitionPageCountChange = (value: string) => {
    updateData((prev) => ({
      ...prev,
      caseDetails: {
        ...prev.caseDetails,
        petitionPageCount: Math.max(1, parseInt(value, 10) || 4),
      },
    }));
  };

  const handleMakeBlank = () => {
    handleBodyChange('');
  };

  return (
    <div className="space-y-5">
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F0F0] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
                4
              </span>
              <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
                {t.title}
              </CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs text-[#666666]">
              {t.description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#FAFAFA] px-2.5 py-1 rounded-md border border-[#E5E5E5]">
              <label htmlFor="petitionPageCount" className="text-xs font-medium text-[#444444] whitespace-nowrap">
                {isEn ? 'Pages in Index:' : 'अनुक्रमणिका हेतु पृष्ठ:'}
              </label>
              <div className="w-32">
                <Select
                  id="petitionPageCount"
                  value={String(data.caseDetails.petitionPageCount || 4)}
                  onChange={(e) => handlePetitionPageCountChange(e.target.value)}
                  className="h-7 text-xs font-medium bg-white border-[#E5E5E5]"
                  title={isEn ? 'Total pages for complaint petition in Index table' : 'अनुक्रमणिका तालिका में परिवाद पत्र के कुल अनुमानित पृष्ठ'}
                >
                  <option value="2">{isEn ? '2 Pages' : '2 पृष्ठ'}</option>
                  <option value="3">{isEn ? '3 Pages' : '3 पृष्ठ'}</option>
                  <option value="4">{isEn ? '4 Pages (Std)' : '4 पृष्ठ (मानक)'}</option>
                  <option value="5">{isEn ? '5 Pages' : '5 पृष्ठ'}</option>
                  <option value="6">{isEn ? '6 Pages' : '6 पृष्ठ'}</option>
                  <option value="7">{isEn ? '7 Pages' : '7 पृष्ठ'}</option>
                  <option value="8">{isEn ? '8 Pages' : '8 पृष्ठ'}</option>
                  <option value="10">{isEn ? '10 Pages' : '10 पृष्ठ'}</option>
                  <option value="12">{isEn ? '12 Pages' : '12 पृष्ठ'}</option>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleMakeBlank}
              className="text-xs h-7.5 border-[#E5E5E5] text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F5]"
              title={isEn ? 'Clear text' : 'टेक्स्ट साफ करें'}
            >
              <span>{isEn ? 'Clear Text' : 'टेक्स्ट साफ करें'}</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {errors.complaintBody && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {errors.complaintBody}
            </div>
          )}

          <div>
            <Label htmlFor="complaintBody" className="block text-xs font-medium text-[#222222] mb-1.5">
              {t.bodyLabel} <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="complaintBody"
              rows={14}
              value={data.complaintBody}
              onChange={(e) => handleBodyChange(e.target.value)}
              placeholder={t.bodyPlaceholder}
              className={`text-xs sm:text-sm font-sans leading-relaxed bg-white border-[#E5E5E5] focus-visible:border-[#111111] p-4 ${
                errors.complaintBody ? 'border-red-500 bg-red-50/20' : ''
              }`}
            />
            <p className="text-[11px] text-[#666666] mt-1.5">
              {isEn
                ? 'Tip: Separate paragraphs by pressing Enter twice. Each block formats into an indented paragraph in the PDF.'
                : 'सुझाव: प्रत्येक पैराग्राफ को दो बार Enter दबाकर अलग करें। पीडीएफ में प्रत्येक प्रस्तर स्वतः क्रमबद्ध प्रदर्शित होगा।'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
