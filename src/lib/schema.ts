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
  description?: string;
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
  structural: Pick<AnswerMap, 'system_persona' | 'app_type'>;
  technical: Pick<AnswerMap, 'infrastructure' | 'data_flow' | 'auth_strategy' | 'state_management'>;
  behavioral: never;
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
      system_persona: answers['system_persona'],
      app_type: answers['app_type'],
    },
    technical: {
      infrastructure: answers['infrastructure'],
      data_flow: answers['data_flow'],
      auth_strategy: answers['auth_strategy'],
      state_management: answers['state_management'],
    },
    behavioral: undefined as never,
  };
}