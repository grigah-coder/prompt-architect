import { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export type { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export const QUESTIONS: Question[] = [
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
    label: 'What does your app do?',
    type: QuestionType.TEXTAREA,
    placeholder: 'e.g., A platform to book local football pitches',
    required: true,
    weight: 1.0,
  },
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
  // DESIGN_VIBE category (stage 3)
  {
    id: 'app_vibe',
    category: InputCategory.DESIGN_VIBE,
    stage: 3,
    label: 'App Vibe',
    type: QuestionType.SELECT,
    options: [
      { value: 'Minimal', label: 'Minimal' },
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
    stage: 3,
    label: 'Color Style',
    type: QuestionType.SELECT,
    options: [
      { value: 'Dark', label: 'Dark' },
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
    stage: 3,
    label: 'Layout Feel',
    type: QuestionType.SELECT,
    options: [
      { value: 'Compact', label: 'Compact' },
      { value: 'Comfortable', label: 'Comfortable' },
      { value: 'Spacious', label: 'Spacious' },
    ],
    required: false,
    weight: 0.8,
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