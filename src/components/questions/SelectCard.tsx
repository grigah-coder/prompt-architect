import { Question } from '../../lib/schema';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function SelectCard({ question, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-white/80 mb-2">{question.label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-3 rounded-lg border text-left transition-all ${
              value === option.value
                ? 'bg-white/15 border-white/30 ring-1 ring-emerald-500/50 text-white'
                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}