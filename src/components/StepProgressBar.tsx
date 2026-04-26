import React from 'react';
import { QUESTIONS } from '../lib/questions';

interface StepProgressBarProps {
  currentStage: number;
  questionsLeft: number;
}

export default function StepProgressBar({ currentStage, questionsLeft }: StepProgressBarProps) {
  // Get unique stages from questions
  const stages = Array.from(new Set(QUESTIONS.map(q => q.stage))).sort();

  const getStageLabel = (stage: number) => {
    switch (stage) {
      case 1: return 'Project Details';
      case 2: return 'App Type';
      case 3: return 'Infrastructure';
      case 4: return 'Technical Details';
      default: return `Stage ${stage}`;
    }
  };

  const steps = stages.map(stage => ({ label: getStageLabel(stage), stage }));

  return (
    <div className="mb-8 bg-[#0a0a0a] p-4 rounded-lg">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.stage} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step.stage <= currentStage
                  ? 'bg-emerald-500 text-white'
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
                  step.stage < currentStage ? 'bg-emerald-500' : 'bg-slate-700'
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