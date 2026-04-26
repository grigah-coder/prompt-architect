import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Question, filterByCategory, QUESTIONS } from '../lib/questions';
import { InputCategory } from '../lib/schema';

interface QuestionCardProps {
  onComplete: (answers: Record<string, string | string[]>) => void;
}

const categories = ['structural', 'technical', 'behavioral'] as const;

const categoryMap = {
  structural: InputCategory.STRUCTURAL,
  technical: InputCategory.TECHNICAL,
  behavioral: InputCategory.BEHAVIORAL,
} as const;

const QuestionCard: React.FC<QuestionCardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const currentCategory = categories[step];
  const questions = filterByCategory(QUESTIONS, categoryMap[currentCategory]);

  const handleAnswerChange = (id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1 as 0 | 1 | 2);
    } else {
      onComplete(answers);
    }
  };

  const renderInput = (question: Question) => {
    const value = answers[question.id];
    switch (question.type) {
      case 'TEXT':
        return (
          <textarea
            rows={2}
            placeholder={question.placeholder}
            value={(value as string) || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg text-white/80 focus:ring-1 focus:ring-violet-400 p-2"
          />
        );
      case 'SELECT':
        return (
          <div className="flex flex-wrap gap-2">
            {question.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswerChange(question.id, option.value)}
                className={`px-3 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/10 ${
                  value === option.value ? 'ring-1 ring-violet-400' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );
      case 'MULTI_SELECT':
        return (
          <div className="flex flex-wrap gap-2">
            {question.options?.map((option) => {
              const selected = (value as string[])?.includes(option.value) || false;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const current = (value as string[]) || [];
                    const newValue = selected
                      ? current.filter(v => v !== option.value)
                      : [...current, option.value];
                    handleAnswerChange(question.id, newValue);
                  }}
                  className={`px-3 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/10 ${
                    selected ? 'ring-1 ring-violet-400' : ''
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        );
      case 'TOGGLE':
        return (
          <button
            onClick={() => handleAnswerChange(question.id, value === 'true' ? 'false' : 'true')}
            className={`px-3 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/10 ${
              value === 'true' ? 'bg-violet-500/40 ring-1 ring-violet-400' : ''
            }`}
          >
            {value === 'true' ? 'Yes' : 'No'}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      {/* Progress dots */}
      <div className="flex justify-center mb-6">
        {categories.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full mx-1 ${
              step >= i ? 'bg-violet-500' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ willChange: 'transform' }}
        >
          {questions.map((question) => (
            <div key={question.id} className="mb-4">
              <label className="block text-white/80 mb-2">{question.label}</label>
              {renderInput(question)}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6 py-2 flex items-center gap-2"
        >
          {step < 2 ? 'Next' : 'Complete'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;