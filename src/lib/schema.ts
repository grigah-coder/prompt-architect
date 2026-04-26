export enum InputCategory {
  STRUCTURAL = 'STRUCTURAL',
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
}

export enum QuestionType {
  TEXT = 'TEXT',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  SLIDER = 'SLIDER',
  TOGGLE = 'TOGGLE',
}

export type QuestionOption = {
  value: string;
  label: string;
  icon?: string;
};

export type Question = {
  id: string;
  category: InputCategory;
  stage: 1 | 2 | 3 | 4;
  label: string;
  placeholder?: string;
  type: QuestionType;
  options?: QuestionOption[];
  required: boolean;
  weight: number;
  dependsOn?: {
    questionId: string;
    value: string;
  };
};

export type AnswerMap = Record<string, string | string[]>;

export type NormalizedInput = {
  structural: Pick<AnswerMap, 'concept'>;
  technical: Pick<AnswerMap, 'tech_stack' | 'features'>;
  behavioral: Pick<AnswerMap, 'ui_style'>;
};

export type CompiledPrompt = {
  systemPrompt: string;
  metaJSON: {
    role: string;
    context: string;
    constraints: string[];
    style: {
      tone: string;
      format: string[];
      density: string;
    };
  };
};

export function normalizeAnswers(answers: AnswerMap): NormalizedInput {
  return {
    structural: {
      concept: answers['concept'],
    },
    technical: {
      tech_stack: answers['tech_stack'],
      features: answers['features'],
    },
    behavioral: {
      ui_style: answers['ui_style'],
    },
  };
}