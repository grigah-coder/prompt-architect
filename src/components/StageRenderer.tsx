import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Globe, Smartphone, Monitor } from 'lucide-react';
import { InputCategory, AnswerMap, CompiledPrompt, QuestionType } from '../lib/schema';
import { filterByStage, QUESTIONS } from '../lib/questions';
import { compilePrompt } from '../lib/architect';
import TextInput from './questions/TextInput';
import SelectCard from './questions/SelectCard';
import SelectableCard from './SelectableCard';
import StepProgressBar from './StepProgressBar';

type State = {
  currentStage: 1 | 2 | 3;
  viewState: 'form' | 'results';
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
  | { type: 'SET_COMPILED'; prompt: CompiledPrompt | null }
  | { type: 'SET_CATEGORY'; category: InputCategory }
  | { type: 'SET_VIEW_STATE'; viewState: 'form' | 'results' }
  | { type: 'RESET' };

interface Props {
  stage: 1 | 2 | 3;
  state: State;
  dispatch: (action: Action) => void;
  shareSession: () => void;
}



export default function StageRenderer({ stage, state, dispatch, shareSession }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'json'>('prompt');

  useEffect(() => {
    if (stage === 3 && !state.compiledPrompt && !state.isCompiling) {
      dispatch({ type: 'COMPILE' });
      const prompt = compilePrompt(state.answers);
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

  // Get questions for current stage
  const questions = filterByStage(QUESTIONS, stage);
  const totalQuestions = QUESTIONS.length;
  const answeredQuestions = Object.keys(state.answers).filter(key => {
    const answer = state.answers[key];
    return Array.isArray(answer) ? answer.length > 0 : answer && answer.trim() !== '';
  }).length;
  const questionsLeft = totalQuestions - answeredQuestions;

  // Show questions for current stage (1-3)
  if (state.viewState === 'form') {
    const stageTitles = {
      1: 'Step 1: System Persona',
      2: 'Step 2: App Type',
      3: 'Step 3: Visual Identity'
    };

    // Special rendering for Step 3 with card grid
    if (stage === 3) {
      return (
        <div className="min-h-screen bg-black">
          <StepProgressBar currentStage={stage} questionsLeft={questionsLeft} />
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Step 3: Visual Identity</h1>

          <div className="max-w-6xl mx-auto px-4">
            {questions.map((question) => {
              const selectedValue = state.answers[question.id] as string;

              return (
                <div key={question.id} className="mb-12">
                  <h2 className="text-xl font-semibold text-white mb-6 text-center">{question.label}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {question.options?.map((option) => {
                      const isSelected = selectedValue === option.value;
                      return (
                        <motion.button
                          key={option.value}
                          onClick={() => handleAnswerChange(question.id, option.value)}
                          className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-900/20 text-emerald-300 ring-2 ring-emerald-400/50'
                              : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="text-center">
                            <div className="text-lg font-medium mb-2">{option.label}</div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 bg-emerald-400 rounded-full mx-auto"
                              />
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 max-w-6xl mx-auto px-4">
            {stage > 1 && (
              <button
                onClick={() => dispatch({ type: 'PREV_STAGE' })}
                className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (stage === 3) {
                  shareSession();
                  // Generate prompt and set view to results immediately
                  dispatch({ type: 'COMPILE' });
                  const prompt = compilePrompt(state.answers);
                  dispatch({ type: 'SET_COMPILED', prompt });
                  // Update view state to results
                  dispatch({ type: 'SET_VIEW_STATE', viewState: 'results' });
                } else {
                  dispatch({ type: 'NEXT_STAGE' });
                }
              }}
              className="btn-accent text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              {stage === 3 ? 'Share & Continue' : 'Next'}
            </button>
          </div>
        </div>
      );
    }

    // Default rendering for stages 1 and 2
    return (
      <div>
        <StepProgressBar currentStage={stage} questionsLeft={questionsLeft} />
        <h1 className="text-3xl font-bold text-white mb-8">{stageTitles[stage as keyof typeof stageTitles]}</h1>
        <div className="max-w-4xl mx-auto px-4">
          {questions.map((question) => {
            const value = state.answers[question.id];

            // For select-type questions, use card grid
            if (question.type === QuestionType.SELECT && question.options) {
              // Special handling for Step 2 (App Type) with icons
              const getAppTypeIcon = (value: string) => {
                switch (value) {
                  case 'Web App': return Globe;
                  case 'Mobile App': return Smartphone;
                  case 'Desktop': return Monitor;
                  default: return Globe;
                }
              };

              const getAppTypeDescription = (value: string) => {
                switch (value) {
                  case 'Web App': return 'Browser-based applications accessible from any device';
                  case 'Mobile App': return 'Native mobile applications for iOS and Android';
                  case 'Desktop': return 'Desktop software for Windows, macOS, and Linux';
                  default: return '';
                }
              };

              return (
                <div key={question.id} className="mb-12">
                  <h2 className="text-xl font-semibold text-white mb-6 text-center">{question.label}</h2>
                  <div className={`grid gap-4 ${stage === 2 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {question.options.map((option) => {
                      const isSelected = value === option.value;
                      const Icon = stage === 2 ? getAppTypeIcon(option.value) : undefined;
                      const description = stage === 2 ? getAppTypeDescription(option.value) : undefined;

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

            // For text inputs, use card-style container
            return (
              <div key={question.id} className="mb-12">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                    {question.type === QuestionType.TEXT || question.type === QuestionType.TEXTAREA ? (
                      <TextInput key={question.id} question={question} value={(value as string) || ''} onChange={(val) => handleAnswerChange(question.id, val)} />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          {stage > 1 && (
            <button
              onClick={() => dispatch({ type: 'PREV_STAGE' })}
              className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => dispatch({ type: 'NEXT_STAGE' })}
            className="btn-accent text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Show compiled result
  if (state.viewState === 'results') {
    return (
      <div>
        <StepProgressBar currentStage={4} questionsLeft={0} />
        <h1 className="text-3xl font-bold text-white mb-8">Generated Blueprint</h1>
        {state.isCompiling ? (
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl mx-auto">
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl mx-auto">
            <div className="mb-4">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'prompt' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Prompt
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'json' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  JSON
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
            onClick={() => {
              if (state.viewState === 'results') {
                // On results page, go back to form
                dispatch({ type: 'SET_VIEW_STATE', viewState: 'form' });
              } else {
                // On question pages, go to previous stage
                dispatch({ type: 'PREV_STAGE' });
              }
            }}
            className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Back
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
      </div>
    );
  }

  return null;
}