import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SelectableCardProps {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
  description?: string;
}

export default function SelectableCard({
  value,
  label,
  isSelected,
  onClick,
  disabled = false,
  icon: Icon,
  description
}: SelectableCardProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
        isSelected
          ? 'border-emerald-400 bg-emerald-900/20 text-emerald-300 ring-2 ring-emerald-400/50'
          : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="text-center">
        {Icon && (
          <motion.div
            className="mb-4"
            animate={isSelected ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Icon size={48} className={isSelected ? 'text-emerald-400' : 'text-slate-400'} />
          </motion.div>
        )}
        <div className="text-lg font-medium mb-2">{label}</div>
        {description && (
          <div className={`text-sm ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
            {description}
          </div>
        )}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 bg-emerald-400 rounded-full mx-auto mt-3"
          />
        )}
      </div>
    </motion.button>
  );
}