import { Question } from '../../lib/schema';

interface Props {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultiSelectGrid({ question, value, onChange }: Props) {
  const handleToggle = (optValue: string) => {
    const newValue = value.includes(optValue)
      ? value.filter(v => v !== optValue)
      : [...value, optValue];
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-white/80 mb-2">{question.label}</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {question.options?.map((option) => {
          const selected = value.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selected
                  ? 'bg-white/15 border-white/30 ring-1 ring-purple-500/50 text-white'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}