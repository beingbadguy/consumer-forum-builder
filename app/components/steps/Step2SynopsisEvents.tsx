'use client';

import React from 'react';
import { ComplaintFormData, EventEntry } from '../../types/complaint';

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
    <div className="space-y-6">
      {/* Date of Events Card (Matches Page 3 of PDF) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                1
              </span>
              Chronological List of Dates and Events
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Renders the tabular &ldquo;Date of Events&rdquo; section on Page 3 of the court document.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddEvent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add More Events
          </button>
        </div>

        {errors.events && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errors.events}
          </div>
        )}

        <div className="space-y-3">
          {data.events.map((event, index) => (
            <div
              key={index}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-3 transition-colors hover:border-slate-300"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </div>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={event.description}
                  onChange={(e) => handleEventChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                  placeholder="e.g. Policy commencement date / Purchase date / Date claim repudiated"
                />
              </div>

              <div className="w-full md:w-48 shrink-0">
                <input
                  type="text"
                  value={event.date}
                  onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white font-mono"
                  placeholder="DD/MM/YYYY or Date"
                />
              </div>

              {data.events.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEvent(index)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                  title="Remove Event"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-500 bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex items-start gap-2">
          <span className="text-amber-600">💡</span>
          <span>
            Include key dates: Contract/Policy commencement, payment dates, date defect/damage occurred, legal notice date, and repudiation/refusal date.
          </span>
        </div>
      </div>
    </div>
  );
};
