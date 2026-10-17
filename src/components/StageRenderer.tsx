'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Globe, Smartphone, Monitor } from 'lucide-react';
import { WizardStep, AnswerMap, CompiledPrompt, QuestionType, STEP_HINTS, STEP_TITLES } from '../lib/schema';
import { filterByStage, QUESTIONS } from '../lib/questions';
import { compilePrompt } from '../lib/architect';
import TextInput from './questions/TextInput';
import SelectCard from './questions/SelectCard';
import SelectableCard from './SelectableCard';
import StepProgressBar from './StepProgressBar';

type WizardState = {
  currentStep: WizardStep;
  viewState: 'form' | 'results';
  answers: AnswerMap;
  compiledPrompt: CompiledPrompt | null;
  isCompiling: boolean;
};

type Action =
  | { type: 'SET_ANSWER'; id: string; value: string | string[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'COMPILE' }
  | { type: 'SET_COMPILING'; compiling: boolean }
  | { type: 'SET_COMPILED'; prompt: CompiledPrompt | null }
  | { type: 'SET_VIEW_STATE'; viewState: 'form' | 'results' }
  | { type: 'RESET' };

interface Props {
  step: WizardStep;
  state: WizardState;
  dispatch: (action: Action) => void;
}

const PLATFORM_ICONS: Record<string, any> = {
  'Web App': Globe,
  'Mobile App': Smartphone,
  'Desktop': Monitor,
};

const PLATFORM_DESCRIPTIONS: Record<string, string> = {
  'Web App': 'Browser-based applications accessible from any device',
  'Mobile App': 'Native mobile applications for iOS and Android',
  'Desktop': 'Desktop software for Windows, macOS, and Linux',
};

export default function StageRenderer({ step, state, dispatch }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'meta'>('prompt');

  useEffect(() => {
    if (step === WizardStep.PROMPT_OUTPUT && !state.compiledPrompt && !state.isCompiling) {
      dispatch({ type: 'COMPILE' });
      const prompt = compilePrompt(state.answers);
      dispatch({ type: 'SET_COMPILED', prompt });
    }
  }, [step, state.compiledPrompt, state.isCompiling, state.answers, dispatch]);

  const handleAnswerChange = (id: string, value: string | string[]) => {
    dispatch({ type: 'SET_ANSWER', id, value });
  };

  const copyToClipboard = async () => {
    if (state.compiledPrompt) {
      await navigator.clipboard.writeText(state.compiledPrompt.systemPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportAsTxt = () => {
    if (state.compiledPrompt) {
      const blob = new Blob([state.compiledPrompt.systemPrompt], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prompt-blueprint.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const stepQuestions = filterByStage(QUESTIONS, step);
  const totalQuestions = QUESTIONS.length;
  const answeredQuestions = Object.keys(state.answers).filter(key => {
    const answer = state.answers[key];
    return Array.isArray(answer) ? answer.length > 0 : answer && String(answer).trim() !== '';
  }).length;
  const questionsLeft = Math.max(0, totalQuestions - answeredQuestions);

  const requiredUnanswered = stepQuestions
    .filter(q => q.required)
    .filter(q => {
      const v = state.answers[q.id];
      return Array.isArray(v) ? v.length === 0 : !v || String(v).trim() === '';
    });

  const canNext = requiredUnanswered.length === 0;

  const renderQuestion = (question: any) => {
    const value = state.answers[question.id];

    if (question.type === QuestionType.SELECT && question.options) {
      if (step === WizardStep.PLATFORM_SELECTION && question.id === 'target_platform') {
        return (
          <div key={question.id} className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">{question.label}</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
              {question.options.map((option: any) => {
                const isSelected = value === option.value;
                const Icon = PLATFORM_ICONS[option.value] || Globe;
                const description = PLATFORM_DESCRIPTIONS[option.value];

                return (
                  <SelectableCard
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    isSelected={isSelected}
                    onClick={() => handleAnswerChange(question.id, option.value)}
                    icon={Icon}
                    description={description}
                  />
                );
              })}
            </div>
          </div>
        );
      }

      return (
        <div key={question.id} className="mb-8">
          <div className="max-w-4xl mx-auto">
            <SelectCard question={question} value={String(value || '')} onChange={(val) => handleAnswerChange(question.id, val)} />
          </div>
        </div>
      );
    }

    return (
      <div key={question.id} className="mb-8">
        <div className="max-w-4xl mx-auto">
          <TextInput question={question} value={String(value || '')} onChange={(val) => handleAnswerChange(question.id, val)} />
        </div>
      </div>
    );
  };

  // Results / Export Prompt view
  if (step === WizardStep.PROMPT_OUTPUT || state.viewState === 'results') {
    return (
      <div>
        <StepProgressBar currentStep={step} questionsLeft={0} />
        <h1 className="text-3xl font-bold text-white mb-8">{STEP_TITLES[step]}</h1>
        <p className="text-slate-400 text-center mb-6">{STEP_HINTS[step]}</p>
        {state.isCompiling || !state.compiledPrompt ? (
          <div className="glass-card rounded-2xl p-6 w-full max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 w-full max-w-4xl mx-auto">
            <div className="mb-4">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'prompt' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  System Prompt
                </button>
                <button
                  onClick={() => setActiveTab('meta')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'meta' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Meta
                </button>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg transition-colors ${
                    copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {copied ? <span>Copied!</span> : <Copy size={16} />}
                </button>
                <button
                  onClick={exportAsTxt}
                  className="p-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 text-slate-200 transition-colors"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            <div className="code-editor">
              {activeTab === 'prompt' ? (
                <pre>{state.compiledPrompt?.systemPrompt}</pre>
              ) : (
                <pre>{state.compiledPrompt ? JSON.stringify(state.compiledPrompt.metaJSON, null, 2) : ''}</pre>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <button
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Back to UI/UX Specs
          </button>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const encoded = btoa(JSON.stringify(state.answers));
                const newUrl = `${window.location.pathname}?session=${encoded}`;
                window.history.replaceState(null, '', newUrl);
                navigator.clipboard.writeText(window.location.href);
              }}
              className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
            >
              Copy Share Link
            </button>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form view for steps 1-4
  return (
    <div>
      <StepProgressBar currentStep={step} questionsLeft={questionsLeft} />
      <h1 className="text-3xl font-bold text-white mb-4 text-center">{STEP_TITLES[step]}</h1>
      <p className="text-slate-400 text-center mb-8 max-w-3xl mx-auto">{STEP_HINTS[step]}</p>

      <div className="max-w-6xl mx-auto px-4">
        {stepQuestions.map((question) => renderQuestion(question))}
      </div>

      {stepQuestions.length === 0 && (
        <div className="glass-card rounded-2xl p-6 w-full max-w-4xl mx-auto text-center">
          <p className="text-slate-300">No additional questions for this step.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 max-w-6xl mx-auto px-4">
        {step > WizardStep.PROJECT_IDENTITY && (
          <button
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
          disabled={!canNext}
          className={`px-8 py-3 rounded-xl transition-opacity ${
            canNext ? 'btn-accent text-white hover:opacity-90' : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          {step === WizardStep.UI_UX_SPECS ? 'Export Prompt' : 'Next'}
        </button>
      </div>
    </div>
  );
}
