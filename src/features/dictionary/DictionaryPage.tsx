import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowLeft, Check, Plus, Search } from 'lucide-react';
import type { Word } from '@/types/content';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { inputClass } from '@/components/Field';
import { ConjugationTable, display, FavoriteButton, Ipa, POS_LABEL, StatusBadge } from '@/components/WordBits';
import { WORD_BY_ID, isVerb } from '@/content/vocabulary';
import { EXTRA } from '@/content/readings/extra';
import { READINGS } from '@/content/readings';
import { readingWords } from '@/lib/reading/lexicon';
import { ALPHABETICAL, searchDictionary, type DictHit } from '@/lib/dictionary/search';
import { toIpa } from '@/lib/text/ipa';
import type { WordStatus } from '@/lib/srs/status';
import { addWord } from '@/lib/srs/study';
import { repos } from '@/lib/storage';
import { useSettings } from '@/app/settings';
import { useWordData } from '@/features/words/useWordData';

/** kelime id → geçtiği okumalar */
const IN_READINGS = (() => {
  const m = new Map<string, { id: string; title: string }[]>();
  for (const r of READINGS) for (const w of readingWords(r)) m.set(w.id, [...(m.get(w.id) ?? []), { id: r.id, title: r.title }]);
  return m;
})();

const hitKey = (h: DictHit) => (h.t === 'word' ? h.word.id : `x:${h.key}`);

