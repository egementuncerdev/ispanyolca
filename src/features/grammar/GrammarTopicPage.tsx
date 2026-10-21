import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { GRAMMAR, GRAMMAR_BY_ID } from '@/content/grammar';
import { Card } from '@/components/Card';
import { Button, ButtonLink } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { QuestionRunner, type RunResult } from '@/components/quiz/QuestionRunner';
import { useSettings } from '@/app/settings';
import { repos } from '@/lib/storage';
import { dayKey } from '@/lib/time/dayKey';
import { PASS, topicProgress } from '@/lib/grammar/progress';
import { shuffle } from '@/lib/quiz/check';
import type { GrammarTopic } from '@/types/content';

const STEPS = ['Anlatım', 'Örnekler', 'Ne zaman?', 'Mini test', 'Alıştırmalar'] as const;

/** İspanyolca kısımları ayırt etmek için: tablo hücreleri ve örnekler İspanyolca */
function Table({ t }: { t: GrammarTopic }) {
  if (!t.table) return null;
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left text-[15px] ${t.table.headers.length > 2 ? 'min-w-[30rem]' : ''}`}>
        {t.table.caption && <caption className="eyebrow mb-2 text-left" lang="es">{t.table.caption}</caption>}
        <thead><tr className="border-b border-line-2">{t.table.headers.map((h, i) => <th key={i} scope="col" className="py-2 pr-4 font-semibold text-muted">{h}</th>)}</tr></thead>
        <tbody>
          {t.table.rows.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="py-2.5 pr-4 font-normal text-muted">{c}</th> : <td key={j} className="py-2.5 pr-4 font-medium">{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GrammarTopicPage() {
  const { id = '' } = useParams();
  const t = GRAMMAR_BY_ID[id];
  const { settings } = useSettings();
  const [step, setStep] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const exercises = useMemo(() => (t ? shuffle(t.questions) : []), [t, runKey]);
  const results = useLiveQuery(() => repos.quizResults.byKind('grammar'), [], []);
  const progress = t ? topicProgress(results).get(t.id) : undefined;

  useEffect(() => { setStep(0); setRunKey((k) => k + 1); }, [id]);
  useEffect(() => { topRef.current?.scrollIntoView({ block: 'start' }); }, [step]);

  if (!t) return <EmptyState title="Konu bulunamadı" action={<ButtonLink to="/grammar" variant="secondary">Grammar’a dön</ButtonLink>} />;
  const idx = GRAMMAR.indexOf(t);
  const nextTopic = GRAMMAR[idx + 1];

  const save = async (kind: 'grammar' | 'grammar_check', r: RunResult) => {
    const now = new Date();
    const dk = dayKey(now, settings.timezone, settings.dayStartsAt);
    await repos.quizResults.add({ kind, sourceId: t.id, correct: r.correct, total: r.total, wrongIds: r.wrong.map((q) => q.id), finishedAt: now.toISOString(), dayKey: dk });
    if (kind === 'grammar') await repos.events.add({ type: 'grammar_done', refId: t.id, value: Math.round((r.correct / r.total) * 100), at: now.toISOString(), dayKey: dk });
  };

  const nav = (
    <div className="mt-6 flex justify-between gap-3">
      {step > 0 ? <Button variant="ghost" icon={<ArrowLeft className="size-4" />} onClick={() => setStep(step - 1)}>{STEPS[step - 1]}</Button> : <span />}
      {step < STEPS.length - 1 && <Button onClick={() => setStep(step + 1)}>{STEPS[step + 1]} <ArrowRight className="size-4" /></Button>}
    </div>
  );

  return (
    <div ref={topRef} className="scroll-mt-6">
      <Link to="/grammar" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="size-4" strokeWidth={1.75} /> Grammar</Link>
      <header className="mb-6">
        <p className="eyebrow mb-2">{idx + 1}. konu · {t.level}{progress ? ` · en iyi %${Math.round(progress.best * 100)}` : ''}</p>
        <h1 className="display text-[2.4rem] leading-[1.05] sm:text-[3rem]">{t.title}</h1>
      </header>

      <nav aria-label="Konu adımları" className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
        {STEPS.map((s, i) => (
          <button key={s} type="button" onClick={() => setStep(i)} aria-current={step === i ? 'step' : undefined}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium ${step === i ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
            <span className="mr-1.5 tabular-nums text-muted">{i + 1}</span>{s}
          </button>
        ))}
      </nav>

      {step === 0 && (
        <>
          <Card className="sm:p-8">
            <p className="text-lg leading-relaxed">{t.summary}</p>
            {t.table && <div className="mt-6 border-t border-line pt-6" lang="es"><Table t={t} /></div>}
          </Card>
          {nav}
        </>
      )}

      {step === 1 && (
        <>
          <ul className="grid gap-3">
            {t.examples.map((e) => (
              <li key={e.es}><Card className="sm:px-7"><p lang="es" className="display text-[1.6rem] leading-snug">{e.es}</p><p className="mt-1 text-ink-2">{e.tr}</p></Card></li>
            ))}
          </ul>
          {nav}
        </>
      )}

      {step === 2 && (
        <>
          <Card className="sm:p-8">
            <ul className="grid gap-3">
              {t.usage.map((u) => <li key={u} className="relative pl-5 text-[16px] leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:rounded-full before:bg-accent">{u}</li>)}
            </ul>
            {t.notes && t.notes.length > 0 && (
              <div className="mt-6 border-t border-line pt-5">
                <p className="eyebrow mb-2">Not</p>
                {t.notes.map((n) => <p key={n} className="text-ink-2">{n}</p>)}
              </div>
            )}
          </Card>
          {nav}
        </>
      )}

      {step === 3 && (
        <>
          <p className="mb-4 text-ink-2">Anlatılanları hatırlıyor musun? {t.check.length} kısa soru.</p>
          <QuestionRunner key={`check-${runKey}`} questions={t.check} strictAccents={settings.strictAccents} compact
            onFinish={(r) => void save('grammar_check', r)} doneLabel="Alıştırmalara geç" onDone={() => setStep(4)} />
          {nav}
        </>
      )}

      {step === 4 && (
        <>
          <p className="mb-4 text-ink-2">{t.questions.length} alıştırma. %{Math.round(PASS * 100)} ve üstü konuyu tamamlar.</p>
          <QuestionRunner key={`ex-${runKey}`} questions={exercises} strictAccents={settings.strictAccents}
            onFinish={(r) => void save('grammar', r)}
            doneLabel={nextTopic ? `Sıradaki konu: ${nextTopic.title}` : 'Grammar’a dön'}
            onDone={() => { setRunKey((k) => k + 1); navigate(nextTopic ? `/grammar/${nextTopic.id}` : '/grammar'); }} />
          <div className="mt-6"><Button variant="ghost" icon={<ArrowLeft className="size-4" />} onClick={() => setStep(3)}>Mini test</Button></div>
        </>
      )}
    </div>
  );
}
