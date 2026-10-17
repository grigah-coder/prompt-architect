import { describe, it, expect } from 'vitest';
import { compilePrompt } from '../lib/architect';

describe('compilePrompt', () => {
  it('should return systemPrompt and metaJSON', () => {
    const result = compilePrompt({ concept: 'Build an app' });
    expect(result).toHaveProperty('systemPrompt');
    expect(result).toHaveProperty('metaJSON');
    expect(result).toHaveProperty('markdown');
  });

  it('should include project in systemPrompt', () => {
    const result = compilePrompt({ concept: 'Build a web app', persona: 'Senior Architect' });
    expect(result.systemPrompt).toContain('Build a web app');
    expect(result.systemPrompt).toContain('# Project Blueprint');
    expect(result.systemPrompt).toContain('## 1. Project Identity');
    expect(result.systemPrompt).toContain('## 4. UI/UX Specification');
  });

  it('should not break on missing values gracefully', () => {
    const result = compilePrompt({ concept: '' });
    expect(result).toHaveProperty('systemPrompt');
    expect(result).toHaveProperty('metaJSON');
  });

  it('should include design style in systemPrompt', () => {
    const result = compilePrompt({ concept: 'Create a web app', app_vibe: 'Minimal', color_style: 'Dark' });
    expect(result.systemPrompt).toContain('# Project Blueprint');
    expect(result.systemPrompt).toContain('## 1. Project Identity');
    expect(result.systemPrompt).toContain('## 5. System Prompt for Claude Code / Kilo CLI');
    expect(result.systemPrompt).toContain('Create a web app');
    expect(result.systemPrompt).toContain('Minimal');
    expect(result.systemPrompt).toContain('Dark');
  });

  it('should build metaJSON correctly', () => {
    const result = compilePrompt({ concept: 'Create a React app' });
    expect(result.metaJSON.role).toBe('Software Architect');
    expect(result.metaJSON.context).toBe('Create a React app');
    expect(result.metaJSON.constraints).toBeDefined();
    expect(result.metaJSON.style).toEqual({
      tone: 'professional',
      format: ['markdown'],
      density: 'detailed',
    });
  });

  it('should include mobile-specific content for Mobile App type', () => {
    const result = compilePrompt({
      concept: 'Build a fitness app',
      app_type: 'Mobile App',
      color_style: 'Dark',
    });
    expect(result.systemPrompt).toContain('Mobile App');
  });

  it('should include web-specific content for Web App type', () => {
    const result = compilePrompt({
      concept: 'Build an e-commerce site',
      app_type: 'Web App',
      color_style: 'Light',
    });
    expect(result.systemPrompt).toContain('Web App');
  });

  it('should map layout feels to CSS', () => {
    const compact = compilePrompt({ concept: 'Build app', layout_feel: 'Compact' });
    expect(compact.systemPrompt).toContain('Compact');

    const spacious = compilePrompt({ concept: 'Build app', layout_feel: 'Spacious' });
    expect(spacious.systemPrompt).toContain('Spacious');

    const comfortable = compilePrompt({ concept: 'Build app', layout_feel: 'Comfortable' });
    expect(comfortable.systemPrompt).toContain('Comfortable');
  });
});
