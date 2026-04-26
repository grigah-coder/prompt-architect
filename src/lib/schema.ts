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
  stage: 1 | 2 | 3;
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
  structural: Pick<AnswerMap, 'goal' | 'audience' | 'tone' | 'domain'>;
  technical: Pick<AnswerMap, 'format' | 'outputLength' | 'constraints' | 'language'>;
  behavioral: Pick<AnswerMap, 'style' | 'iterationMode' | 'complexity' | 'examples'>;
};

export type CompiledPrompt = {
  raw: string;
  metadata: {
    category: InputCategory;
    tokenEstimate: number;
    version: string;
  };
  generatedAt: string;
};

export function normalizeAnswers(answers: AnswerMap, questions: Question[]): NormalizedInput {
  return {
    structural: {
      goal: answers['project_goal'],
      audience: answers['target_audience'],
      tone: answers['tone'],
      domain: answers['domain'],
    },
    technical: {
      format: answers['output_format'],
      outputLength: answers['output_length'],
      constraints: answers['hard_constraints'],
      language: answers['primary_language'],
    },
    behavioral: {
      style: answers['style_persona'],
      iterationMode: answers['iteration_mode'],
      complexity: answers['complexity_level'],
      examples: answers['few_shot_examples'],
    },
  };
}