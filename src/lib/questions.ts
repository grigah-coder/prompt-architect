import { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export type { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export const QUESTIONS: Question[] = [
  // STRUCTURAL category (stage 1)
  {
    id: 'project_name',
    category: InputCategory.STRUCTURAL,
    stage: 1,
    label: 'Project Name',
    placeholder: 'e.g., ShopEase Pro',
    type: QuestionType.TEXT,
    required: true,
    weight: 1.0,
  },
  {
    id: 'concept',
    category: InputCategory.STRUCTURAL,
    stage: 1,
    label: 'Project Concept',
    type: QuestionType.TEXTAREA,
    placeholder: 'What does this app do? (e.g., A platform to book local football pitches)',
    required: true,
    weight: 1.0,
  },
  {
    id: 'persona',
    category: InputCategory.STRUCTURAL,
    stage: 1,
    label: 'Persona',
    type: QuestionType.SELECT,
    options: [
      { value: 'Senior Architect', label: 'Senior Architect' },
      { value: 'Security Auditor', label: 'Security Auditor' },
      { value: 'DevOps Engineer', label: 'DevOps Engineer' },
    ],
    required: true,
    weight: 1.0,
  },
  // STRUCTURAL category (stage 2)
  {
    id: 'app_type',
    category: InputCategory.STRUCTURAL,
    stage: 2,
    label: 'App Type',
    type: QuestionType.SELECT,
    options: [
      { value: 'Web App', label: 'Web App' },
      { value: 'Mobile App', label: 'Mobile App' },
      { value: 'Desktop', label: 'Desktop' },
    ],
    required: true,
    weight: 0.95,
  },
  // TECHNICAL category (stage 3)
  {
    id: 'infrastructure',
    category: InputCategory.TECHNICAL,
    stage: 3,
    label: 'Infrastructure',
    type: QuestionType.SELECT,
    options: [
      { value: 'Serverless', label: 'Serverless' },
      { value: 'Dockerized', label: 'Dockerized' },
      { value: 'Edge Runtime', label: 'Edge Runtime' },
    ],
    required: true,
    weight: 0.9,
  },
  // TECHNICAL category (stage 4)
  {
    id: 'data_flow',
    category: InputCategory.TECHNICAL,
    stage: 4,
    label: 'Data Flow',
    type: QuestionType.SELECT,
    options: [
      { value: 'REST', label: 'REST' },
      { value: 'GraphQL', label: 'GraphQL' },
      { value: 'WebSockets', label: 'WebSockets' },
    ],
    required: true,
    weight: 0.85,
  },
  {
    id: 'auth',
    category: InputCategory.TECHNICAL,
    stage: 4,
    label: 'Auth',
    type: QuestionType.SELECT,
    options: [
      { value: 'JWT', label: 'JWT' },
      { value: 'OAuth2', label: 'OAuth2' },
      { value: 'Session-based', label: 'Session-based' },
    ],
    required: true,
    weight: 0.8,
  },
  {
    id: 'state',
    category: InputCategory.TECHNICAL,
    stage: 4,
    label: 'State',
    type: QuestionType.SELECT,
    options: [
      { value: 'Zustand', label: 'Zustand' },
      { value: 'Redux', label: 'Redux' },
      { value: 'TanStack Query', label: 'TanStack Query' },
    ],
    required: true,
    weight: 0.75,
  },
];

export function filterByCategory(questions: Question[], category: InputCategory): Question[] {
  return questions
    .filter(q => q.category === category)
    .sort((a, b) => b.weight - a.weight);
}

export function filterByStage(questions: Question[], stage: number): Question[] {
  return questions.filter(q => q.stage === stage);
}

export function resolveConditionals(questions: Question[], answers: AnswerMap): Question[] {
  return questions.filter(q => {
    if (!q.dependsOn) return true;
    const answer = answers[q.dependsOn.questionId];
    if (Array.isArray(answer)) {
      return answer.includes(q.dependsOn.value);
    } else {
      return answer === q.dependsOn.value;
    }
  });
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