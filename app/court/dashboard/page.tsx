'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { CourtNav } from '@/app/components/court/CourtNav';
import { CaseRecord } from '@/app/lib/repository';
import { exportToDocx } from '@/app/lib/docxExport';
import {
  FileText,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Download,
  Trash2,
  ExternalLink,
  Scale,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingDocxId, setDownloadingDocxId] = useState<string | null>(null);

  // Authentication protection
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/court/dashboard');
    }
  }, [user, isLoading, router]);

  const fetchCases = async () => {
    try {
      setLoadingCases(true);
      const res = await fetch('/api/cases');
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
      }
    } catch (err) {
      console.error('Failed to load user cases:', err);
    } finally {
      setLoadingCases(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  const handleDeleteCase = async (caseId: string) => {
    if (!confirm('Are you sure you want to permanently delete this complaint draft?')) return;
    try {
      setDeletingId(caseId);
      const res = await fetch(`/api/cases/${caseId}`, { method: 'DELETE' });
      if (res.ok) {
        setCases((prev) => prev.filter((c) => c._id !== caseId));
      } else {
        alert('Failed to delete case.');
      }
    } catch (err) {
      alert('Error connecting to server.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadDocx = async (caseItem: CaseRecord) => {
    try {
      setDownloadingDocxId(caseItem._id);
      const filename = `Consumer_Complaint_${caseItem.caseType || 'Filing'}_${caseItem._id}.docx`;
      await exportToDocx(caseItem.formData, filename);
    } catch (err) {
      console.error('Docx export failed:', err);
      alert('Failed to generate Word document.');
    } finally {
      setDownloadingDocxId(null);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs text-[#737373]">
          <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
          <span>Authenticating session...</span>
        </div>
      </div>
    );
  }

  // Calculate live MongoDB statistics
  const totalCases = cases.length;
  const draftCases = cases.filter((c) => c.caseStatus === 'draft').length;
  const completedCases = cases.filter((c) => c.caseStatus === 'completed' || c.completionPercentage >= 90).length;

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentlyUpdated = cases.filter((c) => new Date(c.lastSavedAt || c.updatedAt) >= oneDayAgo).length;

  const filteredCases = cases.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.caseTitle.toLowerCase().includes(q) ||
      c._id.toLowerCase().includes(q) ||
      c.caseType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#171717] flex flex-col">
      <CourtNav />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E5E5E5]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              Welcome back, {user.name}
            </h1>
            <p className="text-sm text-[#737373] mt-1">
              Manage your consumer complaints and continue your legal documentation.
            </p>
          </div>

          <Link
            href="/court/new-case"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Create New Complaint</span>
          </Link>
        </div>

        {/* 4 Dashboard Statistics Cards (from MongoDB) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Total Cases
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-3">
              {loadingCases ? '...' : totalCases}
            </div>
            <p className="text-xs text-[#737373] mt-1">All complaints filed or in progress</p>
          </div>

          <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Draft Cases
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-3">
              {loadingCases ? '...' : draftCases}
            </div>
            <p className="text-xs text-[#737373] mt-1">Under drafting & preparation</p>
          </div>

          <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Completed Cases
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-3">
              {loadingCases ? '...' : completedCases}
            </div>
            <p className="text-xs text-[#737373] mt-1">Ready for court filing</p>
          </div>

          <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Recently Updated
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <RefreshCw size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-3">
              {loadingCases ? '...' : recentlyUpdated}
            </div>
            <p className="text-xs text-[#737373] mt-1">Active within past 24 hours</p>
          </div>
        </div>

        {/* Recent Cases Section */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#171717]">Recent Complaints</h2>
              <p className="text-xs text-[#737373] mt-0.5">
                Continue drafting or export official court petitions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl text-[#171717] focus:bg-white focus:border-emerald-600 outline-none w-48 sm:w-60"
                />
              </div>
              <button
                type="button"
                onClick={fetchCases}
                className="p-2 border border-[#E5E5E5] rounded-xl hover:bg-[#F9FAFB] text-[#737373] hover:text-[#171717]"
                title="Refresh case list"
              >
                <RefreshCw size={14} className={loadingCases ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {loadingCases ? (
            <div className="p-12 text-center text-xs text-[#737373]">
              <span className="inline-block w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2"></span>
              <p>Fetching cases from MongoDB...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FileText size={22} />
              </div>
              <h3 className="text-sm font-semibold text-[#171717]">No complaints found</h3>
              <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? 'No complaints matched your search filter.'
                  : 'You have not created any consumer complaints yet. Click below to begin drafting.'}
              </p>
              {!searchQuery && (
                <Link
                  href="/court/new-case"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  <Plus size={14} />
                  <span>Start First Complaint</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F9FAFB] text-[#737373] font-semibold uppercase tracking-wider border-b border-[#E5E5E5]">
                  <tr>
                    <th className="py-3 px-4">Case Title & ID</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Step</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Last Saved</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {filteredCases.map((c) => (
                    <tr key={c._id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3.5 px-4 font-medium text-[#171717]">
                        <div className="font-semibold">{c.caseTitle}</div>
                        <div className="text-[10px] font-mono text-[#737373] mt-0.5">ID: {c._id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#737373]">
                        {c.caseType || 'Consumer Dispute'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#171717]">Step {c.currentStep || 1}</span>
                        <span className="text-[#737373]"> of 8</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] text-[#737373] mb-1">
                            <span>{c.completionPercentage || 12}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{ width: `${c.completionPercentage || 12}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#737373] whitespace-nowrap">
                        {c.lastSavedAt
                          ? new Date(c.lastSavedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Just now'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            c.caseStatus === 'completed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {c.caseStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Continue Editing */}
                          <Link
                            href={`/court/case/${c._id}?step=${c.currentStep || 1}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] transition-all"
                          >
                            <span>Edit</span>
                            <ArrowRight size={12} />
                          </Link>

                          {/* Download Word */}
                          <button
                            type="button"
                            onClick={() => handleDownloadDocx(c)}
                            disabled={downloadingDocxId === c._id}
                            className="p-1 text-[#737373] hover:text-[#171717] hover:bg-white rounded-lg border border-[#E5E5E5] transition-all"
                            title="Download Word (.docx)"
                          >
                            {downloadingDocxId === c._id ? (
                              <span className="w-3.5 h-3.5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin inline-block"></span>
                            ) : (
                              <Download size={13} className="text-blue-600" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCase(c._id)}
                            disabled={deletingId === c._id}
                            className="p-1 text-[#737373] hover:text-red-600 hover:bg-red-50 rounded-lg border border-[#E5E5E5] transition-all"
                            title="Delete draft complaint"
                          >
                            {deletingId === c._id ? (
                              <span className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin inline-block"></span>
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

