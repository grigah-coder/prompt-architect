export enum WizardStep {
  PROJECT_IDENTITY = 1,
  FUNCTIONAL_SPEC = 2,
  PLATFORM_SELECTION = 3,
  UI_UX_SPECS = 4,
  PROMPT_OUTPUT = 5,
}

export const STEP_TITLES: Record<WizardStep, string> = {
  [WizardStep.PROJECT_IDENTITY]: 'Project Identity',
  [WizardStep.FUNCTIONAL_SPEC]: 'Functional QA',
  [WizardStep.PLATFORM_SELECTION]: 'Target Platform',
  [WizardStep.UI_UX_SPECS]: 'UI/UX Specs',
  [WizardStep.PROMPT_OUTPUT]: 'Export Prompt',
};

export const STEP_HINTS: Record<WizardStep, string> = {
  [WizardStep.PROJECT_IDENTITY]: 'Name your project and describe what it does. Your description drives the functional probing questions in the next step.',
  [WizardStep.FUNCTIONAL_SPEC]: 'Answer the probing questions that apply to your project. These are generated dynamically from your description.',
  [WizardStep.PLATFORM_SELECTION]: 'Choose your target platform. Platform-specific follow-up questions will appear once you select one.',
  [WizardStep.UI_UX_SPECS]: 'Define the look, feel, and interaction model of your application.',
  [WizardStep.PROMPT_OUTPUT]: 'Your structured blueprint is ready. Copy the system prompt for Claude Code or Kilo CLI.',
};

export enum InputCategory {
  STRUCTURAL = 'STRUCTURAL',
  FUNCTIONAL = 'FUNCTIONAL',
  DESIGN_VIBE = 'DESIGN_VIBE',
  TECHNICAL = 'TECHNICAL',
}

/** Friendly headings used to group related questions within a step. */
export const CATEGORY_LABELS: Record<InputCategory, string> = {
  [InputCategory.STRUCTURAL]: 'Project Foundations',
  [InputCategory.FUNCTIONAL]: 'Core Functionality',
  [InputCategory.DESIGN_VIBE]: 'Design Vibe',
  [InputCategory.TECHNICAL]: 'Technical Setup',
};

/** Plain-language explanations of what each section controls. */
export const CATEGORY_DESCRIPTIONS: Record<InputCategory, string> = {
  [InputCategory.STRUCTURAL]:
    'The basics that tell the AI what you are building and who it is for.',
  [InputCategory.FUNCTIONAL]:
    'How your app talks to data, handles sign-ins, and remembers what users do.',
  [InputCategory.DESIGN_VIBE]:
    'The look and feel of your app — colors, spacing, fonts, and how it responds to interaction.',
  [InputCategory.TECHNICAL]:
    'Where your app runs, what powers it, and how it gets deployed.',
};

export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
}

export type QuestionOption = {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  /** Marks this option as a safe, sensible default for beginners. */
  recommended?: boolean;
};

export type Question = {
  id: string;
  category: InputCategory;
  stage: WizardStep;
  label: string;
  hint?: string;
  placeholder?: string;
  type: QuestionType;
  options?: QuestionOption[];
  /** Pre-selected value that gives beginners a smooth path forward. */
  defaultValue?: string;
  required: boolean;
  weight: number;
  /** Keywords in the project description that trigger this dynamic probe */
  probes?: string[];
  /** Target platform this dynamic probe applies to */
  platform?: string;
  dynamic?: boolean;
};

export type AnswerMap = Record<string, string | string[]>;

/** Canonical platform identifiers shared by the wizard selector and compiler. */
export const PLATFORM = {
  WEB: 'Web App',
  MOBILE: 'Mobile App',
  DESKTOP: 'Desktop',
} as const;

export type Platform = (typeof PLATFORM)[keyof typeof PLATFORM];

// Signals used to recognise each platform. Desktop and web are checked before
// mobile so an explicit desktop/web choice is never shadowed by a stray
// "mobile" mention.
const DESKTOP_SIGNALS = ['desktop', 'macos', 'windows', 'linux', 'electron'];
const WEB_SIGNALS = ['web', 'browser', 'pwa'];
const MOBILE_SIGNALS = ['mobile', 'ios', 'android'];

/**
 * Canonicalizes the many ways a target platform can be expressed ("web",
 * "Web App", "desktop app", "Desktop", "iOS", ...) into one of the canonical
 * PLATFORM values. Desktop and web signals win over a stray "mobile" mention so
 * a web/desktop project can never be misclassified as mobile. Returns '' when
 * no platform-like value is present.
 */
export function normalizePlatform(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value.join(' ') : String(value ?? '');
  const text = raw.toLowerCase().trim();
  if (!text || text === 'not specified') return '';

  const matches = (signals: string[]) => signals.some((signal) => text.includes(signal));

  if (matches(DESKTOP_SIGNALS)) return PLATFORM.DESKTOP;
  if (matches(WEB_SIGNALS)) return PLATFORM.WEB;
  if (matches(MOBILE_SIGNALS)) return PLATFORM.MOBILE;
  return '';
}

export type WizardProgress = {
  step: WizardStep;
  totalSteps: number;
  completed: number;
  percentage: number;
};

export type NormalizedInput = {
  project_name?: string;
  rawIdea: string;
  system_persona?: string;
  target_platform?: string;
  app_type?: string;
  app_vibe?: string;
  color_style?: string;
  layout_feel?: string;
  typography_style?: string;
  interaction_style?: string;
  visual_hierarchy?: string;
  infrastructure?: string;
  data_flow?: string;
  auth_strategy?: string;
  state_management?: string;
  accessibility?: string;
};

export type CompiledPrompt = {
  markdown: string;
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
    project_name: answers.project_name as string,
    rawIdea: (answers.concept as string) || (answers.project_name as string) || 'Build an application',
    system_persona: answers.persona as string,
    target_platform: answers.target_platform as string,
    app_type: answers.app_type as string,
    app_vibe: answers.app_vibe as string,
    color_style: answers.color_style as string,
    layout_feel: answers.layout_feel as string,
    typography_style: answers.typography_style as string,
    interaction_style: answers.interaction_style as string,
    visual_hierarchy: answers.visual_hierarchy as string,
    infrastructure: answers.infrastructure as string,
    data_flow: answers.data_flow as string,
    auth_strategy: answers.auth_strategy as string,
    state_management: answers.state_management as string,
    accessibility: answers.accessibility as string,
  };
}
