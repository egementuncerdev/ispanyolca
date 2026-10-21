import type { ReactNode } from 'react';

interface Option<T extends string> { value: T; label: string; icon?: ReactNode }

/** Radyo grubu görünümlü seçici (tema vb.) */
export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Option<T>[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex w-full rounded-lg border border-line-2 bg-sunken p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors ${value === o.value ? 'bg-surface text-ink shadow-[0_1px_0_var(--line-2)]' : 'text-muted hover:text-ink'}`}
        >
          {o.icon}{o.label}
        </button>
      ))}
    </div>
  );
}
