import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ArrowRight, Check, Languages, Plus } from 'lucide-react';
import { READINGS, READING_BY_ID, KIND_LABEL } from '@/content/readings';
import { TOPIC_LABEL } from '@/content/vocabulary';
import type { Word } from '@/types/content';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { display, StatusBadge } from '@/components/WordBits';
import { QuestionRunner } from '@/components/quiz/QuestionRunner';
import { readingWords, tokenize, wordCount } from '@/lib/reading/lexicon';
import { addWord } from '@/lib/srs/study';
import { saveResult } from '@/lib/games/record';
import { repos } from '@/lib/storage';
import { useSettings } from '@/app/settings';
import { useWordData } from '@/features/words/useWordData';
import { WordPopover, type PopoverEntry } from './WordPopover';

export default function ReadingPage() {
  const { id = '' } = useParams();
  const r = READING_BY_ID[id];
  const { settings } = useSettings();
  const data = useWordData();
  const [showTr, setShowTr] = useState(false);
  const [active, setActive] = useState<{ key: string; entry: PopoverEntry; el: HTMLElement } | null>(null);
  const [runKey, setRunKey] = useState(0);
  const results = useLiveQuery(() => repos.quizResults.byKind('reading').then((rs) => rs.filter((x) => x.sourceId === id)), [id], []);

  const paragraphs = useMemo(() => (r ? r.paragraphs.map((p) => ({ ...p, tokens: tokenize(p.es, r) })) : []), [r]);
  const words = useMemo(() => (r ? readingWords(r) : []), [r]);
  const close = useCallback((refocus = true) => { const el = active?.el; setActive(null); if (refocus) el?.focus(); }, [active]);
  const add = useCallback(async (w: Word) => { await addWord(repos, settings, w); }, [settings]);

  if (!r) return <EmptyState title="Metin bulunamadı" action={<Link to="/okuma" className="text-accent-ink underline">Okumalara dön</Link>} />;

  const inDeck = (wid: string) => (data.byWord.get(wid)?.length ?? 0) > 0;
  const missing = words.filter((w) => !inDeck(w.id));
  const best = results.reduce((b, x) => Math.max(b, x.correct / Math.max(1, x.total)), -1);
  const i = READINGS.indexOf(r);
  const prev = READINGS[i - 1], next = READINGS[i + 1];
  const minutes = Math.max(1, Math.round(wordCount(r) / 60));

  return (
    <>
      <Link to="/okuma" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="size-4" strokeWidth={1.75} /> Okuma</Link>

      <header className="mb-8 border-b border-line pb-6">
        <p className="eyebrow mb-2">{KIND_LABEL[r.kind]} · {r.level} · {TOPIC_LABEL[r.topic]} · {minutes} dk</p>
        <h1 lang="es" className="display text-[2.3rem] leading-[1.05] sm:text-[3rem]">{r.title}</h1>
        <p className="mt-2 text-ink-2">{r.titleTr}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Bir kelimeye dokun: anlamı, telaffuzu ve örneği açılır. <span className="whitespace-nowrap"><span className="border-b border-dotted border-accent">Turuncu</span>: kartlarında olmayan.</span></p>
            <Button variant="secondary" size="sm" aria-pressed={showTr} onClick={() => setShowTr((v) => !v)} icon={<Languages className="size-4" strokeWidth={1.75} />}>
              {showTr ? 'Türkçesini gizle' : 'Türkçesini göster'}
            </Button>
          </div>

          <div className="space-y-6">
            {paragraphs.map((p, pi) => (
              <div key={pi}>
                <p lang="es" className="display text-[1.35rem] leading-[1.75] sm:text-[1.5rem]">
                  {p.tokens.map((tk, ti) => {
                    if (tk.t !== 'word' && tk.t !== 'extra') return <span key={ti}>{tk.text}</span>;
                    const key = `${pi}-${ti}`;
                    const isOpen = active?.key === key;
                    const fresh = tk.t === 'word' && !inDeck(tk.word.id);
                    return (
                      <button key={ti} type="button" aria-expanded={isOpen} aria-haspopup="dialog"
                        onClick={(e) => (isOpen ? close() : setActive({ key, entry: tk, el: e.currentTarget }))}
                        className={`rounded-sm transition-colors hover:bg-accent-soft ${isOpen ? 'bg-accent-soft' : ''} ${tk.t === 'word' ? `border-b border-dotted ${fresh ? 'border-accent' : 'border-line-2'}` : ''}`}>
                        {tk.text}
                      </button>
                    );
                  })}
                </p>
                {showTr && <p className="mt-2 border-l-2 border-line-2 pl-3 text-[15px] text-ink-2">{p.tr}</p>}
              </div>
            ))}
          </div>
        </article>

        <aside aria-labelledby="words-h" className="lg:sticky lg:top-8 lg:self-start">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 id="words-h" className="eyebrow">Bu metindeki kelimeler · {words.length}</h2>
          </div>
          {missing.length > 0 ? (
            <Button variant="secondary" size="sm" className="mb-3 w-full" icon={<Plus className="size-4" />}
              onClick={async () => { for (const w of missing) await addWord(repos, settings, w); }}>
              Eksik {missing.length} kelimeyi kartlarıma ekle
            </Button>
          ) : (
            <p className="mb-3 flex items-center gap-1.5 text-sm text-good"><Check className="size-4" />Hepsi kartlarında</p>
          )}
          <ul className="max-h-[28rem] divide-y divide-line overflow-y-auto rounded-xl border border-line bg-surface">
            {words.map((w) => (
              <li key={w.id}>
                <Link to={`/kelimeler/${w.id}`} className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-sunken/50">
                  <span className="min-w-0">
                    <span lang="es" className="block truncate font-medium">{display(w)}</span>
                    <span className="block truncate text-sm text-muted">{w.tr}</span>
                  </span>
                  {inDeck(w.id) ? <StatusBadge status={data.status.get(w.id)!} /> : <span className="shrink-0 text-xs text-accent-ink">yeni</span>}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section aria-labelledby="q-h" className="mt-12 max-w-3xl">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="q-h" className="display text-2xl">Anladın mı?</h2>
          {best >= 0 && <p className="text-sm text-muted">En iyi sonucun: %{Math.round(best * 100)}</p>}
        </div>
        <QuestionRunner key={`${id}-${runKey}`} questions={r.questions} strictAccents={settings.strictAccents} compact
          onFinish={(res) => void saveResult(repos, settings, 'reading', r.id, res.correct, res.total)}
          doneLabel="Baştan çöz" onDone={() => setRunKey((k) => k + 1)} />
      </section>

      <nav aria-label="Diğer metinler" className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link to={`/okuma/${prev.id}`} className="rounded-xl border border-line p-4 hover:border-line-2">
            <span className="flex items-center gap-1 text-sm text-muted"><ArrowLeft className="size-4" />Önceki</span>
            <span lang="es" className="display mt-1 block text-xl">{prev.title}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link to={`/okuma/${next.id}`} className="rounded-xl border border-line p-4 text-right hover:border-line-2">
            <span className="flex items-center justify-end gap-1 text-sm text-muted">Sonraki<ArrowRight className="size-4" /></span>
            <span lang="es" className="display mt-1 block text-xl">{next.title}</span>
          </Link>
        )}
      </nav>

      {active && (
        <WordPopover entry={active.entry} anchor={active.el} onClose={close} onAdd={add}
          inDeck={active.entry.t === 'word' && inDeck(active.entry.word.id)}
          status={active.entry.t === 'word' ? data.status.get(active.entry.word.id) : undefined} />
      )}
    </>
  );
}
