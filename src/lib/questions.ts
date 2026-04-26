import { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export type { Question, InputCategory, QuestionType, AnswerMap } from './schema';

export const QUESTIONS: Question[] = [
  // STRUCTURAL category (stage 1)
  {
    id: 'system_persona',
    category: InputCategory.STRUCTURAL,
    stage: 1,
    label: 'System Persona',
    type: QuestionType.SELECT,
    options: [
      { value: 'architect', label: 'Architect', description: 'Senior software architect specializing in system design, scalability, and technical leadership for complex applications.' },
      { value: 'security', label: 'Security', description: 'Cybersecurity expert focused on threat modeling, vulnerability assessment, compliance, and robust protection strategies.' },
      { value: 'devops', label: 'DevOps', description: 'Infrastructure specialist in CI/CD automation, cloud deployment, containerization, and operational excellence.' },
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
      { value: 'web', label: 'Web', description: 'Browser-based application with responsive design, accessible from any device with a modern web browser.' },
      { value: 'mobile', label: 'Mobile', description: 'Native mobile experience for iOS and Android with offline capabilities and device-specific features.' },
      { value: 'desktop', label: 'Desktop', description: 'Cross-platform desktop application with native performance and deep system integration.' },
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
      { value: 'serverless', label: 'Serverless', description: 'Fully managed serverless architecture with automatic scaling, pay-per-use pricing, and zero server maintenance.' },
      { value: 'docker', label: 'Docker', description: 'Containerized deployment with consistent environments across development, staging, and production.' },
      { value: 'edge', label: 'Edge', description: 'Edge computing with global distribution, ultra-low latency, and intelligent routing for optimal performance.' },
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
      { value: 'rest', label: 'REST', description: 'Standard RESTful API with stateless communication, resource-based endpoints, and HTTP method semantics.' },
      { value: 'graphql', label: 'GraphQL', description: 'Flexible query language allowing clients to request exactly the data they need with a single endpoint.' },
      { value: 'websockets', label: 'WebSockets', description: 'Real-time bidirectional communication for live updates, chat, and collaborative features.' },
    ],
    required: true,
    weight: 0.85,
  },
  // TECHNICAL category (stage 4)
  {
    id: 'auth_strategy',
    category: InputCategory.TECHNICAL,
    stage: 4,
    label: 'Auth Strategy',
    type: QuestionType.SELECT,
    options: [
      { value: 'jwt', label: 'JWT', description: 'Stateless JSON Web Tokens with secure claims, refresh tokens, and cryptographic signature validation.' },
      { value: 'oauth2', label: 'OAuth2', description: 'Industry-standard authorization protocol for third-party integrations and social login capabilities.' },
      { value: 'session', label: 'Session', description: 'Server-side session management with secure cookies, CSRF protection, and centralized state.' },
    ],
    required: true,
    weight: 0.8,
  },
  // TECHNICAL category (stage 4)
  {
    id: 'state_management',
    category: InputCategory.TECHNICAL,
    stage: 4,
    label: 'State Management',
    type: QuestionType.SELECT,
    options: [
      { value: 'zustand', label: 'Zustand', description: 'Lightweight, fast state management with minimal boilerplate and excellent TypeScript support.' },
      { value: 'redux', label: 'Redux', description: 'Predictable state container with powerful devtools, middleware support, and time-travel debugging.' },
      { value: 'context', label: 'Context', description: 'Built-in React Context API for simple state sharing without external dependencies.' },
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