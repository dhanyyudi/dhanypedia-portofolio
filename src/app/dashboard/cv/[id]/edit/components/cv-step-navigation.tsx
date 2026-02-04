'use client';

import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
  isSaving?: boolean;
}

export function CVStepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isLastStep,
  isSaving = false,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-primary)]">
      <button
        onClick={onBack}
        disabled={currentStep === 1}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          currentStep === 1
            ? 'opacity-50 cursor-not-allowed text-[var(--text-muted)]'
            : 'hover:bg-[var(--background-secondary)] text-[var(--text-primary)]'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <span className="text-sm text-[var(--text-muted)]">
        Step {currentStep} of {totalSteps}
      </span>

      <button
        onClick={onNext}
        disabled={isSaving}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-medium ${
          isLastStep
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-[var(--accent-primary)] hover:opacity-90 text-white'
        }`}
      >
        {isSaving ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Saving...
          </>
        ) : isLastStep ? (
          <>
            <Save className="w-4 h-4" />
            Save & Finish
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
