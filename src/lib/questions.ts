import { Question, WizardStep, InputCategory, QuestionType, AnswerMap, WizardProgress } from './schema';
import { STEP_TITLES } from './schema';

export type { Question, InputCategory, QuestionType, WizardStep, AnswerMap, WizardProgress } from './schema';

export const PROJECT_TYPE_KEYWORDS: Record<string, string[]> = {
  ecommerce: ['payment', 'checkout', 'cart', 'stripe', 'product catalog', 'store'],
  saas: ['subscription', 'billing', 'tenant', 'multi-team', 'dashboard', 'admin panel'],
  mobile: ['ios', 'android', 'native', 'mobile', 'push notification', 'app store'],
  web: ['website', 'web app', 'browser', 'seo', 'landing page'],
  dashboard: ['analytics', 'reporting', 'admin', 'management panel', 'metrics'],
  social: ['feed', 'post', 'follow', 'user profile', 'chat', 'messaging'],
  ai: ['llm', 'ai', 'machine learning', 'generative', 'chatbot', 'embedding'],
  blog: ['blog', 'article', 'cms', 'publishing', 'markdown', 'post'],
};

export const PLATFORM_KEYWORDS: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  mobile: 'Mobile App',
  web: 'Web App',
  browser: 'Web App',
  desktop: 'Desktop',
  macos: 'Desktop',
  windows: 'Desktop',
  linux: 'Desktop',
};

