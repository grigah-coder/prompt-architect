'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StageRenderer from '../components/StageRenderer';
import { AnswerMap, InputCategory, CompiledPrompt } from '../lib/schema';

export default function Page() {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [viewState, setViewState] = useState<'form' | 'results'>('form');
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [activeCategory, setActiveCategory] = useState<InputCategory | null>(null);
  const [compiledPrompt, setCompiledPrompt] = useState<CompiledPrompt | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pa_answers', JSON.stringify(answers));
  }, [answers]);

  // Load answers from URL session param on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    if (sessionParam) {
      try {
        const loadedAnswers: AnswerMap = JSON.parse(atob(sessionParam));
        setAnswers(loadedAnswers);
      } catch (error) {
        console.warn('Failed to parse session from URL:', error);
      }
    }
  }, []);

  const setAnswer = (id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const nextStage = () => {
    if (currentStage < 3) {
      setCurrentStage((currentStage + 1) as 1 | 2 | 3);
    }
  };

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage((currentStage - 1) as 1 | 2 | 3);
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

  const setCategory = (category: InputCategory) => {
    setActiveCategory(category);
  };

  const reset = () => {
    setCurrentStage(1);
    setViewState('form');
    setAnswers({});
    setActiveCategory(null);
    setCompiledPrompt(null);
    setIsCompiling(false);
  };

  const shareSession = () => {
    const encoded = btoa(JSON.stringify(answers));
    const newUrl = `${window.location.pathname}?session=${encoded}`;
    window.history.replaceState(null, '', newUrl);
  };

  const state = {
    currentStage,
    viewState,
    answers,
    activeCategory,
    compiledPrompt,
    isCompiling,
  };

  const dispatch = (action: any) => {
    switch (action.type) {
      case 'SET_ANSWER':
        setAnswer(action.id, action.value);
        break;
      case 'NEXT_STAGE':
        nextStage();
        break;
      case 'PREV_STAGE':
        prevStage();
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
      case 'SET_CATEGORY':
        setCategory(action.category);
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
    <div className="relative min-h-screen bg-black overflow-hidden mesh-bg before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%20_20%,rgba(16,185,129,0.2),transparent_50%),radial-gradient(circle_at_70%20_80%,rgba(5,150,105,0.15),transparent_50%)] before:pointer-events-none">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <StageRenderer stage={currentStage} state={state} dispatch={dispatch} shareSession={shareSession} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}