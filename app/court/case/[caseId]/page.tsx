'use client';

import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { ComplaintFormData, FormStep } from '@/app/types/complaint';
import { getEmptyFormData, getSampleFormData } from '@/app/lib/initialData';
import { validateStep } from '@/app/lib/validation';
import { AppLanguage, TRANSLATIONS } from '@/app/lib/translations';
import { LanguageProvider } from '@/app/context/LanguageContext';
import { Stepper } from '@/app/components/Stepper';
import { FormControls } from '@/app/components/FormControls';
import { DocumentPreview } from '@/app/components/preview/DocumentPreview';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { exportToDocx } from '@/app/lib/docxExport';
import { Icons } from '@/app/components/ui/Icons';
import {
  Scale,
  ArrowLeft,
  Download,
  Eye,
  Save,
  CheckCircle2,
  Clock,
  AlertCircle,
  Languages,
} from 'lucide-react';

// Steps
import { Step1ProformaDetails } from '@/app/components/steps/Step1ProformaDetails';
import { Step2SynopsisEvents } from '@/app/components/steps/Step2SynopsisEvents';
import { Step3MemoOfParties } from '@/app/components/steps/Step3MemoOfParties';
import { Step4ComplaintBody } from '@/app/components/steps/Step4ComplaintBody';
import { Step5Prayer } from '@/app/components/steps/Step5Prayer';
import { Step6Verification } from '@/app/components/steps/Step6Verification';
import { Step7Affidavit } from '@/app/components/steps/Step7Affidavit';
import { Step8Annexures } from '@/app/components/steps/Step8Annexures';

interface CaseEditorPageProps {
  params: Promise<{ caseId: string }>;
}

