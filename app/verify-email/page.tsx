'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Scale, CheckCircle, ArrowRight } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white border border-[#E5E5E5] rounded-2xl shadow-sm text-center">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
        <CheckCircle size={28} />
      </div>

      <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Email Verified</h1>
      <p className="text-sm text-[#737373] mt-2 mb-6 leading-relaxed">
        Your email address has been verified successfully. Your Consumer Mitra legal case drafting account is fully active.
      </p>

      <Link
        href="/court/dashboard"
        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
      >
        <span>Proceed to Dashboard</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#F9FAFB]">
      <Suspense fallback={<div>Loading verification...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

