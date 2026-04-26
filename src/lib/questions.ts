import { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export type { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export const QUESTIONS: Question[] = [
  // STRUCTURAL category (stage 1)
  {
    id: 'project_goal',
    category: InputCategory.STRUCTURAL,
    stage: 1,
    label: 'What is the core objective of this AI?',
    placeholder: 'e.g., Generate code snippets',
    type: QuestionType.TEXT,
    required: true,
    weight: 1.0,
  },
  {
    id: 'target_audience',
    category: InputCategory.STRUCTURAL,
    stage: 1,
    label: 'Who is the primary audience?',
    type: QuestionType.SELECT,
    options: [
      { value: 'developer', label: 'Developer' },
      { value: 'designer', label: 'Designer' },
      { value: 'student', label: 'Student' },
      { value: 'business', label: 'Business' },
      { value: 'general', label: 'General' },
    ],
    required: true,
    weight: 0.9,
  },
  {
    id: 'domain',
    category: InputCategory.STRUCTURAL,
    stage: 1,
    label: 'What domain does this AI operate in?',
    type: QuestionType.SELECT,
    options: [
      { value: 'software', label: 'Software' },
      { value: 'education', label: 'Education' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'data', label: 'Data' },
      { value: 'creative', label: 'Creative' },
      { value: 'legal', label: 'Legal' },
    ],
    required: true,
    weight: 0.95,
  },
  {
    id: 'tone',
    category: InputCategory.STRUCTURAL,
    stage: 1,
    label: 'What tone should the AI use?',
    type: QuestionType.MULTI_SELECT,
    options: [
      { value: 'professional', label: 'Professional' },
      { value: 'casual', label: 'Casual' },
      { value: 'technical', label: 'Technical' },
      { value: 'empathetic', label: 'Empathetic' },
      { value: 'authoritative', label: 'Authoritative' },
    ],
    required: false,
    weight: 0.7,
  },
  // TECHNICAL category (stage 2)
  {
    id: 'output_format',
    category: InputCategory.TECHNICAL,
    stage: 2,
    label: 'What format should the output be in?',
    type: QuestionType.SELECT,
    options: [
      { value: 'markdown', label: 'Markdown' },
      { value: 'json', label: 'JSON' },
      { value: 'plain_text', label: 'Plain Text' },
      { value: 'bullet_list', label: 'Bullet List' },
      { value: 'step_by_step', label: 'Step-by-Step' },
    ],
    required: true,
    weight: 0.85,
  },
  {
    id: 'output_length',
    category: InputCategory.TECHNICAL,
    stage: 2,
    label: 'How long should the output be?',
    type: QuestionType.SELECT,
    options: [
      { value: 'concise', label: 'Concise (<200w)' },
      { value: 'standard', label: 'Standard (200-500w)' },
      { value: 'detailed', label: 'Detailed (500w+)' },
    ],
    required: false,
    weight: 0.6,
  },
  {
    id: 'primary_language',
    category: InputCategory.TECHNICAL,
    stage: 2,
    label: 'What language should the output be in?',
    type: QuestionType.SELECT,
    options: [
      { value: 'english', label: 'English' },
      { value: 'french', label: 'French' },
      { value: 'arabic', label: 'Arabic' },
      { value: 'spanish', label: 'Spanish' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
    weight: 0.5,
  },
  {
    id: 'hard_constraints',
    category: InputCategory.TECHNICAL,
    stage: 2,
    label: 'List anything the AI must NEVER do',
    placeholder: 'e.g., No harmful content',
    type: QuestionType.TEXT,
    required: false,
    weight: 0.8,
  },
  // BEHAVIORAL category (stage 3)
  {
    id: 'complexity_level',
    category: InputCategory.BEHAVIORAL,
    stage: 3,
    label: 'What complexity level?',
    type: QuestionType.SELECT,
    options: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'expert', label: 'Expert' },
    ],
    required: false,
    weight: 0.75,
  },
  {
    id: 'iteration_mode',
    category: InputCategory.BEHAVIORAL,
    stage: 3,
    label: 'Should the AI ask clarifying questions before responding?',
    type: QuestionType.TOGGLE,
    required: false,
    weight: 0.65,
  },
  {
    id: 'style_persona',
    category: InputCategory.BEHAVIORAL,
    stage: 3,
    label: 'What style persona?',
    type: QuestionType.SELECT,
    options: [
      { value: 'socratic', label: 'Socratic' },
      { value: 'direct', label: 'Direct' },
      { value: 'analytical', label: 'Analytical' },
      { value: 'creative', label: 'Creative' },
      { value: 'mentor', label: 'Mentor' },
    ],
    required: false,
    weight: 0.7,
  },
  {
    id: 'few_shot_examples',
    category: InputCategory.BEHAVIORAL,
    stage: 3,
    label: 'Include example inputs/outputs in the prompt?',
    type: QuestionType.TOGGLE,
    required: false,
    weight: 0.6,
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