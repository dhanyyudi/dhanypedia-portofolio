'use client';

import { CV_STEPS, STEP_ICONS } from '@/lib/constants/cv-steps';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export function CVStepIndicator({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-8">
      {CV_STEPS.map((step, index) => {
        const Icon = STEP_ICONS[step.icon];
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isClickable = isCompleted || step.id <= Math.max(...completedSteps, 0) + 1;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-2 transition-all ${
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white' 
                      : 'bg-[var(--background-secondary)] border-[var(--border-primary)] text-[var(--text-muted)]'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-xs font-medium text-center max-w-[80px] hidden sm:block ${
                  isCurrent 
                    ? 'text-[var(--accent-primary)]' 
                    : isCompleted 
                      ? 'text-green-600' 
                      : 'text-[var(--text-muted)]'
                }`}
              >
                {step.label}
              </span>
            </button>

            {/* Connector Line */}
            {index < CV_STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-12 mx-1 sm:mx-2 transition-all ${
                  completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-[var(--border-primary)]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
