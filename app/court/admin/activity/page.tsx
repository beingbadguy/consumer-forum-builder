'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Search, RefreshCw, Shield, Clock } from 'lucide-react';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/activity');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.activity || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      l.action?.toLowerCase().includes(s) ||
      l.userEmail?.toLowerCase().includes(s) ||
      l.userName?.toLowerCase().includes(s) ||
      l.caseId?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717]">System Audit & Activity Logs</h1>
          <p className="text-xs text-[#737373] mt-1">
            Immutable security audit trail capturing user authentication, case mutations, and administrative overrides
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E5E5] rounded-xl hover:bg-[#F9FAFB] text-xs font-semibold text-[#737373] hover:text-[#171717] transition-colors"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Search actions, emails, or case IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl text-[#171717] focus:bg-white focus:border-neutral-900 outline-none"
          />
        </div>
        <span className="text-xs text-[#737373] font-mono">Entries: {filtered.length}</span>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#737373]">
            <span className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
            <p>Fetching immutable activity trail from MongoDB...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#737373]">No audit logs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#737373] uppercase tracking-wider text-[10px] border-b border-[#E5E5E5]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Case Reference</th>
                  <th className="py-3 px-4">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filtered.map((log) => (
                  <tr key={log._id} className="hover:bg-[#F9FAFB]">
                    <td className="py-3 px-4 text-[#737373] font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-neutral-100 text-[#171717] border border-[#E5E5E5]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#171717]">{log.userName || log.userEmail || log.userId}</div>
                      {log.userEmail && (
                        <div className="text-[10px] text-[#737373] font-mono">{log.userEmail}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#737373]">
                      {log.caseId ? (
                        <span className="text-emerald-700 font-semibold">{log.caseId}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-[10px] text-[#737373] max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : '—'}
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

