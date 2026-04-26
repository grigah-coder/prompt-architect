'use client';

import { useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StageRenderer from '../components/StageRenderer';
import { AnswerMap, InputCategory, CompiledPrompt } from '../lib/schema';

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

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.id]: action.value } };
    case 'NEXT_STAGE':
      if (state.currentStage < 3) {
        return { ...state, currentStage: (state.currentStage + 1) as 1 | 2 | 3 };
      }
      return state;
    case 'PREV_STAGE':
      if (state.currentStage > 1) {
        return { ...state, currentStage: (state.currentStage - 1) as 1 | 2 | 3 };
      }
      return state;
    case 'COMPILE':
      return { ...state, isCompiling: true };
    case 'SET_COMPILING':
      return { ...state, isCompiling: action.compiling };
    case 'SET_COMPILED':
      return { ...state, compiledPrompt: action.prompt, isCompiling: false };
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.category };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const initialState: State = {
  currentStage: 1,
  answers: {},
  activeCategory: null,
  compiledPrompt: null,
  isCompiling: false,
};

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.3),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(30,64,175,0.2),transparent_50%)] before:pointer-events-none">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStage}
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <StageRenderer stage={state.currentStage} state={state} dispatch={dispatch} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}