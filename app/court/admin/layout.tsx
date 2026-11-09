'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
  Scale,
  LayoutDashboard,
  Users,
  FolderOpen,
  FileCheck2,
  Activity,
  ArrowLeft,
  LogOut,
  ShieldAlert,
  Shield,
  FileText,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/court/admin');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white text-xs">
        <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  // Mandatory Server & Client Role-Based Access Control
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white border border-red-200 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <ShieldAlert size={26} />
          </div>
          <h1 className="text-lg font-bold text-[#171717]">Administrative Access Denied</h1>
          <p className="text-xs text-[#737373] mt-2 leading-relaxed">
            You do not possess administrative clearance to view the Consumer Mitra Court Administration Console. This access attempt has been logged for security audits.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/court/dashboard"
              className="px-4 py-2 bg-[#171717] hover:bg-black text-white text-xs font-semibold rounded-xl"
            >
              Return to User Dashboard
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 border border-[#E5E5E5] hover:bg-[#F9FAFB] text-xs font-semibold rounded-xl"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/court/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/court/admin/users', label: 'All Users', icon: Users },
    { href: '/court/admin/cases', label: 'All Cases', icon: FolderOpen },
    { href: '/court/admin/documents', label: 'Documents', icon: FileCheck2 },
    { href: '/court/admin/activity', label: 'Activity Logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E5E5E5] flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between">
          <Link href="/court/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold">
              <Shield size={16} className="text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#171717] tracking-tight">Admin Console</span>
              <span className="block text-[10px] text-emerald-700 font-mono font-medium">Consumer Mitra</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-[#737373] hover:text-[#171717] hover:bg-[#F9FAFB]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-emerald-400' : 'text-[#737373]'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin User info & actions */}
        <div className="p-3 border-t border-[#E5E5E5] space-y-2">
          <div className="px-3 py-2 bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl text-xs">
            <p className="font-bold text-[#171717] truncate">{user.name}</p>
            <p className="text-[10px] text-[#737373] font-mono truncate">{user.email}</p>
          </div>

          <Link
            href="/court/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#737373] hover:text-[#171717] hover:bg-[#F9FAFB] rounded-xl transition-colors"
          >
            <ArrowLeft size={14} />
            <span>User Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-8 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

