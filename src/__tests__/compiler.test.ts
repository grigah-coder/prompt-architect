import { describe, it, expect } from 'vitest';
import { compilePrompt } from '../lib/compiler';

describe('compilePrompt', () => {
  it('should return systemPrompt and metaJSON', () => {
    const result = compilePrompt({ rawIdea: 'Build an app' });
    expect(result).toHaveProperty('systemPrompt');
    expect(result).toHaveProperty('metaJSON');
  });

  it('should include project in systemPrompt', () => {
    const result = compilePrompt({ rawIdea: 'Build a web app', system_persona: 'Senior Architect' });
    expect(result.systemPrompt).toContain('Build a web app');
    expect(result.systemPrompt).toContain('## Project');
  });

  it('should include persona in systemPrompt', () => {
    const result = compilePrompt({ rawIdea: 'Build app', system_persona: 'Security Auditor' });
    expect(result.systemPrompt).toContain('Security Auditor');
  });

  it('should handle missing values gracefully', () => {
    const result = compilePrompt({ rawIdea: '' });
    expect(result).toHaveProperty('systemPrompt');
    expect(result).toHaveProperty('metaJSON');
  });

  it('should include auth in systemPrompt', () => {
    const result = compilePrompt({ rawIdea: 'App', auth_strategy: 'JWT' });
    expect(result.systemPrompt).toContain('JWT');
  });

  it('should build metaJSON correctly', () => {
    const result = compilePrompt({ rawIdea: 'Create a React app', system_persona: 'Senior Architect' });
    expect(result.metaJSON).toHaveProperty('role');
    expect(result.metaJSON).toHaveProperty('context');
    expect(result.metaJSON).toHaveProperty('constraints');
    expect(result.metaJSON).toHaveProperty('style');
  });
});