import { describe, it, expect } from 'vitest';
import { getProgress, QUESTIONS } from '../lib/questions';
import type { AnswerMap } from '../lib/schema';

describe('getProgress', () => {
  it('should return 100 when all required answers are provided', () => {
    const allAnswers: AnswerMap = {
      project_name: 'Test',
      concept: 'An app',
      functional_notes: 'Some features',
      target_platform: 'Web App',
    };
    expect(getProgress(allAnswers, QUESTIONS)).toBe(100);
  });

  it('should handle array answers', () => {
    const answers: AnswerMap = {
      project_name: 'Test',
      concept: 'An app',
      functional_notes: 'Some features',
      target_platform: 'Web App',
    };
    expect(getProgress(answers, QUESTIONS)).toBe(100);
  });
});
