export enum InputCategory {
  STRUCTURAL = 'STRUCTURAL',
  DESIGN_VIBE = 'DESIGN_VIBE',
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
  stage: 1 | 2 | 3;
  label: string;
  placeholder?: string;
  type: QuestionType;
  options?: QuestionOption[];
  required: boolean;
  weight: number;
};

export type AnswerMap = Record<string, string | string[]>;

// NEW
export type NormalizedInput = {
  rawIdea: string;
  system_persona?: string;
  app_type?: string;
  app_vibe?: string;
  color_style?: string;
  layout_feel?: string;
  typography_style?: string;
  interaction_style?: string;
  visual_hierarchy?: string;
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
    app_vibe: answers.ui_mood as string,
    color_style: answers.color_palette as string,
    layout_feel: answers.ui_density as string,
    typography_style: answers.typography_style as string,
    interaction_style: answers.interaction_style as string,
    visual_hierarchy: answers.visual_hierarchy as string,
  };
}