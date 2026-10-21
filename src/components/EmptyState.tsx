import type { ReactNode } from 'react';

interface Props { emoji?: string; icon?: ReactNode; title: string; text?: string; action?: ReactNode }

/** Boş durum: "Henüz kelime öğrenmedin…" gibi */
export function EmptyState({ emoji, icon, title, text, action }: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center dark:border-slate-700">
      {emoji && <div className="mb-3 text-4xl" aria-hidden="true">{emoji}</div>}
      {icon && <div className="mb-3 text-slate-400" aria-hidden="true">{icon}</div>}
      <h2 className="text-lg font-semibold">{title}</h2>
      {text && <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
