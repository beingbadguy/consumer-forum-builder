'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Scale } from 'lucide-react';

export default function NewCasePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login?redirect=/court/new-case');
      return;
    }

    const createCase = async () => {
      try {
        const savedLang = (localStorage.getItem('consumer_complaint_lang') || 'hi') as 'hi' | 'en';
        const res = await fetch('/api/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: savedLang,
            title: 'New Consumer Complaint',
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to provision new case record in database');
        }

        const data = await res.json();
        const caseId = data.case?._id;
        if (caseId) {
          router.replace(`/court/case/${caseId}?step=1`);
        } else {
          throw new Error('Missing case identifier in response');
        }
      } catch (err: any) {
        console.error('Error creating case:', err);
        setError(err.message || 'Failed to initialize case workspace');
      }
    };

    createCase();
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-white border border-[#E5E5E5] rounded-2xl shadow-sm text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <Scale size={24} className="animate-pulse" />
        </div>
        <h2 className="text-base font-bold text-[#171717]">Initializing Drafting Workspace</h2>
        <p className="text-xs text-[#737373] mt-1.5 leading-relaxed">
          Creating statutory case document in MongoDB under Consumer Protection Act, 2019...
        </p>

        {error ? (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
        )}
      </div>
    </div>
  );
}

