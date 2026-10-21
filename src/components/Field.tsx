import type { ReactNode } from 'react';

/** Etiket + açıklama + kontrol; erişilebilir label bağlantısı için id gerekir */
export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[1fr_minmax(0,16rem)] sm:items-center sm:gap-6">
      <div>
        <label htmlFor={id} className="font-medium">{label}</label>
        {hint && <p id={`${id}-hint`} className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export const inputClass = 'h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-sm transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 dark:border-slate-700 dark:bg-slate-900';
