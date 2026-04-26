import { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export type { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export const QUESTIONS: Question[] = [
  // STRUCTURAL category (stage 1)
  {
    id: 'concept',
    category: InputCategory.STRUCTURAL,
    stage: 1,
    label: 'What is the main goal/problem the app solves?',
    placeholder: 'e.g., A task management tool for teams',
    type: QuestionType.TEXT,
    required: true,
    weight: 1.0,
  },
  // TECHNICAL category (stage 2)
  {
    id: 'tech_stack',
    category: InputCategory.TECHNICAL,
    stage: 2,
    label: 'Preferred technology stack',
    type: QuestionType.SELECT,
    options: [
      { value: 'nextjs', label: 'Next.js' },
      { value: 'react', label: 'React' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'python', label: 'Python' },
    ],
    required: true,
    weight: 0.9,
  },
  // BEHAVIORAL category (stage 3)
  {
    id: 'ui_style',
    category: InputCategory.BEHAVIORAL,
    stage: 3,
    label: 'Design system and theme',
    type: QuestionType.SELECT,
    options: [
      { value: 'tailwind', label: 'Tailwind' },
      { value: 'modern', label: 'Modern' },
      { value: 'minimalist', label: 'Minimalist' },
    ],
    required: true,
    weight: 0.8,
  },
  // TECHNICAL category (stage 4)
  {
    id: 'features',
    category: InputCategory.TECHNICAL,
    stage: 4,
    label: 'Required features',
    type: QuestionType.MULTI_SELECT,
    options: [
      { value: 'auth', label: 'Auth' },
      { value: 'database', label: 'Database' },
      { value: 'api', label: 'API' },
    ],
    required: true,
    weight: 0.7,
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