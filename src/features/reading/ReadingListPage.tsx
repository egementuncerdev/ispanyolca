import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { Check } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Segmented } from '@/components/Segmented';
import { EmptyState } from '@/components/EmptyState';
import { inputClass } from '@/components/Field';
import { READINGS, KIND_LABEL } from '@/content/readings';
import { TOPIC_LABEL } from '@/content/vocabulary';
import { wordCount } from '@/lib/reading/lexicon';
import { repos } from '@/lib/storage';
import type { Level, Reading } from '@/types/content';

type Kind = 'all' | Reading['kind'];
const LEVELS = [...new Set(READINGS.map((r) => r.level))] as Level[];
const TOPICS_USED = [...new Set(READINGS.map((r) => r.topic))];

export default function ReadingListPage() {
  const [kind, setKind] = useState<Kind>('all');
  const [level, setLevel] = useState<Level | ''>('');
  const [topic, setTopic] = useState('');
  const results = useLiveQuery(() => repos.quizResults.byKind('reading'), [], []);

  const best = useMemo(() => {
    const m = new Map<string, number>();
    for (const x of results) if (x.sourceId) m.set(x.sourceId, Math.max(m.get(x.sourceId) ?? 0, x.correct / Math.max(1, x.total)));
    return m;
  }, [results]);

  const list = READINGS.filter((r) => (kind === 'all' || r.kind === kind) && (!level || r.level === level) && (!topic || r.topic === topic));
  const done = READINGS.filter((r) => (best.get(r.id) ?? 0) >= 0.7).length;

  return (
    <>
      <PageHeader eyebrow={`${READINGS.length} metin · ${done} tamamlandı`} title="Okuma"
        subtitle="Kısa A1 metinleri ve mini hikâyeler. Her kelimeye dokunup anlamını görebilir, sonunda soruları çözebilirsin." />

      <div className="mb-6 grid gap-3 sm:grid-cols-[minmax(0,18rem)_auto_auto] sm:items-center">
        <Segmented label="Tür" value={kind} onChange={setKind}
          options={[{ value: 'all', label: 'Hepsi' }, { value: 'text', label: 'Metinler' }, { value: 'story', label: 'Hikâyeler' }]} />
        <label><span className="sr-only">Seviye</span>
          <select className={inputClass} value={level} onChange={(e) => setLevel(e.target.value as Level | '')}>
            <option value="">Bütün seviyeler</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label><span className="sr-only">Konu</span>
          <select className={inputClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">Bütün konular</option>
            {TOPICS_USED.map((t) => <option key={t} value={t}>{TOPIC_LABEL[t]}</option>)}
          </select>
        </label>
      </div>

      {list.length === 0 ? <EmptyState title="Bu filtrede metin yok" text="Konu ya da türü değiştirmeyi dene." /> : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((r) => {
            const b = best.get(r.id);
            const passed = (b ?? 0) >= 0.7;
            return (
              <li key={r.id}>
                <Link to={`/okuma/${r.id}`} className="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-2">
                  <span className="eyebrow">{KIND_LABEL[r.kind]} · {r.level} · {TOPIC_LABEL[r.topic]}</span>
                  <span lang="es" className="display mt-2 block text-[1.6rem] leading-tight group-hover:text-accent-ink">{r.title}</span>
                  <span className="mt-1 block text-ink-2">{r.titleTr}</span>
                  <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-sm text-muted">
                    <span>{wordCount(r)} kelime · {r.questions.length} soru</span>
                    {b !== undefined && (
                      <span className={`inline-flex items-center gap-1 ${passed ? 'text-good' : ''}`}>{passed && <Check className="size-4" />}%{Math.round(b * 100)}</span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
