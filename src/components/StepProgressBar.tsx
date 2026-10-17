import React from 'react';
import { WizardStep, STEP_TITLES } from '../lib/schema';

interface StepProgressBarProps {
  currentStep: WizardStep;
  questionsLeft: number;
}

const STEP_ORDER: WizardStep[] = [
  WizardStep.PROJECT_IDENTITY,
  WizardStep.FUNCTIONAL_SPEC,
  WizardStep.PLATFORM_SELECTION,
  WizardStep.UI_UX_SPECS,
  WizardStep.PROMPT_OUTPUT,
];

export default function StepProgressBar({ currentStep, questionsLeft }: StepProgressBarProps) {
  const steps = STEP_ORDER.map(step => ({ label: STEP_TITLES[step], step }));

  return (
    <div className="mb-8 bg-slate-900/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-mono transition-all duration-300 ${
                step.step < currentStep
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : step.step === currentStep
                  ? 'bg-emerald-400 text-slate-900 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-400/30'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {step.step}
            </div>
            <span
              className={`ml-3 text-sm font-medium font-mono transition-colors duration-300 ${
                step.step < currentStep
                  ? 'text-emerald-300'
                  : step.step === currentStep
                  ? 'text-emerald-200'
                  : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-6 rounded-full transition-all duration-300 ${
                  step.step < currentStep
                    ? 'bg-emerald-500 shadow-sm shadow-emerald-500/25'
                    : step.step === currentStep
                    ? 'bg-emerald-400/60'
                    : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-sm mt-4 font-mono">
        {questionsLeft} items remaining
      </p>
    </div>
  );
}
