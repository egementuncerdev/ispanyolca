import type { ReactNode } from 'react';

interface Option<T extends string> { value: T; label: string; icon?: ReactNode }

/** Radyo grubu görünümlü seçici (tema vb.) */
export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Option<T>[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex w-full rounded-xl border border-slate-300 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors ${value === o.value ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
        >
          {o.icon}{o.label}
        </button>
      ))}
    </div>
  );
}
