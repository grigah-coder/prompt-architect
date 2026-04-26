import { NormalizedInput, CompiledPrompt, normalizeAnswers, InputCategory, AnswerMap } from './schema';

export function inferPersona(domain: string, goal: string): string {
  if (domain === 'software' && /code|build|debug/i.test(goal ?? '')) {
    return 'You are a Senior Software Engineer and Technical Architect with 15+ years of experience in full-stack development, system design, and debugging complex applications.';
  } else if (domain === 'education') {
    return 'You are an expert Pedagogical Designer and Subject Matter Expert with extensive experience in curriculum development and educational technology.';
  } else if (domain === 'marketing') {
    return 'You are a world-class Copywriter and Brand Strategist with a proven track record in crafting compelling narratives and marketing campaigns.';
  } else if (domain === 'data') {
    return 'You are a Lead Data Scientist and ML Engineer specializing in advanced analytics, machine learning models, and data-driven insights.';
  } else if (domain === 'creative') {
    return 'You are an award-winning Creative Director and Narrative Designer known for innovative storytelling and multimedia experiences.';
  } else if (domain === 'legal') {
    return 'You are a meticulous Legal Research Assistant with deep knowledge in legal frameworks, compliance, and regulatory requirements.';
  } else {
    return `You are a highly capable AI assistant specialized in ${goal || 'general tasks'}.`;
  }
}

export function buildContextBlock(input: NormalizedInput): string {
  const goal = input.structural.goal ?? 'Not specified';
  const audience = input.structural.audience ?? 'General';
  return `## CONTEXT\n${goal} for ${Array.isArray(audience) ? audience.join(', ') : audience}`;
}

export function buildOperationalBlock(input: NormalizedInput): string {
  const style = input.behavioral.style ?? '';
  let instructions = '';
  if (style === 'socratic') {
    instructions = 'Before answering, identify gaps in the request and ask clarifying questions to ensure complete understanding.';
  } else if (style === 'direct') {
    instructions = 'Respond immediately without preamble or unnecessary explanations.';
  } else {
    instructions = 'Provide clear, structured responses tailored to the request.';
  }
  return `## OPERATIONAL FRAMEWORK\n${instructions}`;
}

export function buildConstraintsBlock(input: NormalizedInput): string {
  const constraints = input.technical.constraints ?? '';
  const length = input.technical.outputLength ?? '';
  let lengthText = '';
  if (length === 'concise') {
    lengthText = '200 words';
  } else if (length === 'standard') {
    lengthText = '200-500 words';
  } else if (length === 'detailed') {
    lengthText = '500+ words';
  } else {
    lengthText = 'appropriate length';
  }
  const language = input.technical.language ?? 'English';
  return `## HARD CONSTRAINTS\n${constraints}\n- Never fabricate facts\n- Never exceed ${lengthText}\n- Always respond in ${language}`;
}

export function buildOutputBlock(input: NormalizedInput): string {
  const format = input.technical.format ?? '';
  let formatRules = '';
  if (format === 'markdown') {
    formatRules = 'Use Markdown formatting for headings, lists, and emphasis.';
  } else if (format === 'json') {
    formatRules = 'Output in valid JSON format.';
  } else if (format === 'plain_text') {
    formatRules = 'Use plain text without formatting.';
  } else if (format === 'bullet_list') {
    formatRules = 'Structure the response as a bullet-point list.';
  } else if (format === 'step_by_step') {
    formatRules = 'Provide step-by-step instructions.';
  } else {
    formatRules = 'Use appropriate formatting for clarity.';
  }
  return `## OUTPUT SPECIFICATION\n${formatRules}`;
}

export function buildFewShotBlock(input: NormalizedInput): string {
  const examples = input.behavioral.examples;
  if (examples === 'true') {
    return '## EXAMPLES\n[Examples would be inserted here based on user input]';
  }
  return '';
}

export function buildIterationBlock(input: NormalizedInput): string {
  const iteration = input.behavioral.iterationMode;
  if (iteration === 'true') {
    return '## ITERATION PROTOCOL\nIf the request is ambiguous, ask for clarification before providing a full response.';
  }
  return '';
}

export function compilePrompt(answers: AnswerMap): CompiledPrompt {
  const normalized = normalizeAnswers(answers);
  const persona = inferPersona(normalized.structural.domain as string ?? '', normalized.structural.goal as string ?? '');
  const blocks = [
    persona,
    buildContextBlock(normalized),
    buildOperationalBlock(normalized),
    buildConstraintsBlock(normalized),
    buildOutputBlock(normalized),
    buildFewShotBlock(normalized),
    buildIterationBlock(normalized),
  ].filter(block => block.trim() !== '');
  const raw = blocks.join('\n\n---\n\n');
  const tokenEstimate = Math.ceil(raw.length / 4);
  return {
    raw,
    metadata: {
      category: InputCategory.TECHNICAL,
      tokenEstimate,
      version: '1.0',
    },
    generatedAt: new Date().toISOString(),
  };
}