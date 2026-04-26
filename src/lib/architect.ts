import { NormalizedInput, CompiledPrompt, normalizeAnswers, AnswerMap } from './schema';

export function inferPersona(persona: string): string {
  if (persona === 'Senior Architect') {
    return 'You are a Senior Software Architect and Technical Lead with 15+ years of experience in full-stack development, system design, architecture patterns, and mentoring development teams.';
  } else if (persona === 'Security Auditor') {
    return 'You are a Senior Security Auditor and Cybersecurity Expert with extensive experience in vulnerability assessment, security best practices, compliance frameworks, and protecting applications from threats.';
  } else if (persona === 'DevOps Engineer') {
    return 'You are a Senior DevOps Engineer specializing in infrastructure automation, CI/CD pipelines, cloud deployment, monitoring, and scalable system operations.';
  } else {
    return 'You are a highly capable AI assistant specialized in software development and architecture.';
  }
}

export function buildContextBlock(input: NormalizedInput): string {
  const goal = input.structural.app_type ?? 'Not specified';
  const audience = 'General';
  return `## CONTEXT\n${goal} for ${audience}`;
}

export function buildOperationalBlock(): string {
  const instructions = 'Provide clear, structured responses tailored to the request.';
  return `## OPERATIONAL FRAMEWORK\n${instructions}`;
}

export function buildConstraintsBlock(): string {
  const constraints = '';
  const lengthText = 'appropriate length';
  const language = 'English';
  return `## HARD CONSTRAINTS\n${constraints}\n- Never fabricate facts\n- Never exceed ${lengthText}\n- Always respond in ${language}`;
}

export function buildOutputBlock(): string {
  const formatRules = 'Use appropriate formatting for clarity.';
  return `## OUTPUT SPECIFICATION\n${formatRules}`;
}

export function buildFewShotBlock(): string {
  return '';
}

export function buildIterationBlock(): string {
  return '';
}

export function buildSecurityBlock(): string {
  return '## SECURITY FOCUS\nPrioritize identifying potential vulnerabilities, implementing security best practices, and ensuring robust protection against common threats throughout the system design.';
}

export function compilePrompt(answers: AnswerMap): CompiledPrompt {
  const normalized = normalizeAnswers(answers);
  const goal = normalized.structural.app_type as string ?? '';
  const personaSelection = normalized.structural.system_persona as string ?? '';
  const persona = inferPersona(personaSelection);
  const blocks = [
    persona,
    buildContextBlock(normalized),
    buildOperationalBlock(),
    buildConstraintsBlock(),
    buildOutputBlock(),
    buildFewShotBlock(),
    buildIterationBlock(),
  ].filter(block => block.trim() !== '');
  if (personaSelection === 'Security Auditor') {
    blocks.splice(4, 0, buildSecurityBlock()); // insert after constraints
  }
  const systemPrompt = blocks.join('\n\n---\n\n');
  return {
    systemPrompt,
    metaJSON: {
      role: persona,
      context: goal,
      constraints: [],
      style: {
        tone: 'professional',
        format: ['markdown'],
        density: 'standard',
      },
    },
  };
}