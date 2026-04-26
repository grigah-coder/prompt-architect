export interface AppState {
  stage: 'idea' | 'questions' | 'output';
  rawIdea: string;
  questions: Question[];
  answers: Answers;
  output: Output | null;
  loading: boolean;
  error: string | null;
}

export type Question = {
  id: string;
  question: string;
};

export type Answers = Record<string, string>;

export type Output = {
  finalPrompt: string;
  designSpec: string;
};

export type Action =
  | { type: 'SET_RAW_IDEA'; payload: string }
  | { type: 'SUBMIT_IDEA' }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SUBMIT_ANSWERS'; payload: Answers }
  | { type: 'UPDATE_ANSWER'; payload: { id: string; value: string } }
  | { type: 'SET_OUTPUT'; payload: Output }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

export const initialState: AppState = {
  stage: 'idea',
  rawIdea: '',
  questions: [],
  answers: {},
  output: null,
  loading: false,
  error: null,
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_RAW_IDEA':
      return {
        ...state,
        rawIdea: action.payload,
      };
    
    case 'SUBMIT_IDEA':
      return {
        ...state,
        stage: 'questions',
        questions: [],
        answers: {},
        output: null,
        loading: true,
        error: null,
      };
    
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.payload,
        loading: false,
      };
    
    case 'SUBMIT_ANSWERS':
      return {
        ...state,
        stage: 'output',
        answers: action.payload,
        output: null,
        loading: true,
        error: null,
      };
    
    case 'UPDATE_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.payload.id]: action.payload.value },
      };
    
    case 'SET_OUTPUT':
      return {
        ...state,
        output: action.payload,
        loading: false,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    case 'RESET':
      return {
        stage: 'idea',
        rawIdea: '',
        questions: [],
        answers: {},
        output: null,
        loading: false,
        error: null,
      };
    
    default:
      return state;
  }
}