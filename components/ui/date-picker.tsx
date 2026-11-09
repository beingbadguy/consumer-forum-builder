'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LuCalendar, LuChevronLeft, LuChevronRight } from 'react-icons/lu';

export interface DatePickerProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Helper to parse dates in DD/MM/YYYY or YYYY-MM-DD format
function parseDateString(str?: string): Date | null {
  if (!str || !str.trim()) return null;
  const trimmed = str.trim();

  // Try DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    if (!isNaN(date.getTime()) && date.getDate() === d) return date;
  }

  // Try YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (!isNaN(date.getTime()) && date.getDate() === d) return date;
  }

  // Fallback to standard parse
  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Helper to format Date as DD/MM/YYYY
function formatDateToDDMMYYYY(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  value = '',
  onChange,
  placeholder = 'DD/MM/YYYY',
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseDateString(value);
  const today = new Date();

  // Current view month & year
  const [viewYear, setViewYear] = useState<number>(() => {
    return selectedDate ? selectedDate.getFullYear() : today.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState<number>(() => {
    return selectedDate ? selectedDate.getMonth() : today.getMonth();
  });

  // When value changes from outside, sync view if valid
  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Navigate months
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Day selection
  const handleSelectDay = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    onChange(formatDateToDDMMYYYY(newDate));
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    onChange(formatDateToDDMMYYYY(today));
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  // Days matrix generation
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Year options: from 1990 to currentYear + 5
  const currentYear = today.getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 6 }, (_, i) => 1990 + i);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Input / Button */}
      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-left transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:border-[#111111] focus-visible:ring-1 focus-visible:ring-[#111111]',
            disabled && 'cursor-not-allowed bg-[#F9F9F9] text-[#888888] opacity-60',
            !value && 'text-[#999999]',
            className
          )}
        >
          <span className={cn('truncate font-normal', value ? 'text-[#111111]' : 'text-[#999999]')}>
            {value || placeholder}
          </span>
          <LuCalendar className="w-4 h-4 text-[#777777] shrink-0 ml-2" />
        </button>
      </div>

      {/* Popover Calendar Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-[280px] sm:w-[290px] p-3 rounded-xl border border-[#E5E5E5] bg-white shadow-xl text-[#111111]',
            'left-0 sm:left-auto right-auto sm:right-0 max-w-[calc(100vw-32px)]'
          )}
          style={{ minWidth: '270px' }}
        >
          {/* Header with Month & Year Selectors */}
          <div className="flex items-center justify-between gap-1 mb-2.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-[#F7F7F7] text-[#666666] hover:text-[#111111] transition-colors"
              title="Previous Month"
            >
              <LuChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="text-xs font-medium bg-[#F7F7F7] border border-[#E5E5E5] rounded-md px-2 py-1 text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
              >
                {MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="text-xs font-medium bg-[#F7F7F7] border border-[#E5E5E5] rounded-md px-2 py-1 text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111]"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-[#F7F7F7] text-[#666666] hover:text-[#111111] transition-colors"
              title="Next Month"
            >
              <LuChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="text-[10px] font-medium text-[#888888]">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Previous month leading days */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
              const prevDay = daysInPrevMonth - firstDayOfWeek + idx + 1;
              return (
                <span
                  key={`prev-${idx}`}
                  className="h-7 flex items-center justify-center text-xs text-[#CCCCCC] select-none"
                >
                  {prevDay}
                </span>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
              const day = idx + 1;
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === viewYear &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getDate() === day;

              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    'h-7 w-7 mx-auto flex items-center justify-center text-xs rounded-md transition-colors',
                    isSelected
                      ? 'bg-[#111111] text-white font-medium'
                      : isToday
                      ? 'border border-[#111111] font-medium text-[#111111] hover:bg-[#F7F7F7]'
                      : 'text-[#333333] hover:bg-[#F7F7F7]'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-2 mt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-[#777777] hover:text-[#111111] transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-xs font-medium text-[#111111] hover:underline transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
