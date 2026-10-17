import React from 'react';

interface WizardFooterProps {
  /** Rendered on the bottom-left. A disabled Back button is used on step 1. */
  back?: React.ReactNode;
  /** Rendered on the bottom-right. Usually the Next / Export Prompt action. */
  next?: React.ReactNode;
}

/**
 * Shared footer used by every wizard step so navigation stays in the exact same
 * place: Back on the bottom-left, forward actions on the bottom-right.
 */
export default function WizardFooter({ back, next }: WizardFooterProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row gap-3">{back}</div>
      <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">{next}</div>
    </div>
  );
}

/** Secondary / Back button styling shared by all steps. */
export const SECONDARY_BUTTON_CLASS =
  'px-6 py-3 rounded-xl border border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

/** Primary / Next button styling shared by all steps. */
export function primaryButtonClass(enabled: boolean): string {
  return `px-8 py-3 rounded-xl transition-opacity ${
    enabled
      ? 'btn-accent text-white hover:opacity-90'
      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
  }`;
}
