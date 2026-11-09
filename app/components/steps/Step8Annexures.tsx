'use client';

import React from 'react';
import { ComplaintFormData } from '../../types/complaint';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TRANSLATIONS } from '../../lib/translations';
import { Icons } from '../ui/Icons';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step8Annexures: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const isEn = data.language === 'en';
  const t = TRANSLATIONS[data.language || 'hi'].step8;

  const handleAnnexureChange = (index: number, title: string) => {
    updateData((prev) => {
      const nextAnnexures = [...prev.annexures];
      nextAnnexures[index] = {
        ...nextAnnexures[index],
        annexureNo: isEn ? `Annexure-${index + 1}` : `संलग्नक-${index + 1}`,
        title,
      };
      return { ...prev, annexures: nextAnnexures };
    });
  };

  const handlePageCountChange = (index: number, countStr: string) => {
    updateData((prev) => {
      const nextAnnexures = [...prev.annexures];
      nextAnnexures[index] = {
        ...nextAnnexures[index],
        pageCount: Math.max(1, parseInt(countStr, 10) || 1),
      };
      return { ...prev, annexures: nextAnnexures };
    });
  };

  const handleAddAnnexure = () => {
    updateData((prev) => ({
      ...prev,
      annexures: [
        ...prev.annexures,
        {
          annexureNo: isEn ? `Annexure-${prev.annexures.length + 1}` : `संलग्नक-${prev.annexures.length + 1}`,
          title: '',
          pageCount: 1,
        },
      ],
    }));
  };

  const handleRemoveAnnexure = (index: number) => {
    if (data.annexures.length <= 1) return;
    updateData((prev) => {
      const filtered = prev.annexures.filter((_, i) => i !== index);
      // Re-index Annexure numbers
      const reindexed = filtered.map((ann, i) => ({
        ...ann,
        annexureNo: isEn ? `Annexure-${i + 1}` : `संलग्नक-${i + 1}`,
      }));
      return { ...prev, annexures: reindexed };
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F0F0] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
                8
              </span>
              <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
                {t.title}
              </CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs text-[#666666]">
              {t.description}
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAnnexure}
            className="shrink-0 self-start sm:self-auto text-xs font-medium bg-white hover:bg-[#F5F5F5] border-[#E5E5E5] text-[#111111] shadow-none"
          >
            <Icons.Plus size={14} className="text-[#111111] mr-1.5" />
            <span>{t.addAnnexure}</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {errors.annexures && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {errors.annexures}
            </div>
          )}

          <div className="space-y-2.5">
            {data.annexures.map((ann, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 sm:p-3.5 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] transition-all"
              >
                <div className="w-full sm:w-28 shrink-0 flex items-center justify-between sm:justify-start">
                  <span className="text-xs font-semibold text-[#111111] bg-white px-2.5 py-1 rounded-md border border-[#E5E5E5]">
                    {ann.annexureNo || (isEn ? `Annexure-${idx + 1}` : `संलग्नक-${idx + 1}`)}:
                  </span>
                  {data.annexures.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAnnexure(idx)}
                      className="sm:hidden text-xs text-[#666666] hover:text-[#111111] p-1 rounded hover:bg-[#EAEAEA]"
                      title={t.removeAnnexure}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Input
                    type="text"
                    value={ann.title}
                    onChange={(e) => handleAnnexureChange(idx, e.target.value)}
                    placeholder={
                      isEn
                        ? `e.g. Copy of receipt, policy schedule, legal notice or tax invoice #${idx + 1}`
                        : `जैसे: पॉलिसी बॉन्ड, बैंक विवरण, रसीद, अथवा कानूनी नोटिस #${idx + 1}`
                    }
                    className="bg-white text-xs sm:text-sm font-medium"
                  />
                </div>

                {/* Optional Page Count for Dynamic Court Index calculation */}
                <div className="w-full sm:w-32 shrink-0 flex items-center gap-1.5">
                  <span className="text-[11px] text-[#666666] whitespace-nowrap hidden sm:inline">
                    {isEn ? 'Pages:' : 'पृष्ठ:'}
                  </span>
                  <Select
                    value={String(ann.pageCount || 1)}
                    onChange={(e) => handlePageCountChange(idx, e.target.value)}
                    className="h-9 text-xs bg-white border-[#E5E5E5] font-medium"
                    title={isEn ? 'Number of pages for this annexure' : 'इस संलग्नक के पृष्ठों की संख्या'}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30].map((p) => (
                      <option key={p} value={p}>
                        {p} {isEn ? (p === 1 ? 'Page' : 'Pages') : 'पृष्ठ'}
                      </option>
                    ))}
                  </Select>
                </div>

                {data.annexures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAnnexure(idx)}
                    className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#888888] hover:text-[#111111] hover:bg-[#EAEAEA] transition-colors shrink-0"
                    title={t.removeAnnexure}
                  >
                    <Icons.Trash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Witnesses in Favour of the Complainant */}
          <div className="mt-6 p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl space-y-2">
            <h4 className="text-xs font-semibold text-[#111111]">
              {t.witnessHeader}
            </h4>
            <div className="pl-3 space-y-1.5 text-xs text-[#444444]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111]"></span>
                <span>{t.complainantWitness}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111]"></span>
                <span>{t.independentWitness}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
