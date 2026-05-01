export enum InputCategory {
  STRUCTURAL = 'STRUCTURAL',
  TECHNICAL = 'TECHNICAL',
}

export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
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

// NEW
export type NormalizedInput = {
  rawIdea: string;
  system_persona?: string;
  app_type?: string;
  infrastructure?: string;
  data_flow?: string;
  auth_strategy?: string;
  state_management?: string;
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
    rawIdea: (answers.concept as string) || (answers.project_name as string) || 'Build an application',
    system_persona: answers.persona as string,
    app_type: answers.app_type as string,
    infrastructure: answers.infrastructure as string,
    data_flow: answers.data_flow as string,
    auth_strategy: answers.auth as string,
    state_management: answers.state as string,
  };
}