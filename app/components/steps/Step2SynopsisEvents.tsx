'use client';

import React from 'react';
import { ComplaintFormData, EventEntry } from '../../types/complaint';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { TRANSLATIONS } from '../../lib/translations';
import { Icons } from '../ui/Icons';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step2SynopsisEvents: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const isEn = data.language === 'en';
  const t = TRANSLATIONS[data.language || 'hi'].step2;

  const handleEventChange = (index: number, field: keyof EventEntry, value: string) => {
    updateData((prev) => {
      const nextEvents = [...prev.events];
      nextEvents[index] = { ...nextEvents[index], [field]: value };
      return { ...prev, events: nextEvents };
    });
  };

  const handleAddEvent = () => {
    updateData((prev) => ({
      ...prev,
      events: [...prev.events, { date: '', description: '' }],
    }));
  };

  const handleRemoveEvent = (index: number) => {
    if (data.events.length <= 1) return;
    updateData((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-5">
      {/* Date of Events Card (Matches Page 3 of PDF) */}
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F0F0] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
                2
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
            onClick={handleAddEvent}
            className="shrink-0 self-start sm:self-auto text-xs font-medium bg-white hover:bg-[#F5F5F5] border-[#E5E5E5] text-[#111111] shadow-none"
          >
            <Icons.Plus size={14} className="text-[#111111] mr-1.5" />
            <span>{t.addRow}</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {errors.events && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {errors.events}
            </div>
          )}

          <div className="space-y-3">
            {data.events.map((ev, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2.5 p-3.5 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] transition-all"
              >
                <div className="w-full sm:w-48 shrink-0">
                  <label className="block text-[11px] font-medium text-[#222222] mb-1">
                    {t.date} #{idx + 1}
                  </label>
                  <DatePicker
                    value={ev.date}
                    onChange={(val) => handleEventChange(idx, 'date', val)}
                    placeholder={t.datePlaceholder}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-medium text-[#222222] mb-1">
                    {t.eventDesc}
                  </label>
                  <Input
                    type="text"
                    value={ev.description}
                    onChange={(e) => handleEventChange(idx, 'description', e.target.value)}
                    placeholder={t.descPlaceholder}
                    className="bg-white text-xs sm:text-sm"
                  />
                </div>

                {data.events.length > 1 && (
                  <div className="sm:self-end pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(idx)}
                      className="inline-flex items-center justify-center h-10 px-2.5 rounded-lg text-xs font-medium text-[#666666] hover:text-[#111111] hover:bg-[#EAEAEA] border border-transparent transition-colors"
                      title={t.removeRow}
                    >
                      <Icons.Trash size={15} className="mr-1 text-[#666666]" />
                      <span className="sm:hidden">{t.removeRow}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#666666] mt-2">
            {isEn
              ? 'Tip: Add chronological milestones such as policy purchase date, payment date, cause of action date, and repudiation/legal notice date.'
              : 'सुझाव: पॉलिसी/सामान क्रय तिथि, भुगतान तिथि, वाद कारण तिथि तथा लीगल नोटिस/दावा निरस्तीकरण की तिथियां अवश्य जोड़ें।'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