export const QUESTIONS: Question[] = [
  // Step 1: Project Identity
  {
    id: 'project_name',
    category: InputCategory.STRUCTURAL,
    stage: WizardStep.PROJECT_IDENTITY,
    label: 'Project Name',
    hint: 'A short, memorable name for your app. It is used as the title of your final blueprint.',
    placeholder: 'e.g., ShopEase Pro',
    type: QuestionType.TEXT,
    required: true,
    weight: 1.0,
  },
  {
    id: 'concept',
    category: InputCategory.STRUCTURAL,
    stage: WizardStep.PROJECT_IDENTITY,
    label: 'What does your app do?',
    hint: 'Describe your idea in one or two sentences. This drives the follow-up questions we ask next.',
    placeholder: 'e.g., A platform to book local football pitches',
    type: QuestionType.TEXTAREA,
    required: true,
    weight: 1.0,
  },
  {
    id: 'persona',
    category: InputCategory.STRUCTURAL,
    stage: WizardStep.PROJECT_IDENTITY,
    label: 'System Persona (optional)',
    hint: 'Tell the AI what role to take on. Leave this blank to use a sensible default.',
    placeholder: 'e.g., Senior Full-Stack Architect',
    type: QuestionType.TEXT,
    required: false,
    weight: 0.8,
  },

  // Step 2: Functional QA (dynamic probes)
  {
    id: 'functional_notes',
    category: InputCategory.FUNCTIONAL,
    stage: WizardStep.FUNCTIONAL_SPEC,
    label: 'Functional Requirements',
    hint: 'List the key things users can do in your app. Bullet points work great here.',
    type: QuestionType.TEXTAREA,
    placeholder: 'Describe core features, user flows, and key behaviors.',
    required: true,
    weight: 1.0,
  },
  {
    id: 'data_flow',
    category: InputCategory.FUNCTIONAL,
    stage: WizardStep.FUNCTIONAL_SPEC,
    label: 'Data Flow',
    hint: 'How your app sends and receives data. Pick REST API if you are unsure.',
    placeholder: 'e.g., REST API, GraphQL, Realtime WebSockets',
    defaultValue: 'REST API',
    type: QuestionType.SELECT,
    options: [
      { value: 'REST API', label: 'REST API', recommended: true },
      { value: 'GraphQL', label: 'GraphQL' },
      { value: 'WebSockets', label: 'WebSockets (Realtime)' },
      { value: 'Serverless Functions', label: 'Serverless Functions' },
    ],
    required: false,
    weight: 0.9,
  },
  {
    id: 'auth_strategy',
    category: InputCategory.FUNCTIONAL,
    stage: WizardStep.FUNCTIONAL_SPEC,
    label: 'Authentication Strategy',
    hint: 'How users sign in. Clerk is a drop-in option that handles most cases for you.',
    placeholder: 'e.g., JWT, OAuth, Clerk, Supabase Auth',
    defaultValue: 'Clerk',
    type: QuestionType.SELECT,
    options: [
      { value: 'JWT', label: 'JWT' },
      { value: 'OAuth', label: 'OAuth' },
      { value: 'Clerk', label: 'Clerk', recommended: true },
      { value: 'Supabase Auth', label: 'Supabase Auth' },
      { value: 'None (Public)', label: 'None (Public)' },
    ],
    required: false,
    weight: 0.85,
  },
  {
    id: 'state_management',
    category: InputCategory.FUNCTIONAL,
    stage: WizardStep.FUNCTIONAL_SPEC,
    label: 'State Management',
    hint: 'How your app keeps track of data between screens. Zustand is simple and lightweight.',
    placeholder: 'e.g., Zustand, Redux, React Query, Context',
    defaultValue: 'Zustand',
    type: QuestionType.SELECT,
    options: [
      { value: 'Zustand', label: 'Zustand', recommended: true },
      { value: 'Redux Toolkit', label: 'Redux Toolkit' },
      { value: 'React Query', label: 'React Query / TanStack Query' },
      { value: 'Context API', label: 'React Context' },
      { value: 'None', label: 'None / Local State' },
    ],
    required: false,
    weight: 0.8,
  },
  {
    id: 'accessibility',
    category: InputCategory.FUNCTIONAL,
    stage: WizardStep.FUNCTIONAL_SPEC,
    label: 'Accessibility Requirements',
    hint: 'How easy your app is to use for everyone, including keyboard and screen-reader users.',
    placeholder: 'e.g., WCAG 2.1 AA, screen reader support, keyboard navigation',
    type: QuestionType.TEXT,
    required: false,
    weight: 0.7,
  },

  // Step 3: Platform Selection
  {
    id: 'target_platform',
    category: InputCategory.TECHNICAL,
    stage: WizardStep.PLATFORM_SELECTION,
    label: 'Target Platform',
    hint: 'Where people will use your app. Web App is the easiest place to start.',
    defaultValue: 'Web App',
    type: QuestionType.SELECT,
    options: [
      { value: 'Web App', label: 'Web App', icon: 'Globe', description: 'Browser-based applications accessible from any device', recommended: true },
      { value: 'Mobile App', label: 'Mobile App', icon: 'Smartphone', description: 'Native mobile applications for iOS and Android' },
      { value: 'Desktop', label: 'Desktop', icon: 'Monitor', description: 'Desktop software for Windows, macOS, and Linux' },
    ],
    required: true,
    weight: 1.0,
  },
  {
    id: 'platform_detail',
    category: InputCategory.TECHNICAL,
    stage: WizardStep.PLATFORM_SELECTION,
    label: 'Platform Details',
    hint: 'Optional specifics about the platform, such as app stores or frameworks.',
    placeholder: 'e.g., iOS + Android, PWA, Electron, Next.js',
    type: QuestionType.TEXT,
    required: false,
    weight: 0.8,
    dynamic: true,
    platform: 'target_platform',
  },
  {
    id: 'infrastructure',
    category: InputCategory.TECHNICAL,
    stage: WizardStep.PLATFORM_SELECTION,
    label: 'Infrastructure / Deployment',
    hint: 'Where your app lives online once it is built. Vercel is a great default for web apps.',
    placeholder: 'e.g., Vercel, Netlify, AWS, Firebase, Docker',
    defaultValue: 'Vercel',
    type: QuestionType.SELECT,
    options: [
      { value: 'Vercel', label: 'Vercel', recommended: true },
      { value: 'Netlify', label: 'Netlify' },
      { value: 'AWS', label: 'AWS' },
      { value: 'Firebase', label: 'Firebase' },
      { value: 'Docker / Self-Hosted', label: 'Docker / Self-Hosted' },
      { value: 'Not Sure', label: 'Not Sure / Decide Later' },
    ],
    required: false,
    weight: 0.85,
    dynamic: true,
    platform: 'target_platform',
  },

  // Step 4: UI/UX Specs
  {
    id: 'app_vibe',
    category: InputCategory.DESIGN_VIBE,
    stage: WizardStep.UI_UX_SPECS,
    label: 'App Vibe',
    hint: 'The overall personality people feel when they use your app.',
    defaultValue: 'Minimal',
    type: QuestionType.SELECT,
    options: [
      { value: 'Minimal', label: 'Minimal', recommended: true },
      { value: 'Bold', label: 'Bold' },
      { value: 'Playful', label: 'Playful' },
      { value: 'Corporate', label: 'Corporate' },
    ],
    required: false,
    weight: 0.9,
  },
  {
    id: 'color_style',
    category: InputCategory.DESIGN_VIBE,
    stage: WizardStep.UI_UX_SPECS,
    label: 'Color Style',
    hint: 'The background and text colors used across your app.',
    defaultValue: 'Dark',
    type: QuestionType.SELECT,
    options: [
      { value: 'Dark', label: 'Dark', recommended: true },
      { value: 'Light', label: 'Light' },
      { value: 'High Contrast', label: 'High Contrast' },
      { value: 'Pastel', label: 'Pastel' },
    ],
    required: false,
    weight: 0.85,
  },
  {
    id: 'layout_feel',
    category: InputCategory.DESIGN_VIBE,
    stage: WizardStep.UI_UX_SPECS,
    label: 'Layout Feel',
    hint: 'How much breathing room your layouts have. Comfortable suits most screens.',
    defaultValue: 'Comfortable',
    type: QuestionType.SELECT,
    options: [
      { value: 'Compact', label: 'Compact' },
      { value: 'Comfortable', label: 'Comfortable', recommended: true },
      { value: 'Spacious', label: 'Spacious' },
    ],
    required: false,
    weight: 0.8,
  },
  {
    id: 'typography_style',
    category: InputCategory.DESIGN_VIBE,
    stage: WizardStep.UI_UX_SPECS,
    label: 'Typography Style',
    hint: 'The style of your fonts. Modern Sans is clean and highly readable.',
    defaultValue: 'Modern Sans',
    type: QuestionType.SELECT,
    options: [
      { value: 'Modern Sans', label: 'Modern Sans', recommended: true },
      { value: 'Serif', label: 'Serif' },
      { value: 'Monospace', label: 'Monospace' },
      { value: 'Mixed', label: 'Mixed' },
    ],
    required: false,
    weight: 0.7,
  },
  {
    id: 'interaction_style',
    category: InputCategory.DESIGN_VIBE,
    stage: WizardStep.UI_UX_SPECS,
    label: 'Interaction Style',
    hint: 'How people operate your app — fingers, mouse and keyboard, or both.',
    defaultValue: 'Hybrid',
    type: QuestionType.SELECT,
    options: [
      { value: 'Touch-First', label: 'Touch-First' },
      { value: 'Mouse & Keyboard', label: 'Mouse & Keyboard' },
      { value: 'Hybrid', label: 'Hybrid', recommended: true },
    ],
    required: false,
    weight: 0.7,
  },
];

