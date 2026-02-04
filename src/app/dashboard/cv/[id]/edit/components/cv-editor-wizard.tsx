'use client';

import { useState, useEffect, useCallback } from 'react';
import { JSONResume } from '@/types/resume';
import { CV_STEPS } from '@/lib/constants/cv-steps';
import { useDebounce } from '@/hooks/use-debounce';
import { CVStepIndicator } from './cv-step-indicator';
import { CVStepNavigation } from './cv-step-navigation';
import { PersonalStep } from './steps/personal-step';
import { ProfessionalStep } from './steps/professional-step';
import { EducationStep } from './steps/education-step';
import { OrganizationalStep } from './steps/organizational-step';
import { OthersStep } from './steps/others-step';
import { ReviewStep } from './steps/review-step';
import { CVLivePreview } from './cv-live-preview';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

interface CVEditorWizardProps {
  resumeId: string;
  initialData: JSONResume;
  initialIsPublic: boolean;
  slug: string;
  title: string;
}

export function CVEditorWizard({ resumeId, initialData, initialIsPublic, slug, title }: CVEditorWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [data, setData] = useState<JSONResume>(initialData);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const debouncedData = useDebounce(data, 1500);

  // Auto-save when debounced data changes
  useEffect(() => {
    if (hasChanges) {
      saveResume(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedData]);

  const saveResume = useCallback(async (showToast = true) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/cv/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: data,
          is_public: isPublic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save failed:', response.status, errorData);
        throw new Error(errorData.error || `Failed to save (${response.status})`);
      }
      setHasChanges(false);
      if (showToast) toast.success('Resume saved!');
    } catch (error) {
      console.error('Save error:', error);
      if (showToast) toast.error(error instanceof Error ? error.message : 'Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  }, [resumeId, title, data, isPublic]);

  const updateData = <K extends keyof JSONResume>(key: K, value: JSONResume[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = async () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    if (currentStep === CV_STEPS.length) {
      // Final save and redirect
      await saveResume(true);
      router.push('/dashboard/cv');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleTogglePublic = () => {
    setIsPublic(prev => !prev);
    setHasChanges(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalStep data={data} updateData={updateData} />;
      case 2:
        return <ProfessionalStep data={data} updateData={updateData} />;
      case 3:
        return <EducationStep data={data} updateData={updateData} />;
      case 4:
        return <OrganizationalStep data={data} updateData={updateData} />;
      case 5:
        return <OthersStep data={data} updateData={updateData} />;
      case 6:
        return <ReviewStep data={data} isPublic={isPublic} onTogglePublic={handleTogglePublic} slug={slug} resumeId={resumeId} resumeTitle={title} />;
      default:
        return <PersonalStep data={data} updateData={updateData} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Auto-save indicator */}
      {hasChanges && (
        <div className="fixed top-4 right-4 flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-3 py-1.5 rounded-full text-sm z-40">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          Unsaved changes
        </div>
      )}

      {/* Preview Button */}
      <button
        onClick={() => setShowPreview(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all z-40"
      >
        <Eye className="w-5 h-5" />
        Preview
      </button>

      {/* Live Preview Modal */}
      <CVLivePreview data={data} isOpen={showPreview} onClose={() => setShowPreview(false)} />

      {/* Step Indicator */}
      <CVStepIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
      <div className="bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-xl p-6 md:p-8">
        {renderStep()}

        {/* Navigation */}
        <CVStepNavigation
          currentStep={currentStep}
          totalSteps={CV_STEPS.length}
          onBack={handleBack}
          onNext={handleNext}
          isLastStep={currentStep === CV_STEPS.length}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
