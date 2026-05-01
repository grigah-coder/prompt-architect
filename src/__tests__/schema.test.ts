import { describe, it, expect } from 'vitest';
import { normalizeAnswers, AnswerMap } from '../lib/schema';

describe('normalizeAnswers', () => {
  it('should normalize a complete answer map', () => {
    const answers: AnswerMap = {
      project_name: 'TestApp',
      concept: 'A test application',
      persona: 'Senior Architect',
      app_type: 'Web App',
      infrastructure: 'Serverless',
      data_flow: 'REST',
      auth: 'JWT',
      state: 'Zustand',
    };

    const result = normalizeAnswers(answers);

    expect(result).toEqual({
      rawIdea: 'A test application',
      system_persona: 'Senior Architect',
      app_type: 'Web App',
      infrastructure: 'Serverless',
      data_flow: 'REST',
      auth_strategy: 'JWT',
      state_management: 'Zustand',
    });
  });

  it('should handle partial answers', () => {
    const answers: AnswerMap = {
      project_name: 'TestApp',
      persona: 'Senior Architect',
      infrastructure: 'Serverless',
    };

    const result = normalizeAnswers(answers);

    expect(result.system_persona).toBe('Senior Architect');
    expect(result.app_type).toBeUndefined();
    expect(result.infrastructure).toBe('Serverless');
    expect(result.data_flow).toBeUndefined();
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
      app_type: ['Web App', 'Mobile App'], // Though this shouldn't happen with current questions
    };

    const result = normalizeAnswers(answers);

    expect(result.system_persona).toBe('Senior Architect');
    expect(result.app_type).toEqual(['Web App', 'Mobile App']);
  });
});