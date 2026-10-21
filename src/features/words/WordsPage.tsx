import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { LayoutGrid, List, Play, Search } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { PageHeader } from '@/components/PageHeader';
import { ButtonLink } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { inputClass } from '@/components/Field';
import { display, FavoriteButton, Ipa, POS_LABEL, StatusBadge } from '@/components/WordBits';
import { TOPICS, TOPIC_LABEL, WORDS } from '@/content/vocabulary';
import { stripAccents } from '@/lib/text/normalize';
import { STATUS_LABEL, type WordStatus } from '@/lib/srs/status';
import { repos } from '@/lib/storage';
import { todayPlan } from '@/lib/srs/study';
import { useSettings } from '@/app/settings';
import { useWordData } from './useWordData';

type Tab = 'all' | 'fav' | 'hard';
const TABS: { id: Tab; label: string }[] = [{ id: 'all', label: 'Tümü' }, { id: 'fav', label: 'Favoriler' }, { id: 'hard', label: 'Zorlandıklarım' }];
const norm = (s: string) => stripAccents(s.toLocaleLowerCase('tr'));

export default function WordsPage() {
  const { settings } = useSettings();
  const data = useWordData();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('sekme') as Tab) || 'all';
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<WordStatus | ''>('');
  const [view, setView] = useState<'grid' | 'list'>(() => { try { return (localStorage.getItem('wordsView') as 'grid' | 'list') || 'grid'; } catch { return 'grid'; } });
  const plan = useLiveQuery(() => todayPlan(repos, settings), [settings, data.cards]);

  const setView2 = (v: 'grid' | 'list') => { setView(v); try { localStorage.setItem('wordsView', v); } catch { /* */ } };

  const list = useMemo(() => {
    let ws = WORDS;
    if (tab === 'fav') ws = ws.filter((w) => data.favorites.has(w.id));
    if (tab === 'hard') ws = ws.filter((w) => (data.errors.get(w.id) ?? 0) > 0).sort((a, b) => (data.errors.get(b.id) ?? 0) - (data.errors.get(a.id) ?? 0));
    if (topic) ws = ws.filter((w) => w.tags.includes(topic));
    if (status) ws = ws.filter((w) => data.status.get(w.id) === status);
    if (q.trim()) {
      const n = norm(q.trim());
      ws = ws.filter((w) => norm(w.es).includes(n) || norm(w.tr).includes(n) || (w.feminine && norm(w.feminine).includes(n)));
    }
    return ws;
  }, [tab, topic, status, q, data]);

  const counts = useMemo(() => {
    const c: Record<WordStatus, number> = { new: 0, learning: 0, known: 0, mastered: 0 };
    for (const s of data.status.values()) c[s]++;
    return c;
  }, [data.status]);

  const work = (plan?.due.length ?? 0) + (plan?.newWords.length ?? 0);

  return (
    <>
      <PageHeader
        eyebrow={`${WORDS.length} kelime · ${counts.learning + counts.known + counts.mastered} çalışılıyor`}
        title="Kelimeler"
        subtitle="Kartlar, aralıklı tekrarla doğru zamanda karşına çıkar."
        actions={<ButtonLink to="/calis" variant={work ? 'primary' : 'secondary'} icon={<Play className="size-4" strokeWidth={2} />}>{work ? `Çalış · ${plan!.due.length} tekrar, ${plan!.newWords.length} yeni` : 'Bugünlük bitti'}</ButtonLink>}
      />

      <dl className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {(Object.keys(counts) as WordStatus[]).map((k) => (
          <div key={k} className="bg-surface px-4 py-3">
            <dt className="eyebrow">{STATUS_LABEL[k]}</dt>
            <dd className="display mt-1 text-3xl">{counts[k]}</dd>
          </div>
        ))}
      </dl>

      <div role="tablist" aria-label="Kelime listesi" className="mb-4 flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setParams(t.id === 'all' ? {} : { sekme: t.id })}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium ${tab === t.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
            {t.label}{t.id === 'fav' && data.favorites.size ? ` · ${data.favorites.size}` : ''}
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative">
          <span className="sr-only">Ara</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input type="search" className={`${inputClass} pl-9`} placeholder="İspanyolca ya da Türkçe ara…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label><span className="sr-only">Konu</span>
          <select className={inputClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">Bütün konular</option>
            {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </label>
        <label><span className="sr-only">Durum</span>
          <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as WordStatus | '')}>
            <option value="">Her durum</option>
            {(Object.keys(STATUS_LABEL) as WordStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
        <div className="flex justify-self-start rounded-lg border border-line-2 bg-sunken p-1" role="group" aria-label="Görünüm">
          {([['grid', LayoutGrid, 'Kart'], ['list', List, 'Liste']] as const).map(([v, Icon, label]) => (
            <button key={v} type="button" onClick={() => setView2(v)} aria-pressed={view === v} aria-label={label} className={`grid size-9 place-items-center rounded-md ${view === v ? 'bg-surface text-ink' : 'text-muted'}`}>
              <Icon className="size-4" strokeWidth={1.75} />
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={tab === 'fav' ? 'Henüz favori kelimen yok' : tab === 'hard' ? 'Zorlandığın kelime yok' : 'Sonuç bulunamadı'}
          text={tab === 'fav' ? 'Bir kelimedeki yıldıza dokunarak favorilere ekleyebilirsin.' : tab === 'hard' ? 'Tekrarlarda “Unuttum” ya da “Zorlandım” dediğin kelimeler burada toplanır.' : 'Aramayı ya da filtreleri değiştirmeyi dene.'}
        />
      ) : view === 'grid' ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((w) => (
            <li key={w.id}>
              <Link to={`/kelimeler/${w.id}`} className="group flex h-full flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p lang="es" className="display truncate text-[1.4rem] leading-tight group-hover:text-accent-ink">{display(w)}</p>
                    <p className="mt-0.5 truncate text-ink-2">{w.tr}</p>
                  </div>
                  <FavoriteButton wordId={w.id} active={data.favorites.has(w.id)} size="sm" />
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs">
                  <span className="text-muted">{POS_LABEL[w.partOfSpeech]} · {TOPIC_LABEL[w.tags[0]!]}{tab === 'hard' ? ` · ${data.errors.get(w.id)} hata` : ''}</span>
                  <StatusBadge status={data.status.get(w.id)!} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {list.map((w) => (
            <li key={w.id}>
              <Link to={`/kelimeler/${w.id}`} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 hover:bg-sunken/50 sm:grid-cols-[14rem_1fr_auto_auto]">
                <span lang="es" className="font-medium">{display(w)} <Ipa w={w} className="hidden text-sm font-normal md:inline" /></span>
                <span className="col-span-2 row-start-2 text-ink-2 sm:col-span-1 sm:row-start-auto">{w.tr}</span>
                <span className="hidden sm:block"><StatusBadge status={data.status.get(w.id)!} /></span>
                <FavoriteButton wordId={w.id} active={data.favorites.has(w.id)} size="sm" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
