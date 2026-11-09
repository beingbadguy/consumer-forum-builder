'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Scale, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue');
      return;
    }

    setIsSubmitting(true);
    const res = await register(name, email, password);

    if (!res.success) {
      setError(res.error || 'Registration failed');
      setIsSubmitting(false);
    } else {
      router.push('/court/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#F9FAFB]">
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white border border-[#E5E5E5] rounded-2xl shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Scale size={20} />
            </div>
            <span className="font-bold text-xl text-[#171717] tracking-tight">
              Consumer <span className="text-emerald-600">Mitra</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Create Your Free Account</h1>
          <p className="text-sm text-[#737373] mt-2 leading-relaxed">
            Prepare your consumer complaint and legal documents online — easily, without needing legal expertise.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider">
                Full Name
              </label>
              <span className="text-[11px] text-[#737373]">e.g. Rahul Kumar / Priya Sharma</span>
            </div>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all outline-none"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all outline-none"
              />
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-emerald-600 border-[#E5E5E5] rounded focus:ring-emerald-600"
            />
            <label htmlFor="terms" className="text-xs text-[#737373] leading-relaxed cursor-pointer">
              I agree to the Terms of Service & Privacy Policy and understand that Consumer Mitra assists citizens in drafting consumer disputes under the Consumer Protection Act, 2019.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Create My Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E5E5E5] text-center text-xs text-[#737373]">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
