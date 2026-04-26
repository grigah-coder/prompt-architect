import { Question } from '../../lib/schema';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function ToggleSwitch({ question, value, onChange }: Props) {
  const isOn = value === 'true';
  return (
    <div className="mb-4">
      <label className="block text-white/80 mb-2">{question.label}</label>
      <button
        onClick={() => onChange(isOn ? 'false' : 'true')}
        className={`px-4 py-2 rounded-lg border transition-all ${
          isOn
            ? 'bg-white/15 border-white/30 ring-1 ring-purple-500/50 text-white'
            : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
        }`}
      >
        {isOn ? 'Yes' : 'No'}
      </button>
    </div>
  );
}