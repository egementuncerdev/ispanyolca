import type { ReactNode } from 'react';

export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow?: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="display text-[2.1rem] leading-[1.05] sm:text-[2.6rem]">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-ink-2">{subtitle}</p>}
      </div>
      {actions}
    </header>
  );
}
