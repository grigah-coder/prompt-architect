import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download } from 'lucide-react';
import { InputCategory, AnswerMap, CompiledPrompt, QuestionType } from '../lib/schema';
import { filterByStage, QUESTIONS } from '../lib/questions';
import { compilePrompt } from '../lib/compiler';
import TextInput from './questions/TextInput';
import SelectCard from './questions/SelectCard';
import StepProgressBar from './StepProgressBar';
import { normalizeAnswers } from '../lib/schema';

type State = {
  currentStage: 1 | 2 | 3 | 4;
  answers: AnswerMap;
  activeCategory: InputCategory | null;
  compiledPrompt: CompiledPrompt | null;
  isCompiling: boolean;
};

type Action =
  | { type: 'SET_ANSWER'; id: string; value: string | string[] }
  | { type: 'NEXT_STAGE' }
  | { type: 'PREV_STAGE' }
  | { type: 'COMPILE' }
  | { type: 'SET_COMPILING'; compiling: boolean }
  | { type: 'SET_COMPILED'; prompt: CompiledPrompt }
  | { type: 'SET_CATEGORY'; category: InputCategory }
  | { type: 'RESET' };

interface Props {
  stage: 1 | 2 | 3 | 4;
  state: State;
  dispatch: (action: Action) => void;
  shareSession: () => void;
}



export default function StageRenderer({ stage, state, dispatch, shareSession }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'json'>('prompt');
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useEffect(() => {
    if (stage === 4 && !state.compiledPrompt && !state.isCompiling) {
      dispatch({ type: 'COMPILE' });
      const normalized = normalizeAnswers(state.answers);
      const prompt = compilePrompt(normalized);
      dispatch({ type: 'SET_COMPILED', prompt });
    }
  }, [stage, state.compiledPrompt, state.isCompiling, state.answers, dispatch]);

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
      const blob = new Blob([state.compiledPrompt.systemPrompt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blueprint.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (stage === 1) {
    const questions = filterByStage(QUESTIONS, 1);
    const visibleQuestions = questions;
    const totalQuestions = QUESTIONS.length;
    const answeredQuestions = Object.keys(state.answers).filter(key => {
      const answer = state.answers[key];
      return Array.isArray(answer) ? answer.length > 0 : answer && answer.trim() !== '';
    }).length;
    const questionsLeft = totalQuestions - answeredQuestions;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <StepProgressBar currentStage={stage} questionsLeft={questionsLeft} />
        <h1 className="text-3xl font-bold text-white mb-8">System Persona</h1>
        <div className="glass-card rounded-2xl p-6 w-full max-w-2xl mx-auto mb-6">
          {visibleQuestions.map((question) => {
            const value = state.answers[question.id];
            switch (question.type) {
              case QuestionType.TEXT:
              case QuestionType.TEXTAREA:
                return <TextInput key={question.id} question={question} value={(value as string) || ''} onChange={(val) => handleAnswerChange(question.id, val)} />;
              case QuestionType.SELECT:
                return <SelectCard key={question.id} question={question} value={(value as string) || ''} onChange={(val) => handleAnswerChange(question.id, val)} />;
              default:
                return null;
            }
          })}
        </div>
        <button
          onClick={() => dispatch({ type: 'NEXT_STAGE' })}
          className="btn-accent text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Next
        </button>
      </motion.div>
    );
  }

  if (stage >= 2 && stage <= 3) {
    const questions = filterByStage(QUESTIONS, stage);
    const visibleQuestions = questions;
    const totalQuestions = QUESTIONS.length;
    const answeredQuestions = Object.keys(state.answers).filter(key => {
      const answer = state.answers[key];
      return Array.isArray(answer) ? answer.length > 0 : answer && answer.trim() !== '';
    }).length;
    const questionsLeft = totalQuestions - answeredQuestions;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <StepProgressBar currentStage={stage} questionsLeft={questionsLeft} />
        <h1 className="text-3xl font-bold text-white mb-8">
          {stage === 2 ? 'App Type' : stage === 3 ? 'Infrastructure' : 'Technical Details'}
        </h1>
        <div className="glass-card rounded-2xl p-6 w-full max-w-2xl mx-auto">
          {visibleQuestions.map((question) => {
            const value = state.answers[question.id];
            switch (question.type) {
              case QuestionType.TEXT:
              case QuestionType.TEXTAREA:
                return <TextInput key={question.id} question={question} value={(value as string) || ''} onChange={(val) => handleAnswerChange(question.id, val)} />;
              case QuestionType.SELECT:
                return <SelectCard key={question.id} question={question} value={(value as string) || ''} onChange={(val) => handleAnswerChange(question.id, val)} />;
              default:
                return null;
            }
          })}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <button
            onClick={() => dispatch({ type: 'PREV_STAGE' })}
            className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (stage === 3) {
                setShowSummaryModal(true);
              } else if (stage === 4) {
                dispatch({ type: 'COMPILE' });
                const normalized = normalizeAnswers(state.answers);
                const prompt = compilePrompt(normalized);
                dispatch({ type: 'SET_COMPILED', prompt });
              } else {
                dispatch({ type: 'NEXT_STAGE' });
              }
            }}
            className="btn-accent text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            {stage === 4 ? 'Generate Blueprint' : stage === 3 ? 'Generate Blueprint' : 'Next'}
          </button>
        </div>
      </motion.div>
    );
  }

  // Summary modal for stage 3
  if (showSummaryModal && stage === 3) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Review Your Answers</h2>
          <div className="space-y-4 mb-6">
            {Object.entries(state.answers).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start p-3 bg-white/5 rounded-lg">
                <span className="text-white/80 font-medium capitalize mr-4">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="text-white text-right">
                  {Array.isArray(value) ? value.join(', ') : value || 'Not specified'}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowSummaryModal(false)}
              className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowSummaryModal(false);
                dispatch({ type: 'NEXT_STAGE' });
              }}
              className="btn-accent text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Confirm & Generate Blueprint
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (stage === 4 && state.compiledPrompt) {
    const totalQuestions = QUESTIONS.length;
    const answeredQuestions = Object.keys(state.answers).filter(key => {
      const answer = state.answers[key];
      return Array.isArray(answer) ? answer.length > 0 : answer && answer.trim() !== '';
    }).length;
    const questionsLeft = totalQuestions - answeredQuestions;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <StepProgressBar currentStage={4} questionsLeft={questionsLeft} />
        <h1 className="text-3xl font-bold text-white mb-8">Technical Blueprint</h1>
        {state.isCompiling ? (
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl mx-auto">
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ) : state.compiledPrompt ? (
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl mx-auto">
            <div className="mb-4">
              <h2 className="text-xl text-white mb-4">Generated Output</h2>
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'prompt'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                    }`}
                >
                  Prompt
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'json'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                    }`}
                >
                  JSON
                </button>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200'}`}
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
                <pre>
                  {state.compiledPrompt.systemPrompt}
                </pre>
              ) : (
                <pre>
                  {JSON.stringify(state.compiledPrompt.metaJSON, null, 2)}
                </pre>
              )}
            </div>

          </div>
        ) : null}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <button
            onClick={() => dispatch({ type: 'PREV_STAGE' })}
            className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Refine
          </button>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={shareSession}
              className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
            >
              Share
            </button>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}