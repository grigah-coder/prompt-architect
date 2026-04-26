import React from 'react';

interface StepProgressBarProps {
  currentStage: number;
  questionsLeft: number;
}

export default function StepProgressBar({ currentStage, questionsLeft }: StepProgressBarProps) {
  const steps = [
    { label: 'Concept', stage: 1 },
    { label: 'Tech Stack', stage: 2 },
    { label: 'UI Style', stage: 3 },
    { label: 'Features', stage: 4 },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.stage} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step.stage <= currentStage
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {step.stage}
            </div>
            <span
              className={`ml-2 text-sm ${
                step.stage <= currentStage ? 'text-white' : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  step.stage < currentStage ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-sm mt-2">
        {questionsLeft} questions left
      </p>
    </div>
  );
}