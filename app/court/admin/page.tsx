'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  FolderOpen,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity,
  ArrowRight,
  Shield,
  FileText,
  Calendar,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#737373]">
        <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
        <p>Loading administrative telemetry...</p>
      </div>
    );
  }

  const stats = data?.statistics || {
    totalUsers: 0,
    totalCases: 0,
    draftCases: 0,
    completedCases: 0,
    casesToday: 0,
    activeUsers: 0,
  };

  const recentCases = data?.recentCases || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
          Platform Telemetry & Overview
        </h1>
        <p className="text-xs text-[#737373] mt-1">
          Real-time metrics, user registrations, and statutory filings from MongoDB
        </p>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#737373] mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Total Users</span>
            <Users size={14} className="text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#171717]">{stats.totalUsers}</div>
          <p className="text-[10px] text-[#737373] mt-0.5">Registered accounts</p>
        </div>

        <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#737373] mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Total Cases</span>
            <FolderOpen size={14} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#171717]">{stats.totalCases}</div>
          <p className="text-[10px] text-[#737373] mt-0.5">All complaints</p>
        </div>

        <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#737373] mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Draft Cases</span>
            <Clock size={14} className="text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#171717]">{stats.draftCases}</div>
          <p className="text-[10px] text-[#737373] mt-0.5">In drafting phase</p>
        </div>

        <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#737373] mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle size={14} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#171717]">{stats.completedCases}</div>
          <p className="text-[10px] text-[#737373] mt-0.5">Ready for filing</p>
        </div>

        <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#737373] mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Today</span>
            <Calendar size={14} className="text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#171717]">{stats.casesToday}</div>
          <p className="text-[10px] text-[#737373] mt-0.5">Created today</p>
        </div>

        <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#737373] mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Active</span>
            <Activity size={14} className="text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#171717]">{stats.activeUsers}</div>
          <p className="text-[10px] text-[#737373] mt-0.5">Past 7 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Cases Across All Users */}
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E5]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Recent Filings Across Platform</h2>
              <p className="text-[11px] text-[#737373]">Live consumer cases drafted by users</p>
            </div>
            <Link
              href="/court/admin/cases"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#737373] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Case</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Updated</th>
                  <th className="py-2.5 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {recentCases.slice(0, 6).map((c: any) => (
                  <tr key={c._id} className="hover:bg-[#F9FAFB]">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#171717] truncate max-w-[200px]">
                        {c.caseTitle}
                      </div>
                      <div className="text-[10px] text-[#737373] font-mono">{c._id}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[#737373]">{c.caseType}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${c.completionPercentage || 12}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono">{c.completionPercentage || 12}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#737373] text-[11px]">
                      {new Date(c.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/court/admin/cases/${c._id}`}
                        className="px-2 py-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-semibold rounded-md"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit / Activity Logs */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E5]">
              <div>
                <h2 className="text-sm font-bold text-[#171717]">Security Audit Feed</h2>
                <p className="text-[11px] text-[#737373]">Live system actions and events</p>
              </div>
              <Link
                href="/court/admin/activity"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                All Logs
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivity.slice(0, 6).map((log: any) => (
                <div key={log._id} className="text-xs pb-2 border-b border-[#F5F5F5] last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#171717]">{log.action}</span>
                    <span className="text-[10px] text-[#737373]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#737373] mt-0.5 truncate">
                    {log.userEmail || log.userName || log.userId}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

