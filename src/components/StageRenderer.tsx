import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download } from 'lucide-react';
import { InputCategory, AnswerMap, CompiledPrompt, QuestionType } from '../lib/schema';
import { filterByCategory, resolveConditionals, getProgress, QUESTIONS } from '../lib/questions';
import { compilePrompt } from '../lib/architect';
import TextInput from './questions/TextInput';
import SelectCard from './questions/SelectCard';
import MultiSelectGrid from './questions/MultiSelectGrid';
import ToggleSwitch from './questions/ToggleSwitch';

type State = {
  currentStage: 1 | 2 | 3;
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
  stage: 1 | 2 | 3;
  state: State;
  dispatch: (action: Action) => void;
}

const categories = [
  { key: InputCategory.STRUCTURAL, label: 'Structure' },
  { key: InputCategory.TECHNICAL, label: 'Technical' },
  { key: InputCategory.BEHAVIORAL, label: 'Behavior' },
];

export default function StageRenderer({ stage, state, dispatch }: Props) {
  useEffect(() => {
    if (stage === 3 && !state.compiledPrompt && !state.isCompiling) {
      dispatch({ type: 'COMPILE' });
      setTimeout(() => {
        const prompt = compilePrompt(state.answers, QUESTIONS);
        dispatch({ type: 'SET_COMPILED', prompt });
      }, 600);
    }
  }, [stage, state.compiledPrompt, state.isCompiling, state.answers, dispatch]);

  const handleAnswerChange = (id: string, value: string | string[]) => {
    dispatch({ type: 'SET_ANSWER', id, value });
  };

  const copyToClipboard = async () => {
    if (state.compiledPrompt) {
      await navigator.clipboard.writeText(state.compiledPrompt.raw);
    }
  };

  const exportAsTxt = () => {
    if (state.compiledPrompt) {
      const blob = new Blob([state.compiledPrompt.raw], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prompt.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (stage === 1) {
    const goalValue = (state.answers['project_goal'] as string) || '';
    const domainValue = (state.answers['domain'] as string) || '';
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <h1 className="text-3xl font-bold text-white mb-8">Idea Capture</h1>
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 mb-6">
          <TextInput
            question={{
              id: 'project_goal',
              category: InputCategory.STRUCTURAL,
              stage: 1,
              label: 'What is your core idea?',
              type: QuestionType.TEXT,
              required: true,
              weight: 1.0,
            }}
            value={goalValue}
            onChange={(value) => handleAnswerChange('project_goal', value)}
          />
        </div>
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 mb-6">
          <label className="block text-white/80 mb-4">Select Domain</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { value: 'software', label: 'Software' },
              { value: 'education', label: 'Education' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'data', label: 'Data' },
              { value: 'creative', label: 'Creative' },
              { value: 'legal', label: 'Legal' },
            ].map((domain) => (
              <button
                key={domain.value}
                onClick={() => handleAnswerChange('domain', domain.value)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  domainValue === domain.value
                    ? 'bg-white/15 border-white/30 ring-1 ring-purple-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                {domain.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'NEXT_STAGE' })}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl"
        >
          Next
        </button>
      </motion.div>
    );
  }

  if (stage === 2) {
    const activeCategory = state.activeCategory || InputCategory.STRUCTURAL;
    const questions = filterByCategory(QUESTIONS, activeCategory);
    const visibleQuestions = resolveConditionals(questions, state.answers);
    const progress = getProgress(state.answers, QUESTIONS);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <h1 className="text-3xl font-bold text-white mb-8">Smart Questions</h1>
        <div className="mb-6">
          <div className="w-full bg-white/10 h-2 rounded-full mb-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm">{Math.round(progress)}% Complete</p>
        </div>
        <div className="flex space-x-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => dispatch({ type: 'SET_CATEGORY', category: cat.key })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                activeCategory === cat.key
                  ? 'bg-white/15 border-white/30 ring-1 ring-purple-500/50 text-white'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
          >
            {visibleQuestions.map((question) => {
              const value = state.answers[question.id];
              switch (question.type) {
                case QuestionType.TEXT:
                  return <TextInput key={question.id} question={question} value={(value as string) || ''} onChange={(val) => handleAnswerChange(question.id, val)} />;
                case QuestionType.SELECT:
                  return <SelectCard key={question.id} question={question} value={(value as string) || ''} onChange={(val) => handleAnswerChange(question.id, val)} />;
                case QuestionType.MULTI_SELECT:
                  return <MultiSelectGrid key={question.id} question={question} value={(value as string[]) || []} onChange={(val) => handleAnswerChange(question.id, val)} />;
                case QuestionType.TOGGLE:
                  return <ToggleSwitch key={question.id} question={question} value={(value as string) || 'false'} onChange={(val) => handleAnswerChange(question.id, val)} />;
                default:
                  return null;
              }
            })}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => dispatch({ type: 'PREV_STAGE' })}
            className="bg-white/5 border border-white/10 text-white/80 px-6 py-3 rounded-xl hover:bg-white/10"
          >
            Back
          </button>
          <button
            onClick={() => dispatch({ type: 'NEXT_STAGE' })}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl"
          >
            Next
          </button>
        </div>
      </motion.div>
    );
  }

  if (stage === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <h1 className="text-3xl font-bold text-white mb-8">Compiled Prompt</h1>
        {state.isCompiling ? (
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ) : state.compiledPrompt ? (
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white">Generated Prompt</h2>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white/80"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={exportAsTxt}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white/80"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            <pre className="bg-black/50 p-4 rounded-lg text-white/90 overflow-x-auto text-sm whitespace-pre-wrap">
              {state.compiledPrompt.raw}
            </pre>
            <div className="mt-4 flex items-center space-x-4 text-white/60 text-sm">
              <span>Tokens: {state.compiledPrompt.metadata.tokenEstimate}</span>
              <span>Generated: {new Date(state.compiledPrompt.generatedAt).toLocaleString()}</span>
              <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Domain: {state.answers['domain']}</span>
            </div>
          </div>
        ) : null}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => dispatch({ type: 'PREV_STAGE' })}
            className="bg-white/5 border border-white/10 text-white/80 px-6 py-3 rounded-xl hover:bg-white/10"
          >
            Refine
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="bg-white/5 border border-white/10 text-white/80 px-6 py-3 rounded-xl hover:bg-white/10"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}