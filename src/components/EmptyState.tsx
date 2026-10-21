import type { ReactNode } from 'react';

interface Props { icon?: ReactNode; title: string; text?: string; action?: ReactNode }

/** Boş durum: kısa başlık, açıklama ve tek bir eylem */
export function EmptyState({ icon, title, text, action }: Props) {
  return (
    <div className="rounded-xl border border-line bg-surface px-6 py-12 sm:px-10">
      {icon && <div className="mb-5 grid size-11 place-items-center rounded-full border border-line-2 text-accent-ink" aria-hidden="true">{icon}</div>}
      <h2 className="display text-2xl">{title}</h2>
      {text && <p className="mt-2 max-w-lg text-ink-2">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
