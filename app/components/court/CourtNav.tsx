'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
  Scale,
  Plus,
  FileText,
  LayoutDashboard,
  FolderOpen,
  User,
  LogOut,
  Shield,
  ChevronDown,
  Languages,
} from 'lucide-react';

export const CourtNav: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  const toggleLanguage = () => {
    const next = lang === 'hi' ? 'en' : 'hi';
    setLang(next);
    localStorage.setItem('consumer_complaint_lang', next);
    window.dispatchEvent(new Event('storage'));
  };

  const navLinks = [
    { href: '/court/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/court/cases', label: 'My Cases', icon: FolderOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand + Main Links */}
        <div className="flex items-center gap-8">
          <Link href="/court/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Scale size={18} />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg text-[#171717] tracking-tight">
                Consumer <span className="text-emerald-600">Mitra</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#F9FAFB] text-[#171717] border border-[#E5E5E5]'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions + Profile Dropdown */}
        <div className="flex items-center gap-3">
          {/* New Complaint Button */}
          <Link
            href="/court/new-case"
            className="flex items-center gap-1.5 h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">New Complaint</span>
          </Link>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="h-9 px-2.5 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F9FAFB] text-[#171717] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Toggle Hindi / English interface"
          >
            <Languages size={14} className="text-[#737373]" />
            <span className="font-semibold">{lang === 'hi' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 h-9 pl-2 pr-2.5 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F9FAFB] text-[#171717] transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline text-xs font-semibold max-w-[120px] truncate text-left">
                {user?.name || 'User'}
              </span>
              <ChevronDown size={14} className="text-[#737373]" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E5E5] rounded-2xl shadow-lg z-50 p-1.5 text-xs">
                  <div className="px-3 py-2 border-b border-[#E5E5E5] mb-1">
                    <p className="font-semibold text-[#171717] truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#737373] truncate">{user?.email}</p>
                    {user?.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        <Shield size={10} />
                        Admin Access
                      </span>
                    )}
                  </div>

                  <Link
                    href="/court/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-[#171717] hover:bg-[#F9FAFB] rounded-xl transition-colors font-medium"
                  >
                    <User size={14} className="text-[#737373]" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/court/cases"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-[#171717] hover:bg-[#F9FAFB] rounded-xl transition-colors font-medium"
                  >
                    <FileText size={14} className="text-[#737373]" />
                    <span>All Complaints</span>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      href="/court/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-purple-700 hover:bg-purple-50 rounded-xl transition-colors font-semibold"
                    >
                      <Shield size={14} />
                      <span>Admin Console</span>
                    </Link>
                  )}

                  <div className="border-t border-[#E5E5E5] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-left cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

