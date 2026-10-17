import { Question, QuestionType } from '../../lib/schema';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ question, value, onChange }: Props) {
  const isTextarea = question.type === QuestionType.TEXTAREA;

  return (
    <div className="mb-6">
      <label className="block text-white mb-1 font-medium">{question.label}</label>
      {question.hint && (
        <p className="text-sm text-slate-400 mb-3">{question.hint}</p>
      )}
      {isTextarea ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 focus:text-emerald-300 focus:bg-emerald-900/20 p-4 resize-none transition-all duration-300 placeholder:text-slate-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 focus:text-emerald-300 focus:bg-emerald-900/20 p-4 transition-all duration-300 placeholder:text-slate-500"
        />
      )}
    </div>
  );
}