'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, logout } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid administrator credentials');
        setIsSubmitting(false);
        return;
      }

      // Verify that user is actually an admin
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();

      if (meData?.user?.role !== 'admin') {
        await logout();
        setError('Access denied: This account does not have administrative clearance.');
        setIsSubmitting(false);
        return;
      }

      router.push('/admin');
    } catch {
      setError('Communication failure with authentication gateway');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#111111]">
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-2xl text-white">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 shadow-inner">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Consumer Mitra — Admin Portal
          </h1>
          <p className="text-xs text-[#888888] mt-1.5 font-medium">
            Authorized administrative access only.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#CCCCCC] uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@consumermitra.gov.in"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#141414] border border-[#333333] rounded-xl text-sm text-white placeholder:text-[#555555] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#CCCCCC] uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#141414] border border-[#333333] rounded-xl text-sm text-white placeholder:text-[#555555] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Secure Admin Login</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-[#262626] text-center text-[11px] text-[#666666]">
          All access attempts are cryptographically verified and recorded in the audit registry.
        </div>
      </div>
    </div>
  );
}

