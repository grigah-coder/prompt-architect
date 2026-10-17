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

