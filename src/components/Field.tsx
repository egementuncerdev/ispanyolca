import type { ReactNode } from 'react';

/** Etiket + açıklama + kontrol; erişilebilir label bağlantısı için id gerekir */
export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[1fr_minmax(0,16rem)] sm:items-center sm:gap-6">
      <div>
        <label htmlFor={id} className="font-medium">{label}</label>
        {hint && <p id={`${id}-hint`} className="text-sm text-muted">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export const inputClass = 'h-11 w-full rounded-lg border border-line-2 bg-surface px-3 text-[15px] text-ink transition-colors focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/20';
