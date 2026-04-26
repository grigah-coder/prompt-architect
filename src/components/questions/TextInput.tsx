import { Question } from '../../lib/schema';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ question, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-white/80 mb-2">{question.label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-white/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 p-3 resize-none"
      />
    </div>
  );
}