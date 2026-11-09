'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';
import {
  Scale,
  FileText,
  ShieldCheck,
  Download,
  Languages,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Building,
  Gavel,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Scale size={18} />
            </div>
            <div>
              <span className="font-bold text-lg text-[#171717] tracking-tight">
                Consumer <span className="text-emerald-600">Mitra</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                SaaS Legal Tech
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-20 h-8 bg-[#F9FAFB] rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/court/dashboard"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/court/admin"
                    className="hidden sm:inline-flex px-3 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all"
                  >
                    Admin Console
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#171717] hover:bg-[#F9FAFB] rounded-xl border border-transparent hover:border-[#E5E5E5] transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#E5E5E5] bg-gradient-to-b from-[#F9FAFB] to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
            <Sparkles size={14} className="text-emerald-600" />
            <span>Statutory Compliance with Consumer Protection Act, 2019</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#171717] tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Professional Consumer Court Case Drafting & Management SaaS
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#737373] max-w-2xl mx-auto leading-relaxed">
            Draft, manage, and export court-ready legal petitions for District & State Consumer Commissions with real-time Hinglish-to-Hindi transliteration and native Word (.docx) & PDF generation.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href={user ? '/court/dashboard' : '/register'}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{user ? 'Open Case Dashboard' : 'File a New Consumer Complaint'}</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#F9FAFB] text-[#171717] text-sm font-semibold rounded-xl border border-[#E5E5E5] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Advocate & Citizen Portal</span>
              <ChevronRight size={16} className="text-[#737373]" />
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-14 pt-10 border-t border-[#E5E5E5] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <div className="text-2xl font-bold text-[#171717]">8 Steps</div>
              <div className="text-xs text-[#737373] mt-0.5">Statutory Court Dossier</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#171717]">Word & PDF</div>
              <div className="text-xs text-[#737373] mt-0.5">Instant Legal Formats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#171717]">Dual Language</div>
              <div className="text-xs text-[#737373] mt-0.5">Hinglish to Hindi Engine</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#171717]">100% Secure</div>
              <div className="text-xs text-[#737373] mt-0.5">MongoDB Cloud Autosave</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#171717] tracking-tight">
              Engineered for Indian Legal Standards
            </h2>
            <p className="mt-3 text-sm text-[#737373]">
              From Commission proforma to Rule 14 Affidavits, Consumer Mitra guarantees that every document conforms to official court filing conventions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#F9FAFB] border border-[#E5E5E5] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-base text-[#171717] mb-2">Section 35 Complaint Builder</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Step-by-step guidance covering Proforma Part 1 & 2, Chronological Events, Memo of Parties, Narrative Facts, Relief Prayers, and Rule 14 Affidavits.
              </p>
            </div>

            <div className="p-6 bg-[#F9FAFB] border border-[#E5E5E5] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
                <Languages size={20} />
              </div>
              <h3 className="font-bold text-base text-[#171717] mb-2">Real-Time Indic Transliteration</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Type phonetically in Hinglish (e.g., &quot;Mera naam Deepak hai&quot;) and watch it automatically convert to accurate Devanagari script without installing Hindi keyboards.
              </p>
            </div>

            <div className="p-6 bg-[#F9FAFB] border border-[#E5E5E5] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
                <Download size={20} />
              </div>
              <h3 className="font-bold text-base text-[#171717] mb-2">Direct Word (.docx) & PDF Export</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Download fully styled Microsoft Word documents and print-ready A4 PDFs complete with table borders, signatures, and standard 1.25&quot; court stitching margins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E5E5E5] bg-[#F9FAFB] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-emerald-600" />
            <span className="font-semibold text-[#171717]">Consumer Mitra</span>
            <span>&copy; {new Date().getFullYear()} — Consumer Dispute Redressal SaaS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-[#171717]">Sign In</Link>
            <Link href="/register" className="hover:text-[#171717]">Register</Link>
            <Link href="/court/admin" className="hover:text-[#171717]">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
