import { Question, QuestionType } from '../../lib/schema';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ question, value, onChange }: Props) {
  const isTextarea = question.type === QuestionType.TEXTAREA;

  return (
    <div className="mb-4">
      <label className="block text-white/80 mb-2">{question.label}</label>
      {isTextarea ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 p-3 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 p-3"
        />
      )}
    </div>
  );
}