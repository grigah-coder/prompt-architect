import { NormalizedInput, CompiledPrompt } from './schema';

export function compilePrompt(input: NormalizedInput): CompiledPrompt {
  const parts: string[] = [
    '## Project\n' + (input.rawIdea ?? 'My App'),
    '## Type\n' + (input.app_type ?? 'Not specified'),
    '## Users\n' + (input.system_persona ?? 'Not specified'),
    '## UI Style\n' + [input.data_flow, input.auth_strategy, input.state_management].filter(Boolean).join(', '),
  ];

  return {
    systemPrompt: parts.join('\n\n'),
    metaJSON: {
      role: 'Developer',
      context: input.rawIdea ?? '',
      constraints: ['Keep it simple.', 'Focus on user needs.'],
      style: {
        tone: 'simple',
        format: ['markdown'],
        density: 'comfortable',
      },
    },
  };
}