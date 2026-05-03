import { describe, it, expect } from 'vitest';
import { filterByStage, filterByCategory, getProgress, QUESTIONS } from '../lib/questions';
import { InputCategory } from '../lib/schema';
import { AnswerMap } from '../lib/schema';

describe('Question filtering functions', () => {
  describe('filterByStage', () => {
    it('should filter questions by stage number', () => {
      expect(filterByStage(QUESTIONS, 1).length).toBe(2); // project_name, concept
      expect(filterByStage(QUESTIONS, 2).length).toBe(1); // app_type
      expect(filterByStage(QUESTIONS, 3).length).toBe(3); // app_vibe, color_style, layout_feel
      expect(filterByStage(QUESTIONS, 4).length).toBe(0); // no questions in stage 4
    });

    it('should return empty array for invalid stage', () => {
      expect(filterByStage(QUESTIONS, 5)).toEqual([]);
    });
  });

  describe('filterByCategory', () => {
    it('should filter questions by category', () => {
      const structural = filterByCategory(QUESTIONS, InputCategory.STRUCTURAL);
      const designVibe = filterByCategory(QUESTIONS, InputCategory.DESIGN_VIBE);
      expect(structural.length).toBe(3); // project_name, concept, app_type
      expect(designVibe.length).toBe(3); // app_vibe, color_style, layout_feel
      expect(structural.every(q => q.category === InputCategory.STRUCTURAL)).toBe(true);
      expect(designVibe.every(q => q.category === InputCategory.DESIGN_VIBE)).toBe(true);
    });

    it('should sort by weight in descending order', () => {
      const technical = filterByCategory(QUESTIONS, InputCategory.TECHNICAL);
      for (let i = 0; i < technical.length - 1; i++) {
        expect(technical[i].weight).toBeGreaterThanOrEqual(technical[i + 1].weight);
      }
    });
  });

  describe('getProgress', () => {
    it('should calculate progress percentage correctly', () => {
      expect(getProgress({}, QUESTIONS)).toBe(0);

      const partialAnswers: AnswerMap = { project_name: 'Test' };
      const partialProgress = getProgress(partialAnswers, QUESTIONS);
      expect(partialProgress).toBeGreaterThan(0);
      expect(partialProgress).toBeLessThan(100);

      const allAnswers: AnswerMap = {
        project_name: 'Test',
        concept: 'An app',
        app_type: 'Web App'
      };
      expect(getProgress(allAnswers, QUESTIONS)).toBe(100);
    });

    it('should handle array answers', () => {
      const answers: AnswerMap = {
        project_name: 'Test',
        concept: 'An app',
        app_type: 'Web App'
      };
      expect(getProgress(answers, QUESTIONS)).toBe(100);
    });
  });
});