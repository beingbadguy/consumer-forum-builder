'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { exportToDocx } from '@/app/lib/docxExport';
import {
  FolderOpen,
  Search,
  Download,
  Eye,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function AdminAllCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const url = search ? `/api/admin/cases?search=${encodeURIComponent(search)}` : '/api/admin/cases';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [search]);

  const handleDownloadDocx = async (caseItem: any) => {
    try {
      setDownloadingId(caseItem._id);
      const filename = `Consumer_Complaint_${caseItem.caseType || 'Filing'}_${caseItem._id}.docx`;
      await exportToDocx(caseItem.formData, filename);
    } catch {
      alert('Word document generation failed');
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = cases.filter((c) => {
    if (statusFilter !== 'all' && c.caseStatus !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717]">All Citizen Complaints</h1>
        <p className="text-xs text-[#737373] mt-1">
          Complete registry of consumer disputes filed by citizens across all District and State Commissions
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-[#F9FAFB] text-[#737373] hover:text-[#171717]'
            }`}
          >
            All Complaints ({cases.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'draft'
                ? 'bg-neutral-900 text-white'
                : 'bg-[#F9FAFB] text-[#737373] hover:text-[#171717]'
            }`}
          >
            Drafts ({cases.filter((c) => c.caseStatus === 'draft').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'completed'
                ? 'bg-neutral-900 text-white'
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
            placeholder="Search by title, ID, or citizen name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl text-[#171717] focus:bg-white focus:border-neutral-900 outline-none"
          />
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#737373]">
            <span className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
            <p>Loading complaints from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#737373]">No complaints found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#737373] uppercase tracking-wider text-[10px] border-b border-[#E5E5E5]">
                <tr>
                  <th className="py-3 px-4">Complaint Details</th>
                  <th className="py-3 px-4">Citizen Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Step</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Saved</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-[#F9FAFB]">
                    <td className="py-3.5 px-4 font-semibold text-[#171717]">
                      <div>{c.caseTitle}</div>
                      <div className="text-[10px] text-[#737373] font-mono">ID: {c._id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#171717]">{c.userName}</div>
                      <div className="text-[10px] text-[#737373]">{c.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#737373]">{c.caseType}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#171717]">
                      Step {c.currentStep || 1}/8
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-20">
                        <div className="text-[10px] text-[#737373] mb-1 font-mono">
                          {c.completionPercentage || 12}%
                        </div>
                        <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${c.completionPercentage || 12}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.caseStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#737373] text-[11px] whitespace-nowrap">
                      {new Date(c.lastSavedAt || c.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownloadDocx(c)}
                          disabled={downloadingId === c._id}
                          className="p-1.5 rounded-lg border border-[#E5E5E5] text-[#737373] hover:text-[#171717] hover:bg-white cursor-pointer"
                          title="Download Word (.docx)"
                        >
                          <Download size={13} className="text-blue-600" />
                        </button>
                        <Link
                          href={`/admin/cases/${c._id}`}
                          className="px-2.5 py-1 bg-neutral-900 hover:bg-black text-white font-semibold rounded-lg text-[11px]"
                        >
                          Inspect
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

