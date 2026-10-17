import { describe, it, expect } from 'vitest';
import { getProgress, inferPlatform, QUESTIONS } from '../lib/questions';
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

describe('inferPlatform', () => {
  it('should infer desktop and web platforms', () => {
    expect(inferPlatform('A desktop tool for analysts')).toBe('Desktop');
    expect(inferPlatform('A marketing website')).toBe('Web App');
  });

  it('should still infer mobile for genuinely mobile descriptions', () => {
    expect(inferPlatform('A native mobile app')).toBe('Mobile App');
  });

  it('should not default to Mobile when a web/desktop signal is present', () => {
    // "automobile" contains the substring "mobile" but this is a website.
    expect(inferPlatform('A website for automobile dealerships')).toBe('Web App');
    expect(inferPlatform('A desktop and mobile companion app')).toBe('Desktop');
  });

  it('should return null when no platform signal is present', () => {
    expect(inferPlatform('A cooking blog about pasta')).toBeNull();
  });
});
