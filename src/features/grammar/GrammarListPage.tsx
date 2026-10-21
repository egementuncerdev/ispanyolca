import { Link } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { Check } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { GRAMMAR } from '@/content/grammar';
import { repos } from '@/lib/storage';
import { topicProgress } from '@/lib/grammar/progress';

export default function GrammarListPage() {
  const results = useLiveQuery(() => repos.quizResults.byKind('grammar'), [], []);
  const progress = topicProgress(results);
  const done = GRAMMAR.filter((t) => progress.get(t.id)?.done).length;
  const next = GRAMMAR.find((t) => !progress.get(t.id)?.done);

  return (
    <>
      <PageHeader eyebrow={`A1 · ${done} / ${GRAMMAR.length} konu tamamlandı`} title="Grammar"
        subtitle="Her konu önce kısaca anlatılır; ardından mini test ve alıştırmalar gelir. Alıştırmalarda %70 ve üstü konuyu tamamlar." />
      {next && (
        <Link to={`/grammar/${next.id}`} className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-line-2 bg-surface p-5 hover:border-ink-2">
          <div>
            <p className="eyebrow mb-1">Sıradaki konu</p>
            <p className="display text-2xl">{next.title}</p>
          </div>
          <span className="text-accent-ink">Başla →</span>
        </Link>
      )}
      <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {GRAMMAR.map((t, i) => {
          const p = progress.get(t.id);
          return (
            <li key={t.id}>
              <Link to={`/grammar/${t.id}`} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-4 py-4 hover:bg-sunken/50 sm:px-5">
                <span className={`grid size-8 place-items-center rounded-full border text-sm tabular-nums ${p?.done ? 'border-good bg-good-soft text-good' : 'border-line-2 text-muted'}`}>
                  {p?.done ? <Check className="size-4" strokeWidth={2.25} aria-label="Tamamlandı" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="display block text-[1.25rem] leading-tight">{t.title}</span>
                  <span className="mt-0.5 block truncate text-sm text-muted">{t.summary}</span>
                </span>
                <span className="text-right text-sm tabular-nums text-muted">{p ? `%${Math.round(p.best * 100)}` : t.level}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
