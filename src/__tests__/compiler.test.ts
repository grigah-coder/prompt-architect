import { describe, it, expect } from 'vitest';
import { compilePrompt } from '../lib/architect';

describe('compilePrompt', () => {
  it('should return systemPrompt and metaJSON', () => {
    const result = compilePrompt({ concept: 'Build an app' });
    expect(result).toHaveProperty('systemPrompt');
    expect(result).toHaveProperty('metaJSON');
  });

  it('should include project in systemPrompt', () => {
    const result = compilePrompt({ concept: 'Build a web app', persona: 'Senior Architect' });
    expect(result.systemPrompt).toContain('Build a web app');
    expect(result.systemPrompt).toContain('# Product Vision');
    expect(result.systemPrompt).toContain('# User Experience Strategy');
    expect(result.systemPrompt).toContain('# Technical UI Implementation');
  });

  it('should not include persona in systemPrompt when not available', () => {
    const result = compilePrompt({ concept: 'Build app' });
    expect(result.systemPrompt).toContain('General users');
  });

  it('should handle missing values gracefully', () => {
    const result = compilePrompt({ concept: '' });
    expect(result).toHaveProperty('systemPrompt');
    expect(result).toHaveProperty('metaJSON');
  });

  it('should include design style in systemPrompt', () => {
    const result = compilePrompt({ concept: 'Create a web app', app_vibe: 'Minimal', color_style: 'Dark' });
    expect(result.systemPrompt).toContain('# Product Vision');
    expect(result.systemPrompt).toContain('# User Experience Strategy');
    expect(result.systemPrompt).toContain('# Technical UI Implementation');
    expect(result.systemPrompt).toContain('Create a web app');
    expect(result.systemPrompt).toContain('Minimal design approach');
    expect(result.systemPrompt).toContain('**Color Palette**: Dark');
  });

  it('should build metaJSON correctly', () => {
    const result = compilePrompt({ concept: 'Create a React app' });
    expect(result.metaJSON).toEqual({
      role: 'Developer',
      context: 'Create a React app',
      constraints: ['Follow the design system guidelines', 'Maintain consistent user experience', 'Ensure accessibility standards'],
      style: {
        tone: 'professional',
        format: ['markdown'],
        density: 'detailed',
      },
    });
  });

  it('should include mobile-specific content for Mobile App type', () => {
    const result = compilePrompt({
      concept: 'Build a fitness app',
      app_type: 'Mobile App',
      color_style: 'Dark'
    });
    expect(result.systemPrompt).toContain('React Native, Swift, or Flutter');
    expect(result.systemPrompt).toContain('touch gestures');
    expect(result.systemPrompt).toContain('Mobile application for iOS and Android');
  });

  it('should include web-specific content for Web App type', () => {
    const result = compilePrompt({
      concept: 'Build an e-commerce site',
      app_type: 'Web App',
      color_style: 'Light'
    });
    expect(result.systemPrompt).toContain('React/Next.js');
    expect(result.systemPrompt).toContain('SEO optimization');
    expect(result.systemPrompt).toContain('responsive design');
    expect(result.systemPrompt).toContain('mouse and keyboard interactions');
  });

  it('should use actual color style in visual design system', () => {
    const result = compilePrompt({
      concept: 'Build an app',
      color_style: 'High Contrast'
    });
    expect(result.systemPrompt).toContain('High Contrast theme');
  });

  it('should map Compact layout feel to specific CSS units', () => {
    const result = compilePrompt({
      concept: 'Build an app',
      layout_feel: 'Compact'
    });
    expect(result.systemPrompt).toContain('Base Gap**: 4px');
    expect(result.systemPrompt).toContain('Component Spacing**: 8px');
    expect(result.systemPrompt).toContain('1024px');
  });

  it('should map Spacious layout feel to specific CSS units', () => {
    const result = compilePrompt({
      concept: 'Build an app',
      layout_feel: 'Spacious'
    });
    expect(result.systemPrompt).toContain('Base Gap**: 24px');
    expect(result.systemPrompt).toContain('Component Spacing**: 32px');
    expect(result.systemPrompt).toContain('1400px');
  });

  it('should map Comfortable layout feel to balanced CSS units', () => {
    const result = compilePrompt({
      concept: 'Build an app',
      layout_feel: 'Comfortable'
    });
    expect(result.systemPrompt).toContain('Base Gap**: 16px');
    expect(result.systemPrompt).toContain('Component Spacing**: 24px');
    expect(result.systemPrompt).toContain('1200px');
  });

  it('should include Project Signature section', () => {
    const result = compilePrompt({
      concept: 'Build an app',
      app_type: 'Web App',
      app_vibe: 'Minimal',
      color_style: 'Dark'
    });
    expect(result.systemPrompt).toContain('# Project Signature');
    expect(result.systemPrompt).toContain('🌐 Web Air × Night');
  });

  it('should generate unique signatures for different combinations', () => {
    const mobileMinimalDark = compilePrompt({
      concept: 'Build mobile app',
      app_type: 'Mobile App',
      app_vibe: 'Minimal',
      color_style: 'Dark'
    });
    const webBoldLight = compilePrompt({
      concept: 'Build web app',
      app_type: 'Web App',
      app_vibe: 'Bold',
      color_style: 'Light'
    });
    const desktopPlayfulPastel = compilePrompt({
      concept: 'Build desktop app',
      app_type: 'Desktop',
      app_vibe: 'Playful',
      color_style: 'Pastel'
    });

    expect(mobileMinimalDark.systemPrompt).toContain('📱 Mobile Air × Night');
    expect(webBoldLight.systemPrompt).toContain('🌐 Web Power × Dawn');
    expect(desktopPlayfulPastel.systemPrompt).toContain('💻 Desktop Joy × Harmony');
  });

  it('should use specific pixel spacing for Compact Layout Feel on Mobile App', () => {
    const result = compilePrompt({
      concept: 'Build mobile app',
      app_type: 'Mobile App',
      layout_feel: 'Compact'
    });
    expect(result.systemPrompt).toContain('Base Gap**: 4px');
    expect(result.systemPrompt).toContain('Component Spacing**: 8px');
    expect(result.systemPrompt).toContain('90vw');
  });
});