export default function DictionaryPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const selected = params.get('k');
  const inputRef = useRef<HTMLInputElement>(null);
  const data = useWordData();
  const { settings } = useSettings();

  const hits: DictHit[] = useMemo(() => (q.trim() ? searchDictionary(q) : ALPHABETICAL.map((word) => ({ t: 'word' as const, word, score: 0 }))), [q]);

  const update = (next: { q?: string; k?: string | null }) => {
    const p = new URLSearchParams(params);
    if (next.q !== undefined) { if (next.q) p.set('q', next.q); else p.delete('q'); }
    if (next.k !== undefined) { if (next.k) p.set('k', next.k); else p.delete('k'); }
    setParams(p, { replace: true });
  };

  useEffect(() => { if (window.matchMedia('(min-width: 1024px)').matches) inputRef.current?.focus(); }, []);

  // masaüstünde seçim yoksa ilk sonuç gösterilir
  const shownKey = selected ?? (q.trim() && hits[0] ? hitKey(hits[0]) : null);
  const index = hits.findIndex((h) => hitKey(h) === shownKey);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const n = Math.min(hits.length - 1, Math.max(0, index + (e.key === 'ArrowDown' ? 1 : -1)));
    if (hits[n]) update({ k: hitKey(hits[n]) });
    document.getElementById(`dict-${n}`)?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <>
      <PageHeader eyebrow="İspanyolca ↔ Türkçe" title="Sözlük" subtitle="İspanyolca ya da Türkçe yaz. Çekimli fiilleri de bulur: tengo, vivimos, me levanto." />

      <label className="relative mb-6 block">
        <span className="sr-only">Sözlükte ara</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input ref={inputRef} type="search" value={q} placeholder="casa, köpek, tengo…" autoComplete="off" spellCheck={false}
          aria-controls="dict-results" aria-describedby="dict-help"
          className={`${inputClass} h-14 pl-12 text-lg`}
          onChange={(e) => { setQ(e.target.value); update({ q: e.target.value, k: null }); }}
          onKeyDown={onKeyDown} />
      </label>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className={selected ? 'hidden lg:block' : ''}>
          <p id="dict-help" className="mb-2 text-sm text-muted" role="status">{q.trim() ? (hits.length ? `${hits.length}${hits.length === 60 ? '+' : ''} sonuç` : 'Sonuç yok') : `${hits.length} kelime, alfabetik`}</p>
          {hits.length > 0 && (
            <ul id="dict-results" aria-label="Sonuçlar" className="max-h-[65vh] divide-y divide-line overflow-y-auto rounded-xl border border-line bg-surface">
              {hits.map((h, i) => {
                const key = hitKey(h);
                const on = key === shownKey;
                return (
                  <li key={key} id={`dict-${i}`}>
                    <button type="button" aria-current={on || undefined} onClick={() => update({ k: key })}
                      className={`flex w-full items-baseline justify-between gap-3 px-4 py-2.5 text-left ${on ? 'bg-accent-soft' : 'hover:bg-sunken/50'}`}>
                      <span className="min-w-0">
                        <span lang="es" className="block truncate font-medium">{h.t === 'word' ? display(h.word) : h.key}</span>
                        <span className="block truncate text-sm text-muted">{h.t === 'word' ? h.word.tr : h.entry.tr}</span>
                      </span>
                      <span className="shrink-0 text-xs text-muted">{h.t === 'word' ? (h.via ? <span lang="es">{h.via.split(' · ')[0]}</span> : POS_LABEL[h.word.partOfSpeech]) : h.entry.kind}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={selected ? '' : 'hidden lg:block'}>
          {selected && <button type="button" onClick={() => update({ k: null })} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink lg:hidden"><ArrowLeft className="size-4" />Sonuçlar</button>}
          {shownKey ? <Detail k={shownKey} via={(() => { const h = hits[index]; return h?.t === 'word' ? h.via : undefined; })()}
            inDeck={(id) => (data.byWord.get(id)?.length ?? 0) > 0} status={(id) => data.status.get(id)} fav={(id) => data.favorites.has(id)}
            onAdd={(w) => addWord(repos, settings, w).then(() => undefined)} />
            : <Card className="text-ink-2">Soldan bir kelime seç ya da yukarıya yazmaya başla.</Card>}
        </div>
      </div>
    </>
  );
}

function Detail({ k, via, inDeck, status, fav, onAdd }: { k: string; via?: string; inDeck: (id: string) => boolean; status: (id: string) => WordStatus | undefined; fav: (id: string) => boolean; onAdd: (w: Word) => Promise<void> }) {
  if (k.startsWith('x:')) {
    const key = k.slice(2), e = EXTRA[key];
    if (!e) return null;
    return (
      <Card className="sm:p-7">
        <p className="eyebrow mb-2">{e.kind}</p>
        <h2 lang="es" className="display text-[2.4rem] leading-none">{key}</h2>
        <p className="mt-2"><span className="ipa text-muted" lang="es-ES-fonipa">/{toIpa(key)}/</span></p>
        <p className="mt-4 text-xl">{e.tr}</p>
        {e.note && <p className="mt-4 border-l-2 border-line-2 pl-3 text-ink-2">{e.note}</p>}
        <p className="mt-6 text-sm text-muted">Dilbilgisi ya da metin kelimesi; kartlara eklenmez.</p>
      </Card>
    );
  }
  const w = WORD_BY_ID[k];
  if (!w) return null;
  const deck = inDeck(w.id);
  const st = status(w.id);
  const readings = IN_READINGS.get(w.id) ?? [];
  const facts = [
    POS_LABEL[w.partOfSpeech],
    w.gender && (w.gender === 'f' ? 'dişil' : 'eril'),
    w.plural && `çoğul: ${w.plural}`,
    w.feminine && w.feminine !== w.es && `dişil: ${w.feminine}`
  ].filter(Boolean).join(' · ');
  return (
    <div className="grid gap-4">
      <Card className="sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {via && <p className="eyebrow mb-2" lang="es">{via}</p>}
            <h2 lang="es" className="display text-[2.4rem] leading-none sm:text-[2.8rem]">{display(w)}</h2>
            <p className="mt-2"><Ipa w={w} /></p>
          </div>
          <FavoriteButton wordId={w.id} active={fav(w.id)} />
        </div>
        <p className="mt-4 text-xl">{w.tr}</p>
        <p className="mt-1 text-sm text-muted">{facts}</p>
        <p lang="es" className="mt-5 border-l-2 border-line-2 pl-3 text-[17px]">{w.exampleEs}<span lang="tr" className="mt-0.5 block text-[15px] text-ink-2">{w.exampleTr}</span></p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {deck ? (
            <span className="inline-flex items-center gap-2 text-sm text-good"><Check className="size-4" />Kartlarında {st && <StatusBadge status={st} />}</span>
          ) : (
            <Button variant="secondary" icon={<Plus className="size-4" />} onClick={() => void onAdd(w)}>Kartlarıma ekle</Button>
          )}
          <Link to={`/kelimeler/${w.id}`} className="ml-auto text-sm text-accent-ink underline decoration-line-2 underline-offset-4 hover:decoration-accent">Kelime sayfası</Link>
        </div>
      </Card>
      {isVerb(w) && <Card className="sm:p-7"><ConjugationTable verb={w} /></Card>}
      {readings.length > 0 && (
        <Card className="sm:p-7">
          <p className="eyebrow mb-3">Geçtiği okumalar</p>
          <ul className="flex flex-wrap gap-2">
            {readings.map((r) => <li key={r.id}><Link to={`/okuma/${r.id}`} lang="es" className="inline-block rounded-full border border-line-2 px-3 py-1 text-sm hover:border-ink-2">{r.title}</Link></li>)}
          </ul>
        </Card>
      )}
    </div>
  );
}
