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

  it('should split multiline Core Requirements into separate bullet points', () => {
    const result = compilePrompt({
      concept: 'Build a task app',
      functional_notes: 'Users can sign up\nUsers can create tasks\nUsers can complete tasks',
      data_flow: 'REST API',
    });

    expect(result.systemPrompt).toContain(
      '- **Core Requirements**:\n' +
        '  - Users can sign up\n' +
        '  - Users can create tasks\n' +
        '  - Users can complete tasks\n' +
        '- **Data Flow**: REST API',
    );
  });

  it('should normalize existing bullet and numbered prefixes without duplicating them', () => {
    const bullets = compilePrompt({
      concept: 'Build an app',
      functional_notes: '- First feature\n* Second feature',
    });
    const numbered = compilePrompt({
      concept: 'Build an app',
      functional_notes: '1. First feature\n2) Second feature',
    });

    expect(bullets.systemPrompt).toContain('  - First feature\n  - Second feature');
    expect(bullets.systemPrompt).not.toContain('- - First feature');
    expect(numbered.systemPrompt).toContain('  - First feature\n  - Second feature');
  });

  it('should ignore blank lines in Core Requirements', () => {
    const result = compilePrompt({
      concept: 'Build an app',
      functional_notes: 'First feature\n\n   \nSecond feature\n',
    });

    expect(result.systemPrompt).toContain('  - First feature\n  - Second feature');
  });

  it('should fall back to a placeholder bullet when Core Requirements are empty', () => {
    const result = compilePrompt({ concept: 'Build an app' });
    expect(result.systemPrompt).toContain('- **Core Requirements**:\n  - Not specified');
  });

  it('should render ONLY Web-Specific Notes for a Web platform', () => {
    const result = compilePrompt({ concept: 'Build an app', target_platform: 'Web App' });

    expect(result.systemPrompt).toContain('### Web-Specific Notes');
    expect(result.systemPrompt).not.toContain('### Desktop-Specific Notes');
    expect(result.systemPrompt).not.toContain('### Mobile-Specific Notes');
  });

  it('should render ONLY Desktop-Specific Notes for a Desktop platform', () => {
    const result = compilePrompt({ concept: 'Build an app', target_platform: 'Desktop' });

    expect(result.systemPrompt).toContain('### Desktop-Specific Notes');
    expect(result.systemPrompt).not.toContain('### Web-Specific Notes');
    expect(result.systemPrompt).not.toContain('### Mobile-Specific Notes');
  });

  it('should prefer the wizard target_platform over a legacy app_type answer', () => {
    const result = compilePrompt({
      concept: 'Build an app',
      target_platform: 'Desktop',
      app_type: 'Web App',
    });

    expect(result.systemPrompt).toContain('### Desktop-Specific Notes');
    expect(result.systemPrompt).not.toContain('### Web-Specific Notes');
  });

  it('should omit all platform notes cleanly when no platform is selected', () => {
    const result = compilePrompt({ concept: 'Build an app' });

    expect(result.systemPrompt).not.toContain('Specific Notes');
    expect(result.systemPrompt).not.toMatch(/\n\n\n+## 4\. UI\/UX Specification/);
    expect(result.systemPrompt).toMatch(/\n## 4\. UI\/UX Specification/);
  });

  it('should never render empty bullet points in the Constraints section', () => {
    const platforms = [undefined, 'Web App', 'Mobile App', 'Desktop'];

    platforms.forEach((target_platform) => {
      const result = compilePrompt({
        concept: 'Build an app',
        ...(target_platform ? { target_platform } : {}),
      });
      const constraintsSection = result.systemPrompt
        .split('### Constraints')[1]
        .split('### Implementation Requirements')[0];

      expect(constraintsSection).not.toMatch(/^-\s*$/m);
      expect(constraintsSection).toContain(
        '- Meet standard WCAG 2.1 AA accessibility guidelines',
      );
    });
  });

  it('should render the accessibility default instead of "Not specified"', () => {
    const result = compilePrompt({ concept: 'Build an app' });

    expect(result.systemPrompt).toContain('Meet standard WCAG 2.1 AA accessibility guidelines');
    expect(result.systemPrompt).not.toContain('Meet Not specified accessibility standards');
    expect(result.systemPrompt).toContain('- **Accessibility Target**: WCAG 2.1 AA');
  });

  it('should render the provided accessibility target when set', () => {
    const result = compilePrompt({ concept: 'Build an app', accessibility: 'WCAG 2.1 AAA' });

    expect(result.systemPrompt).toContain('Meet WCAG 2.1 AAA accessibility standards');
    expect(result.systemPrompt).not.toContain('Meet standard WCAG 2.1 AA accessibility guidelines');
    expect(result.systemPrompt).toContain('- **Accessibility Target**: WCAG 2.1 AAA');
  });

  it('should sanitize the Project Signature when variables are empty', () => {
    const result = compilePrompt({ concept: 'Build an app' });

    expect(result.systemPrompt).toContain('## Project Signature');
    expect(result.systemPrompt).toContain('🌐 Web Air × Night');
    expect(result.systemPrompt).not.toContain('Not specified ×');
  });

  it('should build a Project Signature from the provided variables', () => {
    const result = compilePrompt({
      concept: 'Build a mobile app',
      target_platform: 'Mobile App',
      app_vibe: 'Bold',
      color_style: 'High Contrast',
    });

    expect(result.systemPrompt).toContain('📱 Mobile Power × Clarity');
  });
});
