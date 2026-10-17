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

  it('should render mobile layout tokens for a Mobile App platform', () => {
    const result = compilePrompt({
      concept: 'Build a fitness app',
      target_platform: 'Mobile App',
      layout_feel: 'Comfortable',
    });
    const layoutSection = result.systemPrompt
      .split('### Layout System')[1]
      .split('### Design Tokens')[0];

    expect(layoutSection).toContain('display: flex');
    expect(layoutSection).toContain('flex-direction: column');
    expect(layoutSection).toContain('env(safe-area-inset-top');
    expect(layoutSection).toContain('env(safe-area-inset-bottom');
    expect(layoutSection).toContain('max-width: none');
    expect(layoutSection).toContain('width: 100%');
    // No desktop-style fixed breakpoints on mobile.
    expect(layoutSection).not.toMatch(/max-width:\s*\d+px/);
    expect(layoutSection).not.toContain('max-width: 95vw');
  });

  it('should render responsive Web layout tokens for a Web platform', () => {
    const result = compilePrompt({
      concept: 'Build a site',
      target_platform: 'Web App',
      layout_feel: 'Comfortable',
    });
    const layoutSection = result.systemPrompt
      .split('### Layout System')[1]
      .split('### Design Tokens')[0];

    // Standard responsive web shell with a centered max-width wrapper.
    expect(layoutSection).toContain('.app-shell {');
    expect(layoutSection).toContain('.container { max-width: 1280px; margin: 0 auto; padding: 0 24px;');
    expect(layoutSection).toContain('.component {');
    expect(layoutSection).toContain('.section {');
    expect(layoutSection).toContain('@media (max-width: 768px)');
    // Web must not inherit mobile safe-area/full-width shell rules.
    expect(layoutSection).not.toContain('safe-area-inset');
    expect(layoutSection).not.toContain('max-width: none');
  });

  it('should render desktop window shell tokens for Desktop platforms', () => {
    const result = compilePrompt({
      concept: 'Build a desktop tool',
      target_platform: 'Desktop',
      layout_feel: 'Spacious',
    });
    const layoutSection = result.systemPrompt
      .split('### Layout System')[1]
      .split('### Design Tokens')[0];

    expect(layoutSection).toContain('.app-shell {');
    expect(layoutSection).toContain('height: 100vh');
    expect(layoutSection).toContain('overflow: hidden');
    expect(layoutSection).toContain('.titlebar-drag-region {');
    expect(layoutSection).toContain('-webkit-app-region: drag');
    expect(layoutSection).toContain('.container {');
    expect(layoutSection).toContain('.component {');
    expect(layoutSection).toContain('.section {');
    expect(layoutSection).toContain('max-width: 1600px');
    // Desktop must not inherit mobile safe-area rules.
    expect(layoutSection).not.toContain('safe-area-inset');
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
    expect(result.systemPrompt).toContain('**Responsive Design**');
    expect(result.systemPrompt).toContain('**SEO**');
    expect(result.systemPrompt).toContain('**Web Accessibility**');
    expect(result.systemPrompt).not.toContain('### Desktop-Specific Notes');
    expect(result.systemPrompt).not.toContain('### Mobile-Specific Notes');
  });

  it('should render ONLY Desktop-Specific Notes for a Desktop platform', () => {
    const result = compilePrompt({ concept: 'Build an app', target_platform: 'Desktop' });

    expect(result.systemPrompt).toContain('### Desktop-Specific Notes');
    expect(result.systemPrompt).toContain('**Window Management**');
    expect(result.systemPrompt).toContain('**Native Menus**');
    expect(result.systemPrompt).toContain('**Offline-First Data Storage**');
    expect(result.systemPrompt).toContain('**System Tray Integration**');
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

  it('should render standard rules and Desktop notes for a "Desktop App" value', () => {
    const result = compilePrompt({ concept: 'Build an app', target_platform: 'Desktop App' });
    const layoutSection = result.systemPrompt
      .split('### Layout System')[1]
      .split('### Design Tokens')[0];

    expect(result.systemPrompt).toContain('### Desktop-Specific Notes');
    expect(result.systemPrompt).not.toContain('safe-area-inset');
    expect(layoutSection).toContain('height: 100vh');
    expect(layoutSection).toContain('-webkit-app-region: drag');
    expect(layoutSection).not.toContain('safe-area-inset');
  });

  it('should render standard rules and Web notes for a "Web" value', () => {
    const result = compilePrompt({ concept: 'Build an app', target_platform: 'Web' });
    const layoutSection = result.systemPrompt
      .split('### Layout System')[1]
      .split('### Design Tokens')[0];

    expect(result.systemPrompt).toContain('### Web-Specific Notes');
    expect(result.systemPrompt).not.toContain('### Desktop-Specific Notes');
    expect(result.systemPrompt).not.toContain('safe-area-inset');
    expect(layoutSection).toContain('.container { max-width: 1280px');
    expect(layoutSection).not.toContain('safe-area-inset');
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

  it('should add Web-focused constraints for a Web platform', () => {
    const result = compilePrompt({
      concept: 'Build a site',
      target_platform: 'Web App',
    });
    const constraintsSection = result.systemPrompt
      .split('### Constraints')[1]
      .split('### Implementation Requirements')[0];

    expect(constraintsSection).toContain('- Ensure responsive design and proper SEO');
    expect(constraintsSection).toContain(
      '- Ensure cross-browser compatibility and SEO best practices',
    );
    expect(constraintsSection).not.toContain('Optimize for touch interactions');
  });

  it('should render a Web Project Signature for a Web platform', () => {
    const result = compilePrompt({
      concept: 'Build a site',
      target_platform: 'Web App',
      app_vibe: 'Minimal',
      color_style: 'Dark',
    });

    expect(result.systemPrompt).toContain('## Project Signature');
    expect(result.systemPrompt).toContain('🌐 Web Air × Night');
  });

  it('should add Desktop-focused constraints for a Desktop platform', () => {
    const result = compilePrompt({
      concept: 'Build a desktop tool',
      target_platform: 'Desktop',
    });
    const constraintsSection = result.systemPrompt
      .split('### Constraints')[1]
      .split('### Implementation Requirements')[0];

    expect(constraintsSection).toContain(
      '- Optimize for desktop window management, keyboard shortcuts, and native OS conventions',
    );
    expect(constraintsSection).not.toContain('Optimize for touch interactions');
    expect(constraintsSection).not.toContain('cross-browser compatibility');
  });

  it('should render a Desktop Project Signature for a Desktop platform', () => {
    const result = compilePrompt({
      concept: 'Build a desktop tool',
      target_platform: 'Desktop',
      app_vibe: 'Playful',
      color_style: 'Pastel',
    });

    expect(result.systemPrompt).toContain('## Project Signature');
    expect(result.systemPrompt).toContain('💻 Desktop Joy × Harmony');
  });
});