/**
 * Builds an initial AnswerMap from the recommended defaults defined on each
 * question. This lets beginners move forward without having to make a choice
 * for every standard option.
 */
export function getDefaultAnswers(allQuestions: Question[] = QUESTIONS): AnswerMap {
  return allQuestions.reduce<AnswerMap>((answers, question) => {
    if (question.defaultValue) {
      answers[question.id] = question.defaultValue;
    }
    return answers;
  }, {});
}

/**
 * Detects which project type keywords appear in the description and returns
 * matching project-type categories.
 */
export function detectProjectTypes(description: string): string[] {
  const lower = description.toLowerCase();
  return Object.entries(PROJECT_TYPE_KEYWORDS).filter(([, keywords]) =>
    keywords.some(kw => lower.includes(kw.toLowerCase()))
  ).map(([type]) => type);
}

/**
 * Infers the likely target platform from the project description.
 */
export function inferPlatform(description: string): string | null {
  const lower = description.toLowerCase();
  const matches = Object.entries(PLATFORM_KEYWORDS)
    .filter(([kw]) => lower.includes(kw))
    .map(([, platform]) => platform);
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Returns dynamic probing questions for Step 2 based on the project description
 * and target platform. Static questions are always included; dynamic probes are
 * filtered by keyword matches in the description and (optionally) platform.
 */
export function getDynamicQuestions(
  description: string,
  platform: string | undefined,
  allQuestions: Question[] = QUESTIONS,
): Question[] {
  const detectedTypes = detectProjectTypes(description);
  const dynamicQuestions: Question[] = [];

  allQuestions.forEach(q => {
    if (!q.dynamic) {
      dynamicQuestions.push(q);
      return;
    }

    // Platform-filtered dynamic questions
    if (q.platform && platform) {
      const platformLower = platform.toLowerCase();
      if (platformLower.includes(q.platform.toLowerCase())) {
        dynamicQuestions.push(q);
      }
      return;
    }

    // Keyword-based dynamic questions for functional probes
    if (q.probes && q.probes.some(p => detectedTypes.includes(p.toLowerCase()))) {
      dynamicQuestions.push(q);
    }
  });

  return dynamicQuestions;
}

export function filterByCategory(questions: Question[], category: InputCategory): Question[] {
  return questions
    .filter(q => q.category === category)
    .sort((a, b) => b.weight - a.weight);
}

export function filterByStage(questions: Question[], stage: WizardStep): Question[] {
  return questions.filter(q => q.stage === stage);
}

export function getProgress(answers: AnswerMap, questions: Question[]): number {
  const requiredQuestions = questions.filter(q => q.required);
  const answeredRequired = requiredQuestions.filter(q => {
    const answer = answers[q.id];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    } else {
      return answer && answer.trim() !== '';
    }
  });
  return requiredQuestions.length > 0 ? (answeredRequired.length / requiredQuestions.length) * 100 : 0;
}

export function getStepProgress(step: WizardStep, answers: AnswerMap, allQuestions: Question[]): WizardProgress {
  const totalSteps = 5;
  const stageQuestions = filterByStage(allQuestions, step);
  const requiredStageQuestions = stageQuestions.filter(q => q.required);
  const answered = requiredStageQuestions.filter(q => {
    const answer = answers[q.id];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    } else {
      return answer && answer.trim() !== '';
    }
  }).length;

  let completed = 0;
  if (step > WizardStep.PROJECT_IDENTITY) completed++;
  if (step > WizardStep.FUNCTIONAL_SPEC) completed++;
  if (step > WizardStep.PLATFORM_SELECTION) completed++;
  if (step > WizardStep.UI_UX_SPECS) completed++;
  if (step === WizardStep.PROMPT_OUTPUT) completed++;

  const percentage = requiredStageQuestions.length > 0
    ? Math.round((answered / requiredStageQuestions.length) * 100)
    : 0;

  return {
    step,
    totalSteps,
    completed,
    percentage,
  };
}
