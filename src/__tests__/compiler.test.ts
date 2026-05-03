import { describe, it, expect } from 'vitest';
import { compilePrompt } from '../lib/architect';

describe('compilePrompt', () => {
  it('should return systemPrompt and metaJSON', () => {
    const result = compilePrompt({ rawIdea: 'Build an app' });
    expect(result).toHaveProperty('systemPrompt');
    expect(result).toHaveProperty('metaJSON');
  });

  it('should include project in systemPrompt', () => {
    const result = compilePrompt({ rawIdea: 'Build a web app', system_persona: 'Senior Architect' });
    expect(result.systemPrompt).toContain('Build a web app');
    expect(result.systemPrompt).toContain('# Product Vision');
    expect(result.systemPrompt).toContain('# User Experience Strategy');
    expect(result.systemPrompt).toContain('# Technical UI Implementation');
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

  it('should include design style in systemPrompt', () => {
    const result = compilePrompt({ rawIdea: 'Create a web app', app_vibe: 'Minimal', color_style: 'Dark' });
    expect(result.systemPrompt).toContain('# Product Vision');
    expect(result.systemPrompt).toContain('# User Experience Strategy');
    expect(result.systemPrompt).toContain('# Technical UI Implementation');
    expect(result.systemPrompt).toContain('Create a web app');
    expect(result.systemPrompt).toContain('Minimal design approach');
    expect(result.systemPrompt).toContain('**Color Palette**: Dark');
  });

  it('should build metaJSON correctly', () => {
    const result = compilePrompt({ rawIdea: 'Create a React app', system_persona: 'Senior Architect' });
    expect(result.metaJSON).toEqual({
      role: 'Senior Architect',
      context: 'Create a React app',
      constraints: ['Follow the design system guidelines', 'Maintain consistent user experience', 'Ensure accessibility standards'],
      style: {
        tone: 'professional',
        format: ['markdown'],
        density: 'detailed',
      },
    });
  });
});