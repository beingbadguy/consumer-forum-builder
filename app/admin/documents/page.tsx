'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Search,
  Download,
  Trash2,
  ExternalLink,
  FileText,
  Calendar,
} from 'lucide-react';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const filtered = documents.filter((d) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      d.originalFileName?.toLowerCase().includes(s) ||
      d.ownerName?.toLowerCase().includes(s) ||
      d.caseTitle?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717]">Document Storage Registry</h1>
        <p className="text-xs text-[#737373] mt-1">
          Secure central repository of annexures, supporting evidence, and exhibits uploaded by citizens
        </p>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Search documents, citizen names, or cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl text-[#171717] focus:bg-white focus:border-neutral-900 outline-none"
          />
        </div>
        <span className="text-xs text-[#737373]">Total: {documents.length} files</span>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#737373]">
            <span className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
            <p>Loading document registry...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#737373]">No documents found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#737373] uppercase tracking-wider text-[10px] border-b border-[#E5E5E5]">
                <tr>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">File Type</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Related Case</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filtered.map((d) => (
                  <tr key={d._id} className="hover:bg-[#F9FAFB]">
                    <td className="py-3.5 px-4 font-semibold text-[#171717] flex items-center gap-2">
                      <FileText size={14} className="text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[220px]">{d.originalFileName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#737373] font-mono text-[10px] uppercase">
                      {d.fileType || 'PDF'}
                    </td>
                    <td className="py-3.5 px-4 text-[#737373] text-[11px]">
                      {Math.round((d.fileSize || 1024) / 1024)} KB
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#171717]">{d.ownerName}</div>
                      <div className="text-[10px] text-[#737373]">{d.ownerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/cases/${d.caseId}`}
                        className="text-emerald-700 hover:underline font-medium text-[11px] truncate max-w-[180px] block"
                      >
                        {d.caseTitle}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-[#737373] text-[11px]">
                      {new Date(d.uploadedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Document storage key: ${d.storageKey}`)}
                        className="px-2 py-1 bg-white border border-[#E5E5E5] hover:bg-[#F9FAFB] text-[#171717] font-semibold text-[11px] rounded-md"
                      >
                        Inspect
                      </button>
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

