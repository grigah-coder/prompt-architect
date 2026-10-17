'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StageRenderer from '../components/StageRenderer';
import { WizardStep, AnswerMap, CompiledPrompt } from '../lib/schema';
import { getDefaultAnswers } from '../lib/questions';

const loadAnswersFromUrl = (): AnswerMap => {
  if (typeof window === 'undefined') return {};
  const sessionParam = new URLSearchParams(window.location.search).get('session');
  if (!sessionParam) return {};
  try {
    return JSON.parse(atob(sessionParam));
  } catch (error) {
    console.warn('Failed to parse session from URL:', error);
    return {};
  }
};

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

export default function Page() {
  console.log('Page component rendered');
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.PROJECT_IDENTITY);
  const [viewState, setViewState] = useState<'form' | 'results'>('form');
  const [answers, setAnswers] = useState<AnswerMap>(() => ({
    ...getDefaultAnswers(),
    ...loadAnswersFromUrl(),
  }));
  const [compiledPrompt, setCompiledPrompt] = useState<CompiledPrompt | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pa_answers', JSON.stringify(answers));
  }, [answers]);

  const setAnswer = (id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    if (currentStep < WizardStep.PROMPT_OUTPUT) {
      const next = (currentStep + 1) as WizardStep;
      setCurrentStep(next);
      if (next === WizardStep.PROMPT_OUTPUT) {
        setViewState('results');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > WizardStep.PROJECT_IDENTITY) {
      const prev = (currentStep - 1) as WizardStep;
      setCurrentStep(prev);
      setViewState('form');
    }
  };

  const startCompile = () => {
    setIsCompiling(true);
  };

  const setCompiling = (compiling: boolean) => {
    setIsCompiling(compiling);
  };

  const setCompiled = (prompt: CompiledPrompt | null) => {
    setCompiledPrompt(prompt);
    setIsCompiling(false);
  };

  const reset = () => {
    setCurrentStep(WizardStep.PROJECT_IDENTITY);
    setViewState('form');
    setAnswers(getDefaultAnswers());
    setCompiledPrompt(null);
    setIsCompiling(false);
  };

  const state: WizardState = {
    currentStep,
    viewState,
    answers,
    compiledPrompt,
    isCompiling,
  };

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'SET_ANSWER':
        setAnswer(action.id, action.value);
        break;
      case 'NEXT_STEP':
        nextStep();
        break;
      case 'PREV_STEP':
        prevStep();
        break;
      case 'COMPILE':
        startCompile();
        break;
      case 'SET_COMPILING':
        setCompiling(action.compiling);
        break;
      case 'SET_COMPILED':
        setCompiled(action.prompt);
        break;
      case 'SET_VIEW_STATE':
        setViewState(action.viewState);
        break;
      case 'RESET':
        reset();
        break;
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden mesh-bg before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.2),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.15),transparent_50%)] before:pointer-events-none">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <StageRenderer step={currentStep} state={state} dispatch={dispatch} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
