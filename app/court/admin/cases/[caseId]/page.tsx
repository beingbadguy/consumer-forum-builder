'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { exportToDocx } from '@/app/lib/docxExport';
import { DocumentPreview } from '@/app/components/preview/DocumentPreview';
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  User,
  Calendar,
  Shield,
  Activity,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface CaseDetailsProps {
  params: Promise<{ caseId: string }>;
}

export default function AdminCaseInspectorPage({ params }: CaseDetailsProps) {
  const { caseId } = use(params);
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'preview' | 'activity'>('overview');
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/cases/${caseId}`);
        if (res.ok) {
          const data = await res.json();
          setCaseData(data);
        }
      } catch (err) {
        console.error('Failed to load case details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId]);

  const handleDownloadDocx = async () => {
    if (!caseData?.case?.formData) return;
    try {
      setDownloadingDocx(true);
      const filename = `Consumer_Complaint_${caseData.case.caseType || 'Filing'}_${caseId}.docx`;
      await exportToDocx(caseData.case.formData, filename);
    } catch {
      alert('Docx export failed');
    } finally {
      setDownloadingDocx(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#737373]">
        <span className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
        <p>Loading case dossier and audit history...</p>
      </div>
    );
  }

  if (!caseData?.case) {
    return (
      <div className="p-12 text-center text-xs text-[#737373]">
        Case not found.
      </div>
    );
  }

  const { case: c, owner, documents, activity } = caseData;
  const formData = c.formData || {};
  const cd = formData.caseDetails || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-3">
          <Link
            href="/court/admin/cases"
            className="p-1.5 rounded-lg border border-[#E5E5E5] hover:bg-[#F9FAFB] text-[#737373] hover:text-[#171717]"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#171717]">{c.caseTitle}</h1>
              <span className="text-xs font-mono text-[#737373] bg-[#F9FAFB] px-2 py-0.5 rounded border border-[#E5E5E5]">
                {c._id}
              </span>
            </div>
            <p className="text-xs text-[#737373] mt-0.5">
              Consumer Dispute Redressal Dossier under Section 35 CPA 2019
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={downloadingDocx}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5E5E5] hover:bg-[#F9FAFB] text-[#171717] text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Download size={14} className="text-blue-600" />
            <span>Download Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-[#737373] hover:text-[#171717] hover:bg-[#F9FAFB]'
          }`}
        >
          Case Telemetry & Citizen Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'sections'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-[#737373] hover:text-[#171717] hover:bg-[#F9FAFB]'
          }`}
        >
          All 8 Statutory Sections
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'preview'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-[#737373] hover:text-[#171717] hover:bg-[#F9FAFB]'
          }`}
        >
          Full Court Preview (PDF)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'activity'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-[#737373] hover:text-[#171717] hover:bg-[#F9FAFB]'
          }`}
        >
          Audit History ({activity.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Owner info */}
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#171717] mb-3 pb-2 border-b border-[#E5E5E5]">
              <User size={14} className="text-emerald-600" />
              <span>Filing Citizen / Advocate</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#737373]">Full Name:</span>
                <p className="font-semibold text-[#171717]">{owner?.name || 'Unknown'}</p>
              </div>
              <div>
                <span className="text-[#737373]">Email:</span>
                <p className="font-semibold text-[#171717]">{owner?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[#737373]">User Account Status:</span>
                <p className="mt-0.5">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {owner?.accountStatus || 'active'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Forum & Valuation */}
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#171717] mb-3 pb-2 border-b border-[#E5E5E5]">
              <Shield size={14} className="text-blue-600" />
              <span>Forum & Statutory Valuation</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#737373]">Target Commission:</span>
                <p className="font-semibold text-[#171717]">{cd.commissionName || 'District Commission'}</p>
              </div>
              <div>
                <span className="text-[#737373]">Dispute Category:</span>
                <p className="font-semibold text-[#171717]">{cd.category || 'Consumer Dispute'}</p>
              </div>
              <div>
                <span className="text-[#737373]">Claim Amount:</span>
                <p className="font-bold text-emerald-700 text-sm">
                  {cd.claimedAmount ? `₹ ${cd.claimedAmount}/-` : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps & Progress */}
          <div className="p-5 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#171717] mb-3 pb-2 border-b border-[#E5E5E5]">
              <Calendar size={14} className="text-purple-600" />
              <span>Lifecycle & Progress</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#737373]">Current Step:</span>
                <p className="font-semibold text-[#171717]">Step {c.currentStep || 1} of 8</p>
              </div>
              <div>
                <span className="text-[#737373]">Dossier Completion:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${c.completionPercentage || 12}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] font-bold">{c.completionPercentage || 12}%</span>
                </div>
              </div>
              <div>
                <span className="text-[#737373]">Created Date:</span>
                <p className="font-mono text-[11px] text-[#171717]">
                  {new Date(c.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-[#737373]">Last Saved Timestamp:</span>
                <p className="font-mono text-[11px] text-[#171717]">
                  {new Date(c.lastSavedAt || c.updatedAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sections (Read-Only Inspection of All 8 Steps) */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#171717] mb-2">
              Section 1: Commission & Proforma Details
            </h3>
            <pre className="p-3 bg-[#F9FAFB] rounded-xl text-[11px] overflow-auto max-h-48 border border-[#E5E5E5]">
              {JSON.stringify(formData.caseDetails, null, 2)}
            </pre>
          </div>

          <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#171717] mb-2">
              Section 2: List of Dates & Events ({formData.events?.length || 0} events)
            </h3>
            <pre className="p-3 bg-[#F9FAFB] rounded-xl text-[11px] overflow-auto max-h-48 border border-[#E5E5E5]">
              {JSON.stringify(formData.events, null, 2)}
            </pre>
          </div>

          <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#171717] mb-2">
              Section 3: Memo of Parties ({formData.complainants?.length || 0} Complainants, {formData.oppositeParties?.length || 0} OPs)
            </h3>
            <pre className="p-3 bg-[#F9FAFB] rounded-xl text-[11px] overflow-auto max-h-48 border border-[#E5E5E5]">
              {JSON.stringify({ complainants: formData.complainants, oppositeParties: formData.oppositeParties }, null, 2)}
            </pre>
          </div>

          <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#171717] mb-2">
              Section 4: Complaint Petition Body
            </h3>
            <div className="p-3 bg-[#F9FAFB] rounded-xl text-xs whitespace-pre-wrap border border-[#E5E5E5]">
              {formData.complaintBody || '(Default standard paragraphs applied)'}
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#171717] mb-2">
              Section 5: Prayer & Relief Clauses
            </h3>
            <div className="p-3 bg-[#F9FAFB] rounded-xl text-xs whitespace-pre-wrap border border-[#E5E5E5]">
              {formData.prayer || JSON.stringify(formData.prayerClaims, null, 2)}
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E5E5E5] rounded-2xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#171717] mb-2">
              Section 6, 7 & 8: Verification, Affidavit & Annexures
            </h3>
            <pre className="p-3 bg-[#F9FAFB] rounded-xl text-[11px] overflow-auto max-h-48 border border-[#E5E5E5]">
              {JSON.stringify(
                {
                  verificationPlace: formData.verificationPlace,
                  verificationDate: formData.verificationDate,
                  affidavitDate: formData.affidavitDate,
                  annexures: formData.annexures,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* Tab: Full Court Preview */}
      {activeTab === 'preview' && (
        <div className="bg-[#F4F4F5] p-4 rounded-2xl border border-[#E5E5E5]">
          <DocumentPreview
            data={{ ...formData, language: formData.language || 'hi' }}
            onBackToEdit={() => setActiveTab('overview')}
          />
        </div>
      )}

      {/* Tab: Audit Activity History */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-[#171717] mb-3">Audit Log History for Case {c._id}</h2>
          <div className="space-y-3">
            {activity.length === 0 ? (
              <p className="text-xs text-[#737373]">No logged events for this case.</p>
            ) : (
              activity.map((act: any) => (
                <div key={act._id} className="text-xs p-3 bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#171717]">{act.action}</span>
                    <span className="text-[10px] text-[#737373] font-mono">
                      {new Date(act.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {act.metadata && (
                    <pre className="mt-1 text-[10px] text-[#737373] overflow-auto">
                      {JSON.stringify(act.metadata)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

