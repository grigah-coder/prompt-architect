import { describe, it, expect } from 'vitest';
import { normalizeAnswers, normalizePlatform, PLATFORM, AnswerMap } from '../lib/schema';

describe('normalizeAnswers', () => {
  it('should normalize a complete answer map', () => {
    const answers: AnswerMap = {
      project_name: 'TestApp',
      concept: 'A test application',
      persona: 'Senior Architect',
      app_type: 'Web App',
      infrastructure: 'Serverless',
      data_flow: 'REST',
      auth_strategy: 'JWT',
      state_management: 'Zustand',
    };

    const result = normalizeAnswers(answers);

    expect(result).toEqual({
      project_name: 'TestApp',
      rawIdea: 'A test application',
      system_persona: 'Senior Architect',
      target_platform: undefined,
      app_type: 'Web App',
      app_vibe: undefined,
      color_style: undefined,
      layout_feel: undefined,
      typography_style: undefined,
      interaction_style: undefined,
      visual_hierarchy: undefined,
      infrastructure: 'Serverless',
      data_flow: 'REST',
      auth_strategy: 'JWT',
      state_management: 'Zustand',
      accessibility: undefined,
    });
  });

  it('should handle partial answers', () => {
    const answers: AnswerMap = {
      project_name: 'TestApp',
      persona: 'Senior Architect',
      app_vibe: 'Minimal',
    };

    const result = normalizeAnswers(answers);

    expect(result.system_persona).toBe('Senior Architect');
    expect(result.app_type).toBeUndefined();
    expect(result.app_vibe).toBe('Minimal');
    expect(result.color_style).toBeUndefined();
  });

  it('should handle empty answer map', () => {
    const answers: AnswerMap = {};

    const result = normalizeAnswers(answers);

    expect(result.system_persona).toBeUndefined();
    expect(result.app_type).toBeUndefined();
    expect(result.infrastructure).toBeUndefined();
    expect(result.data_flow).toBeUndefined();
    expect(result.auth_strategy).toBeUndefined();
    expect(result.state_management).toBeUndefined();
    expect(result.rawIdea).toBe('Build an application');
  });

  it('should handle string arrays in answers', () => {
    const answers: AnswerMap = {
      project_name: 'TestApp',
      persona: 'Senior Architect',
      app_type: ['Web App', 'Mobile App'],
    };

    const result = normalizeAnswers(answers);

    expect(result.system_persona).toBe('Senior Architect');
    expect(result.app_type).toEqual(['Web App', 'Mobile App']);
  });
});

describe('normalizePlatform', () => {
  it('should canonicalize platform variants', () => {
    expect(normalizePlatform('Web')).toBe(PLATFORM.WEB);
    expect(normalizePlatform('Web App')).toBe(PLATFORM.WEB);
    expect(normalizePlatform('Desktop')).toBe(PLATFORM.DESKTOP);
    expect(normalizePlatform('Desktop App')).toBe(PLATFORM.DESKTOP);
    expect(normalizePlatform('Mobile')).toBe(PLATFORM.MOBILE);
    expect(normalizePlatform('Mobile App')).toBe(PLATFORM.MOBILE);
    expect(normalizePlatform('iOS')).toBe(PLATFORM.MOBILE);
  });

  it('should return an empty string for missing or placeholder values', () => {
    expect(normalizePlatform(undefined)).toBe('');
    expect(normalizePlatform('')).toBe('');
    expect(normalizePlatform('   ')).toBe('');
    expect(normalizePlatform('Not specified')).toBe('');
  });

  it('should not let a mobile mention shadow an explicit desktop/web choice', () => {
    expect(normalizePlatform('Desktop, also mobile-friendly')).toBe(PLATFORM.DESKTOP);
    expect(normalizePlatform('Web app with a mobile companion')).toBe(PLATFORM.WEB);
  });
});
