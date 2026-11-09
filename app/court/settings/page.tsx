'use client';

import React, { useState } from 'react';
import { CourtNav } from '@/app/components/court/CourtNav';
import { Settings, Globe, Bell, Shield, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [language, setLanguage] = useState<'hi' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('consumer_complaint_lang') as 'hi' | 'en') || 'hi';
    }
    return 'hi';
  });
  const [autoTranslit, setAutoTranslit] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('consumer_complaint_lang', language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#171717] flex flex-col">
      <CourtNav />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Account & Drafting Settings</h1>
        <p className="text-xs text-[#737373] mb-8">
          Configure default drafting language, Indic transliteration engine, and legal defaults
        </p>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={16} className="text-emerald-600" />
              <h2 className="text-sm font-bold text-[#171717]">Default Drafting Language</h2>
            </div>

            <div className="space-y-3 max-w-md">
              <label className="flex items-center gap-3 p-3 border border-[#E5E5E5] rounded-xl cursor-pointer hover:bg-[#F9FAFB]">
                <input
                  type="radio"
                  name="lang"
                  checked={language === 'hi'}
                  onChange={() => setLanguage('hi')}
                  className="text-emerald-600 focus:ring-emerald-600"
                />
                <div>
                  <div className="font-semibold text-xs text-[#171717]">Hindi (हिंदी / Devanagari)</div>
                  <div className="text-[11px] text-[#737373]">
                    Full Devanagari court proforma with automatic Hinglish transliteration
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-[#E5E5E5] rounded-xl cursor-pointer hover:bg-[#F9FAFB]">
                <input
                  type="radio"
                  name="lang"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="text-emerald-600 focus:ring-emerald-600"
                />
                <div>
                  <div className="font-semibold text-xs text-[#171717]">English</div>
                  <div className="text-[11px] text-[#737373]">
                    Standard English court legal terminology under Section 35 CPA 2019
                  </div>
                </div>
              </label>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Save Preferences
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <CheckCircle size={14} /> Saved successfully
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

