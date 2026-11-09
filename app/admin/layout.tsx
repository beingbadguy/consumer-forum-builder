'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileCheck2,
  Activity,
  LogOut,
  Shield,
  ExternalLink,
} from 'lucide-react';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // If on /admin/login, do not wrap with the dashboard layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'admin') {
        router.push('/admin/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white text-xs">
        <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Citizens', icon: Users },
    { href: '/admin/cases', label: 'All Complaints', icon: FolderOpen },
    { href: '/admin/documents', label: 'Documents', icon: FileCheck2 },
    { href: '/admin/activity', label: 'Activity Logs', icon: Activity },
  ];

  const handleAdminLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row text-[#171717]">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E5E5E5] flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
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
            <span className="inline-flex mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
              ROOT ADMIN
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
          >
            <LogOut size={14} />
            <span>Secure Admin Logout</span>
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

