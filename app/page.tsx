'use client';

import React, { useState, useEffect } from 'react';
import { ComplaintFormData, FormStep } from './types/complaint';
import { SAMPLE_FORM_DATA, EMPTY_FORM_DATA } from './lib/initialData';
import { validateStep } from './lib/validation';
import { Navbar } from './components/Navbar';
import { Stepper } from './components/Stepper';
import { FormControls } from './components/FormControls';
import { DocumentPreview } from './components/preview/DocumentPreview';

// Step components
import { Step1ProformaDetails } from './components/steps/Step1ProformaDetails';
import { Step2SynopsisEvents } from './components/steps/Step2SynopsisEvents';
import { Step3MemoOfParties } from './components/steps/Step3MemoOfParties';
import { Step4ComplaintBody } from './components/steps/Step4ComplaintBody';
import { Step5Prayer } from './components/steps/Step5Prayer';
import { Step6Verification } from './components/steps/Step6Verification';
import { Step7Affidavit } from './components/steps/Step7Affidavit';
import { Step8Annexures } from './components/steps/Step8Annexures';

const STORAGE_KEY = 'consumer_complaint_form_data';

export default function Home() {
  const [formData, setFormData] = useState<ComplaintFormData>(SAMPLE_FORM_DATA);
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<string>('Saved to localStorage');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        setSaveStatus('Restored from localStorage');
      }
    } catch (err) {
      console.warn('Could not read from localStorage:', err);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveStatus(`Saved at ${timeStr}`);
    } catch (err) {
      console.warn('Could not write to localStorage:', err);
      setSaveStatus('Storage full');
    }
  }, [formData, isMounted]);

  // Load sample data
  const handleLoadSample = () => {
    if (window.confirm('Load sample Consumer Complaint data (Insurance Death Claim proforma)? Any unsaved custom entries will be replaced.')) {
      setFormData(SAMPLE_FORM_DATA);
      setStepErrors({});
      setSaveStatus('Sample data loaded');
    }
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear the entire complaint form?')) {
      setFormData(EMPTY_FORM_DATA);
      setStepErrors({});
      setSaveStatus('Form reset');
      setCurrentStep(1);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    const validation = validateStep(currentStep, formData);
    if (!validation.isValid) {
      setStepErrors(validation.errors);
      return;
    }

    setStepErrors({});
    if (currentStep === 8) {
      setIsPreviewMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentStep((prev) => (prev + 1) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setStepErrors({});
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (step: FormStep) => {
    setStepErrors({});
    setCurrentStep(step);
    if (isPreviewMode) {
      setIsPreviewMode(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Legal Proforma Editor...</span>
        </div>
      </div>
    );
  }

  // Full Screen Preview Mode
  if (isPreviewMode) {
    return (
      <main className="min-h-screen bg-slate-200">
        <Navbar
          onLoadSample={handleLoadSample}
          onReset={handleReset}
          onTogglePreview={() => setIsPreviewMode(false)}
          isPreviewMode={true}
          saveStatus={saveStatus}
        />
        <DocumentPreview
          data={formData}
          onBackToEdit={() => setIsPreviewMode(false)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-100 pb-32 sm:pb-28">
      <Navbar
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onTogglePreview={() => setIsPreviewMode(true)}
        isPreviewMode={false}
        saveStatus={saveStatus}
      />

      <Stepper currentStep={currentStep} onStepClick={handleStepClick} />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6 flex-1">
        {/* Step error banner if validation fails */}
        {Object.keys(stepErrors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 shadow-xs">
            <svg
              className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h4 className="text-sm font-bold text-red-800">
                Please complete the required fields in this step
              </h4>
              <p className="text-xs text-red-600 mt-0.5">
                Review the highlighted inputs below before continuing to the next section.
              </p>
            </div>
          </div>
        )}

        {/* Step Content */}
        {currentStep === 1 && (
          <Step1ProformaDetails
            data={formData}
            updateData={setFormData}
            errors={stepErrors}
          />
        )}
        {currentStep === 2 && (
          <Step2SynopsisEvents
            data={formData}
            updateData={setFormData}
            errors={stepErrors}
          />
        )}
        {currentStep === 3 && (
          <Step3MemoOfParties
            data={formData}
            updateData={setFormData}
            errors={stepErrors}
          />
        )}
        {currentStep === 4 && (
          <Step4ComplaintBody
            data={formData}
            updateData={setFormData}
            errors={stepErrors}
          />
        )}
        {currentStep === 5 && (
          <Step5Prayer
            data={formData}
            updateData={setFormData}
            errors={stepErrors}
          />
        )}
        {currentStep === 6 && (
          <Step6Verification
            data={formData}
            updateData={setFormData}
            errors={stepErrors}
          />
        )}
        {currentStep === 7 && (
          <Step7Affidavit
            data={formData}
            updateData={setFormData}
            errors={stepErrors}
          />
        )}
        {currentStep === 8 && (
          <Step8Annexures
            data={formData}
            updateData={setFormData}
            errors={stepErrors}
          />
        )}

        <FormControls
          currentStep={currentStep}
          onPrev={handlePrev}
          onNext={handleNext}
          onPreview={() => setIsPreviewMode(true)}
        />
      </div>
    </main>
  );
}
