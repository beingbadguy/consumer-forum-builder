'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  Shield,
  ShieldAlert,
} from 'lucide-react';

export default function AdminCitizensPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = search ? `/api/admin/users?search=${encodeURIComponent(search)}` : '/api/admin/users';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const actionWord = nextStatus === 'suspended' ? 'suspend' : 'reactivate';

    if (!confirm(`Are you sure you want to ${actionWord} this account?`)) return;

    try {
      setUpdatingId(userId);
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Action failed');
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, accountStatus: nextStatus } : u))
      );
    } catch {
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((u) => {
    if (statusFilter !== 'all' && u.accountStatus !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717]">Registered Citizens & Litigants</h1>
        <p className="text-xs text-[#737373] mt-1">
          Complete user directory of citizens preparing consumer court complaints
        </p>
      </div>

      {/* Search & Filter */}
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
            All Accounts ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'active'
                ? 'bg-neutral-900 text-white'
                : 'bg-[#F9FAFB] text-[#737373] hover:text-[#171717]'
            }`}
          >
            Active ({users.filter((u) => u.accountStatus === 'active').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('suspended')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'suspended'
                ? 'bg-neutral-900 text-white'
                : 'bg-[#F9FAFB] text-[#737373] hover:text-[#171717]'
            }`}
          >
            Suspended ({users.filter((u) => u.accountStatus === 'suspended').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl text-[#171717] focus:bg-white focus:border-neutral-900 outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#737373]">
            <span className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
            <p>Loading citizen directory from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#737373]">No citizen records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#737373] uppercase tracking-wider text-[10px] border-b border-[#E5E5E5]">
                <tr>
                  <th className="py-3 px-4">Citizen Name & Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Email Status</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Complaints</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F9FAFB]">
                    <td className="py-3.5 px-4 font-semibold text-[#171717]">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-[#737373] font-mono">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                          <CheckCircle size={12} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          u.accountStatus === 'suspended'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {u.accountStatus || 'active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#171717]">
                      {u.caseCount}
                    </td>
                    <td className="py-3.5 px-4 text-[#737373] text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-[#737373] text-[11px]">
                      {u.lastLoginAt
                        ? new Date(u.lastLoginAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'Never'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u.id, u.accountStatus)}
                          disabled={updatingId === u.id}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                            u.accountStatus === 'suspended'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-white hover:bg-red-50 text-red-600 border border-red-200'
                          }`}
                        >
                          {updatingId === u.id
                            ? '...'
                            : u.accountStatus === 'suspended'
                            ? 'Reactivate'
                            : 'Suspend'}
                        </button>
                      )}
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

