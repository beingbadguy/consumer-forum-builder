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
  Plus,
  ArrowRight,
  Download,
  Trash2,
  Search,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

export default function MyCasesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'completed'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/court/cases');
    }
  }, [user, isLoading, router]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cases');
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  const handleDelete = async (caseId: string) => {
    if (!confirm('Are you sure you want to delete this case?')) return;
    try {
      const res = await fetch(`/api/cases/${caseId}`, { method: 'DELETE' });
      if (res.ok) {
        setCases((prev) => prev.filter((c) => c._id !== caseId));
      }
    } catch {
      alert('Delete failed');
    }
  };

  const handleDownloadDocx = async (caseItem: CaseRecord) => {
    try {
      setDownloadingId(caseItem._id);
      const filename = `Consumer_Complaint_${caseItem.caseType || 'Filing'}_${caseItem._id}.docx`;
      await exportToDocx(caseItem.formData, filename);
    } catch (err) {
      console.error(err);
      alert('Failed to generate Word document.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  const filtered = cases.filter((c) => {
    if (statusFilter !== 'all' && c.caseStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.caseTitle.toLowerCase().includes(q) ||
        c._id.toLowerCase().includes(q) ||
        c.caseType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#171717] flex flex-col">
      <CourtNav />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#171717]">My Complaints</h1>
            <p className="text-xs text-[#737373] mt-0.5">
              Browse all legal cases drafted under your Consumer Mitra account
            </p>
          </div>

          <Link
            href="/court/new-case"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all shrink-0"
          >
            <Plus size={15} />
            <span>New Complaint</span>
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#F9FAFB] text-[#737373] hover:text-[#171717]'
              }`}
            >
              All ({cases.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'draft'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#F9FAFB] text-[#737373] hover:text-[#171717]'
              }`}
            >
              Drafts ({cases.filter((c) => c.caseStatus === 'draft').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#F9FAFB] text-[#737373] hover:text-[#171717]'
              }`}
            >
              Completed ({cases.filter((c) => c.caseStatus === 'completed' || c.completionPercentage >= 90).length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl text-[#171717] focus:bg-white focus:border-emerald-600 outline-none"
            />
          </div>
        </div>

        {/* Case List Grid */}
        {loading ? (
          <div className="p-16 text-center text-xs text-[#737373]">
            <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
            <p>Loading your cases from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 bg-white border border-[#E5E5E5] rounded-2xl text-center">
            <FolderOpen size={28} className="mx-auto text-[#737373] mb-3" />
            <h3 className="text-sm font-semibold text-[#171717]">No complaints found</h3>
            <p className="text-xs text-[#737373] mt-1">Try adjusting your filters or start a new complaint.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="p-5 bg-white border border-[#E5E5E5] hover:border-emerald-600/40 rounded-2xl shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.caseStatus}
                    </span>
                    <span className="text-[10px] font-mono text-[#737373]">
                      Step {c.currentStep || 1}/8
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#171717] line-clamp-2 mb-1">
                    {c.caseTitle}
                  </h3>
                  <p className="text-xs text-[#737373]">{c.caseType || 'Consumer Dispute'}</p>

                  <div className="mt-4 pt-3 border-t border-[#E5E5E5]">
                    <div className="flex justify-between text-[11px] text-[#737373] mb-1">
                      <span>Dossier Completion</span>
                      <span className="font-semibold text-[#171717]">{c.completionPercentage || 12}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${c.completionPercentage || 12}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between">
                  <span className="text-[10px] text-[#737373]">
                    Saved{' '}
                    {new Date(c.lastSavedAt || c.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDownloadDocx(c)}
                      disabled={downloadingId === c._id}
                      className="p-1.5 text-[#737373] hover:text-[#171717] rounded-lg border border-[#E5E5E5] hover:bg-[#F9FAFB]"
                      title="Download MS Word (.docx)"
                    >
                      <Download size={13} className="text-blue-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 text-[#737373] hover:text-red-600 rounded-lg border border-[#E5E5E5] hover:bg-red-50"
                      title="Delete case"
                    >
                      <Trash2 size={13} />
                    </button>
                    <Link
                      href={`/court/case/${c._id}?step=${c.currentStep || 1}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
                    >
                      <span>Open</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

