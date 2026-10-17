import { Question } from '../../lib/schema';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function SelectCard({ question, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-white/80 mb-1">{question.label}</label>
      {question.hint && (
        <p className="text-sm text-slate-400 mb-3">{question.hint}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={`flex items-center justify-between gap-3 p-3 rounded-lg border text-left transition-all ${
              value === option.value
                ? 'bg-white/15 border-white/30 ring-1 ring-emerald-500/50 text-white'
                : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
            }`}
          >
            <span>{option.label}</span>
            {option.recommended && (
              <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Recommended
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