export default function CaseEditorPage({ params }: CaseEditorPageProps) {
  const { caseId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  // Parse step from URL query parameter
  const stepParam = parseInt(searchParams.get('step') || '1', 10);
  const initialStep: FormStep = (stepParam >= 1 && stepParam <= 8 ? stepParam : 1) as FormStep;

  const [currentStep, setCurrentStep] = useState<FormStep>(initialStep);
  const [formData, setFormData] = useState<ComplaintFormData>(() => getEmptyFormData('hi'));
  const [caseTitle, setCaseTitle] = useState('Consumer Complaint');
  const [language, setLanguage] = useState<AppLanguage>('hi');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isDemoFilled, setIsDemoFilled] = useState<boolean>(false);

  // Saving states: 'idle' | 'saving' | 'saved' | 'error'
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [loadingCase, setLoadingCase] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  // Sync step changes to URL query parameter without full reload
  const navigateToStep = useCallback(
    (step: FormStep) => {
      setCurrentStep(step);
      setStepErrors({});
      const url = new URL(window.location.href);
      url.searchParams.set('step', String(step));
      window.history.replaceState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  // Respond to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const s = parseInt(url.searchParams.get('step') || '1', 10);
      if (s >= 1 && s <= 8) {
        setCurrentStep(s as FormStep);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/court/case/${caseId}?step=${currentStep}`);
    }
  }, [user, authLoading, router, caseId, currentStep]);

  // Load case from MongoDB
  useEffect(() => {
    if (!user) return;

    const fetchCase = async () => {
      try {
        setLoadingCase(true);
        const res = await fetch(`/api/cases/${caseId}`);
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error('Access denied: You do not own this case');
          }
          if (res.status === 404) {
            throw new Error('Case document not found in database');
          }
          throw new Error('Failed to retrieve case');
        }

        const data = await res.json();
        const caseRecord = data.case;

        if (caseRecord) {
          setCaseTitle(caseRecord.caseTitle || 'Consumer Complaint');
          if (caseRecord.formData && Object.keys(caseRecord.formData).length > 0) {
            const loaded = caseRecord.formData as ComplaintFormData;
            if (loaded.language) {
              setLanguage(loaded.language);
            }
            setFormData(loaded);
          }
          if (caseRecord.lastSavedAt) {
            setLastSavedTime(new Date(caseRecord.lastSavedAt));
            setSaveStatus('saved');
          }
        }
      } catch (err: any) {
        console.error('Case loading error:', err);
        setLoadError(err.message || 'Error loading case');
      } finally {
        setLoadingCase(false);
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 500);
      }
    };

    fetchCase();
  }, [caseId, user]);

  // Save case to MongoDB
  const saveToDatabase = useCallback(
    async (currentFormData: ComplaintFormData, stepToSave: FormStep) => {
      setSaveStatus('saving');
      try {
        const res = await fetch(`/api/cases/${caseId}/save`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: currentFormData,
            currentStep: stepToSave,
          }),
        });

        if (!res.ok) {
          throw new Error('Server returned save failure');
        }

        const data = await res.json();
        setSaveStatus('saved');
        setLastSavedTime(new Date(data.lastSavedAt || Date.now()));

        // Also save locally as safety buffer
        try {
          localStorage.setItem(`case_${caseId}_backup`, JSON.stringify(currentFormData));
        } catch {}
      } catch (err) {
        console.error('Autosave failure:', err);
        setSaveStatus('error');
      }
    },
    [caseId]
  );

  // Debounced Autosave (1000ms) on text changes
  useEffect(() => {
    if (isInitialLoadRef.current || loadingCase) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setSaveStatus('saving');

    debounceTimerRef.current = setTimeout(() => {
      saveToDatabase(formData, currentStep);
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData, currentStep, saveToDatabase, loadingCase]);

  // Explicit Save Draft handler
  const handleManualSave = async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    await saveToDatabase(formData, currentStep);
  };

  const handleNext = async () => {
    const validation = validateStep(currentStep, formData);
    if (!validation.isValid) {
      setStepErrors(validation.errors);
      return;
    }
    setStepErrors({});
    await saveToDatabase(formData, currentStep);

    if (currentStep === 8) {
      setIsPreviewMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateToStep((currentStep + 1) as FormStep);
    }
  };

  const handlePrev = () => {
    setStepErrors({});
    if (currentStep > 1) {
      navigateToStep((currentStep - 1) as FormStep);
    }
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    try {
      const filename = `Consumer_Complaint_${formData.caseDetails.category || 'Complaint'}_${caseId}.docx`;
      await exportToDocx(formData, filename);
    } catch (err) {
      console.error(err);
      alert(language === 'en' ? 'Failed to generate Word document.' : 'वर्ड दस्तावेज बनाने में त्रुटि हुई।');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleToggleDemo = () => {
    if (isDemoFilled) {
      setFormData(getEmptyFormData(language));
      setIsDemoFilled(false);
    } else {
      setFormData(getSampleFormData(language));
      setIsDemoFilled(true);
    }
  };

  const handleLanguageChange = (newLang: AppLanguage) => {
    setLanguage(newLang);
    setFormData((prev) => ({ ...prev, language: newLang }));
    localStorage.setItem('consumer_complaint_lang', newLang);
  };

  if (loadingCase || authLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-xs text-[#737373]">
          <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
          <span>Loading case from MongoDB...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
        <div className="p-8 bg-white border border-[#E5E5E5] rounded-2xl shadow-sm max-w-md text-center">
          <AlertCircle size={32} className="mx-auto text-red-600 mb-3" />
          <h2 className="text-base font-bold text-[#171717]">Unable to load case</h2>
          <p className="text-xs text-[#737373] mt-2">{loadError}</p>
          <Link
            href="/court/dashboard"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // Full Screen Preview Mode
  if (isPreviewMode) {
    return (
      <main className="min-h-screen bg-[#F9FAFB]">
        <div className="bg-white border-b border-[#E5E5E5] px-4 py-3 sticky top-0 z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-semibold hover:bg-[#F9FAFB] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Form Editor</span>
            </button>
            <span className="text-xs text-[#737373] font-mono">Case ID: {caseId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-semibold bg-white hover:bg-[#F9FAFB] transition-colors"
            >
              <Download size={14} className="text-blue-600" />
              <span>Download Word (.docx)</span>
            </button>
          </div>
        </div>

        <DocumentPreview
          data={{ ...formData, language }}
          onBackToEdit={() => setIsPreviewMode(false)}
        />
      </main>
    );
  }

  return (
    <LanguageProvider initialLanguage={language} onLanguageChange={handleLanguageChange}>
      <div className="min-h-screen flex flex-col bg-[#F9FAFB] pb-28 sm:pb-24">
        {/* Case Editor Top Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5] shadow-xs">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
            {/* Left: Back to Dashboard & Case Info */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/court/dashboard"
                className="p-1.5 rounded-lg border border-[#E5E5E5] hover:bg-[#F9FAFB] text-[#737373] hover:text-[#171717] transition-colors shrink-0"
                title="Back to Dashboard"
              >
                <ArrowLeft size={16} />
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-[#171717] truncate">
                    {caseTitle}
                  </h1>
                  <span className="hidden sm:inline-block text-[10px] font-mono text-[#737373] bg-[#F9FAFB] px-1.5 py-0.5 rounded border border-[#E5E5E5]">
                    {caseId}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Autosave Status, Language, Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Save Status Telemetry Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-[#E5E5E5] bg-[#F9FAFB]">
                {saveStatus === 'saving' && (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                    <span className="text-[#737373]">Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span className="text-[#171717] font-semibold">
                      {lastSavedTime ? 'Saved just now' : 'Data Saved'}
                    </span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertCircle size={13} className="text-red-600" />
                    <button
                      type="button"
                      onClick={handleManualSave}
                      className="text-red-700 underline font-semibold"
                    >
                      Save failed — Retry
                    </button>
                  </>
                )}
                {saveStatus === 'idle' && (
                  <>
                    <Clock size={13} className="text-[#737373]" />
                    <span className="text-[#737373]">Ready</span>
                  </>
                )}
              </div>

              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => handleLanguageChange(language === 'hi' ? 'en' : 'hi')}
                className="h-8.5 px-2.5 rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#171717] transition-colors cursor-pointer"
                title="Switch English / Hindi"
              >
                {language === 'hi' ? 'हिन्दी' : 'English'}
              </button>

              {/* Word Export Button */}
              <button
                type="button"
                onClick={handleDownloadDocx}
                disabled={isExportingDocx}
                className="hidden md:flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#171717] transition-all cursor-pointer"
                title="Download editable Microsoft Word (.docx)"
              >
                <Download size={13} className="text-blue-600" />
                <span>Word (.docx)</span>
              </button>

              {/* Preview Button */}
              <button
                type="button"
                onClick={() => setIsPreviewMode(true)}
                className="flex items-center gap-1.5 h-8.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <Eye size={13} />
                <span>Preview PDF</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stepper Navigation (1 to 8) */}
        <Stepper
          currentStep={currentStep}
          onStepClick={navigateToStep}
          language={language}
        />

        {/* Workspace Canvas */}
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 pt-5 sm:pt-6 flex-1 min-w-0">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Left Column: Admin Case Telemetry Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28">
              <AdminSidebar
                currentStep={currentStep}
                onStepClick={navigateToStep}
                formData={formData}
                language={language}
                onDownloadDocx={handleDownloadDocx}
                onPreview={() => setIsPreviewMode(true)}
                isExportingDocx={isExportingDocx}
              />
            </aside>

            {/* Right Column: Step Content */}
            <div className="lg:col-span-8 xl:col-span-9 min-w-0">
              {/* Context breadcrumb strip */}
              <div className="mb-4 flex items-center justify-between gap-3 text-xs text-[#737373] pb-2.5 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-2 truncate">
                  <Link href="/court/dashboard" className="hover:text-[#171717]">
                    Dashboard
                  </Link>
                  <span>/</span>
                  <span className="truncate">{caseTitle}</span>
                  <span>/</span>
                  <span className="font-semibold text-[#171717]">
                    Step {currentStep} of 8
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    {language === 'hi' ? 'हिंदी टाइपिंग सक्रिय' : 'English Input Active'}
                  </span>
                </div>
              </div>

              {/* Validation errors banner if any */}
              {Object.keys(stepErrors).length > 0 && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
                  <Icons.AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Please review required fields</h4>
                    <p className="text-red-700 mt-0.5">
                      Ensure all highlighted mandatory statutory entries are completed.
                    </p>
                  </div>
                </div>
              )}

              {/* Active Step Component */}
              {currentStep === 1 && (
                <Step1ProformaDetails
                  data={{ ...formData, language }}
                  updateData={setFormData}
                  errors={stepErrors}
                />
              )}
              {currentStep === 2 && (
                <Step2SynopsisEvents
                  data={{ ...formData, language }}
                  updateData={setFormData}
                  errors={stepErrors}
                />
              )}
              {currentStep === 3 && (
                <Step3MemoOfParties
                  data={{ ...formData, language }}
                  updateData={setFormData}
                  errors={stepErrors}
                />
              )}
              {currentStep === 4 && (
                <Step4ComplaintBody
                  data={{ ...formData, language }}
                  updateData={setFormData}
                  errors={stepErrors}
                />
              )}
              {currentStep === 5 && (
                <Step5Prayer
                  data={{ ...formData, language }}
                  updateData={setFormData}
                  errors={stepErrors}
                  onNavigateStep={navigateToStep}
                />
              )}
              {currentStep === 6 && (
                <Step6Verification
                  data={{ ...formData, language }}
                  updateData={setFormData}
                  errors={stepErrors}
                />
              )}
              {currentStep === 7 && (
                <Step7Affidavit
                  data={{ ...formData, language }}
                  updateData={setFormData}
                  errors={stepErrors}
                />
              )}
              {currentStep === 8 && (
                <Step8Annexures
                  data={{ ...formData, language }}
                  updateData={setFormData}
                  errors={stepErrors}
                />
              )}

              {/* Sticky Bottom Form Controls */}
              <FormControls
                currentStep={currentStep}
                onPrev={handlePrev}
                onNext={handleNext}
                onPreview={() => setIsPreviewMode(true)}
                onDownloadDocx={handleDownloadDocx}
                isExportingDocx={isExportingDocx}
                language={language}
              />
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}
