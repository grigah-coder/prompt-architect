import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download } from 'lucide-react';
import { InputCategory, AnswerMap, CompiledPrompt, QuestionType } from '../lib/schema';
import { filterByStage, resolveConditionals, QUESTIONS } from '../lib/questions';
import { compilePrompt } from '../lib/compiler';
import TextInput from './questions/TextInput';
import SelectCard from './questions/SelectCard';
import MultiSelectGrid from './questions/MultiSelectGrid';
import ToggleSwitch from './questions/ToggleSwitch';
import StepProgressBar from './StepProgressBar';

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
}



export default function StageRenderer({ stage, state, dispatch }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (stage === 4 && !state.compiledPrompt && !state.isCompiling) {
      dispatch({ type: 'COMPILE' });
      const prompt = compilePrompt({
        answers: state.answers
      });
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
    const visibleQuestions = resolveConditionals(questions, state.answers);
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
        <div className="glass-card rounded-2xl p-6 mb-6">
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

  if (stage >= 2 && stage <= 4 && !(stage === 4 && state.compiledPrompt)) {
    const questions = filterByStage(QUESTIONS, stage);
    const visibleQuestions = resolveConditionals(questions, state.answers);
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
        <div className="glass-card rounded-2xl p-6">
          {visibleQuestions.map((question) => {
            const value = state.answers[question.id];
            switch (question.type) {
              case QuestionType.TEXT:
              case QuestionType.TEXTAREA:
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
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => dispatch({ type: 'PREV_STAGE' })}
            className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => dispatch({ type: 'NEXT_STAGE' })}
            className="btn-accent text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            {stage === 4 ? 'Generate Blueprint' : 'Next'}
          </button>
        </div>
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
          <div className="glass-card rounded-2xl p-6">
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ) : state.compiledPrompt ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-4">
              <h2 className="text-xl text-white mb-2">Generated Prompt</h2>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-200'}`}
                >
                  <Copy size={16} />
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
              <pre>
                {state.compiledPrompt.systemPrompt}
              </pre>
            </div>

          </div>
        ) : null}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => dispatch({ type: 'PREV_STAGE' })}
            className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Refine
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="bg-slate-700 border border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}