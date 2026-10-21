import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, Check, Lock, Plus } from 'lucide-react';
import type { Unit } from '@/types/content';
import { UNIT_BY_ID, UNITS } from '@/content/course/units';
import { Card } from '@/components/Card';
import { Button, ButtonLink } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { GrammarTable } from '@/components/grammar/GrammarTable';
import { QuestionRunner } from '@/components/quiz/QuestionRunner';
import { display, StatusBadge } from '@/components/WordBits';
import { PASS, practiceQuestions, quizQuestions, saveStep, STEPS, testQuestions, unitReadings, unitTopics, unitWords, type StepId, type UnitProgress } from '@/lib/course/progress';
import { addWord } from '@/lib/srs/study';
import { markForgotten } from '@/lib/games/record';
import { repos } from '@/lib/storage';
import { useSettings } from '@/app/settings';
import { useWordData } from '@/features/words/useWordData';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCourse } from './useCourse';

const label = (s: StepId) => STEPS.find((x) => x.id === s)!.label;
const nextOf = (s: StepId): StepId | null => STEPS[STEPS.findIndex((x) => x.id === s) + 1]?.id ?? null;

export default function UnitPage() {
  const { unitId = '', step } = useParams();
  const unit = UNIT_BY_ID[unitId];
  const data = useCourse();
  const topRef = useRef<HTMLDivElement>(null);
  useEffect(() => { topRef.current?.scrollIntoView({ block: 'start' }); }, [step]);

  if (!unit) return <EmptyState title="Ünite bulunamadı" action={<ButtonLink to="/kurs" variant="secondary">Kursa dön</ButtonLink>} />;
  if (!data) return <p className="py-20 text-center text-muted" role="status">Yükleniyor…</p>;
  const entry = data.units.find((x) => x.unit.id === unit.id)!;
  const { progress, unlocked } = entry;
  if (!unlocked) {
    const prev = UNITS[unit.order - 2]!;
    return <EmptyState icon={<Lock className="size-5" strokeWidth={1.75} />} title={`Ünite ${unit.order} henüz kilitli`} text={`Önce “${prev.title}” ünitesinin testini %${PASS * 100} ile geç.`} action={<ButtonLink to={`/kurs/${prev.id}`}>Ünite {prev.order}’e git</ButtonLink>} />;
  }
  const current = (STEPS.some((s) => s.id === step) ? step : null) as StepId | null;
  if (!current) return <Navigate to={`/kurs/${unit.id}/${progress.next ?? 'test'}`} replace />;
  const st = progress.steps[current];

  return (
    <div ref={topRef} className="scroll-mt-6">
      <Link to="/kurs" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="size-4" strokeWidth={1.75} /> Kurs</Link>
      <header className="mb-6">
        <p className="eyebrow mb-2">Ünite {unit.order} · {unit.titleTr} · %{progress.percent}{progress.completed ? ' · tamamlandı' : ''}</p>
        <h1 lang="es" className="display text-[2.4rem] leading-[1.05] sm:text-[3rem]">{unit.title}</h1>
        <p className="mt-2 max-w-2xl text-ink-2">{unit.goal}</p>
      </header>

      <nav aria-label="Ünite adımları" className="mb-8 flex gap-1 overflow-x-auto border-b border-line">
        {STEPS.map((s, i) => {
          const x = progress.steps[s.id];
          const cls = `-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium ${current === s.id ? 'border-accent text-ink' : 'border-transparent text-muted'}`;
          const icon = x.done ? <Check className="size-3.5 text-good" strokeWidth={2.5} aria-label="tamam" /> : !x.open ? <Lock className="size-3.5" strokeWidth={1.75} aria-label="kilitli" /> : <span className="tabular-nums">{i + 1}</span>;
          return x.open
            ? <Link key={s.id} to={`/kurs/${unit.id}/${s.id}`} aria-current={current === s.id ? 'step' : undefined} className={`${cls} hover:text-ink`}>{icon}{s.label}</Link>
            : <span key={s.id} className={cls} aria-disabled="true">{icon}{s.label}</span>;
        })}
      </nav>

      {!st.open ? (
        <EmptyState icon={<Lock className="size-5" strokeWidth={1.75} />} title={`${label(current)} henüz kilitli`} text="Adımlar sırayla açılır."
          action={<ButtonLink to={`/kurs/${unit.id}/${progress.next}`}>{label(progress.next!)} adımına git</ButtonLink>} />
      ) : (
        <>
          {current === 'ders' && <Lesson unit={unit} progress={progress} />}
          {current === 'kelimeler' && <Words unit={unit} progress={progress} />}
          {current === 'alistirma' && <Scored key={`a-${unit.id}`} unit={unit} step="alistirma" progress={progress} intro="Dersteki konulardan karışık alıştırmalar." make={() => practiceQuestions(unit)} />}
          {current === 'quiz' && <Scored key={`q-${unit.id}`} unit={unit} step="quiz" progress={progress} intro="Ünitenin kelimelerinden: anlam, yazım ve boşluk doldurma." make={() => quizQuestions(unit)} />}
          {current === 'okuma' && <Readings unit={unit} progress={progress} />}
          {current === 'test' && <Scored key={`t-${unit.id}`} unit={unit} step="test" progress={progress} intro="Ünitenin bütün konularından ve kelimelerinden. Geçince ünite tamamlanır." make={() => testQuestions(unit)} />}
        </>
      )}
    </div>
  );
}

function NextButton({ unit, step, progress }: { unit: Unit; step: StepId; progress: UnitProgress }) {
  const n = nextOf(step);
  if (!progress.steps[step].done || !n) return null;
  return <ButtonLink to={`/kurs/${unit.id}/${n}`} icon={<ArrowRight className="size-4" />}>{label(n)} adımına geç</ButtonLink>;
}

function Lesson({ unit, progress }: { unit: Unit; progress: UnitProgress }) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const topics = unitTopics(unit);
  return (
    <>
      <p className="mb-6 text-ink-2">Bu ünitenin {topics.length} konusu. Kısaca oku; ayrıntılar ve mini testler konu sayfasında.</p>
      <div className="grid gap-5">
        {topics.map((t, i) => (
          <Card key={t.id} className="min-w-0 sm:p-8">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="display text-[1.8rem] leading-tight"><span className="mr-2 text-muted">{i + 1}.</span>{t.title}</h2>
              <Link to={`/grammar/${t.id}`} className="text-sm text-accent-ink underline decoration-line-2 underline-offset-4 hover:decoration-accent">Konu sayfası</Link>
            </div>
            <p className="text-[17px] leading-relaxed">{t.summary}</p>
            {t.table && <div className="mt-5 border-t border-line pt-5" lang="es"><GrammarTable t={t} /></div>}
            <ul className="mt-5 grid gap-2 border-t border-line pt-5">
              {t.usage.map((x) => <li key={x} className="relative pl-5 leading-relaxed text-ink-2 before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:rounded-full before:bg-accent">{x}</li>)}
            </ul>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {t.examples.slice(0, 2).map((e) => <p key={e.es} className="rounded-lg bg-sunken px-4 py-3"><span lang="es" className="display block text-lg leading-snug">{e.es}</span><span className="text-sm text-ink-2">{e.tr}</span></p>)}
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        {progress.steps.ders.done
          ? <NextButton unit={unit} step="ders" progress={progress} />
          : <Button size="lg" icon={<Check className="size-4" />} onClick={async () => { await saveStep(repos, settings, unit, 'ders', 1, 1); navigate(`/kurs/${unit.id}/kelimeler`); }}>Dersi bitirdim</Button>}
      </div>
    </>
  );
}

function Words({ unit, progress }: { unit: Unit; progress: UnitProgress }) {
  const { settings } = useSettings();
  const data = useWordData();
  const words = unitWords(unit);
  const [done, total] = progress.steps.kelimeler.count!;
  const missing = words.filter((w) => !data.byWord.get(w.id)?.length);
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-ink-2">Kelimeler 5’erli tanıtılır, ardından sorulur. Bir oturumda en çok 10 yeni kelime.</p>
          <p className="mt-1 text-sm text-muted">{done} / {total} kelime kartlarında</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {missing.length > 0 && <ButtonLink to={`/calis?unite=${unit.id}`} size="lg">Kelimeleri çalış · {Math.min(10, missing.length)} yeni</ButtonLink>}
          <NextButton unit={unit} step="kelimeler" progress={progress} />
        </div>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-sunken" aria-hidden="true"><div className="h-full rounded-full bg-accent" style={{ width: `${(done / total) * 100}%` }} /></div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {words.map((w) => (
          <li key={w.id}>
            <Link to={`/kelimeler/${w.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3 hover:border-line-2">
              <span className="min-w-0"><span lang="es" className="block truncate font-medium">{display(w)}</span><span className="block truncate text-sm text-muted">{w.tr}</span></span>
              {data.byWord.get(w.id)?.length ? <StatusBadge status={data.status.get(w.id)!} /> : <span className="shrink-0 text-xs text-accent-ink">yeni</span>}
            </Link>
          </li>
        ))}
      </ul>
      {missing.length > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <Button variant="ghost" size="sm" icon={<Plus className="size-4" />} onClick={async () => { for (const w of missing) await addWord(repos, settings, w); }}>
            Bunları zaten biliyorum: tanıtmadan kartlarıma ekle
          </Button>
        </div>
      )}
    </>
  );
}

function Readings({ unit, progress }: { unit: Unit; progress: UnitProgress }) {
  const results = useLiveQuery(() => repos.quizResults.byKind('reading'), [], []);
  const best = (id: string) => results.filter((r) => r.sourceId === id).reduce<number | undefined>((b, r) => Math.max(b ?? 0, r.correct / Math.max(1, r.total)), undefined);
  return (
    <>
      <p className="mb-6 text-ink-2">Metni oku, sonundaki soruları %{PASS * 100} ve üstüyle çöz.</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {unitReadings(unit).map((r) => {
          const b = best(r.id);
          const ok = (b ?? 0) >= PASS;
          return (
            <li key={r.id}>
              <Link to={`/okuma/${r.id}?unite=${unit.id}`} className="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 hover:border-line-2">
                <span className="eyebrow">{r.kind === 'story' ? 'Hikâye' : 'Metin'}</span>
                <span lang="es" className="display mt-2 text-[1.6rem] leading-tight group-hover:text-accent-ink">{r.title}</span>
                <span className="mt-1 text-ink-2">{r.titleTr}</span>
                <span className={`mt-auto inline-flex items-center gap-1 pt-4 text-sm ${ok ? 'text-good' : 'text-muted'}`}>{ok && <Check className="size-4" />}{b === undefined ? 'Henüz okunmadı' : `En iyi: %${Math.round(b * 100)}`}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-8"><NextButton unit={unit} step="okuma" progress={progress} /></div>
    </>
  );
}

function Scored({ unit, step, progress, intro, make }: { unit: Unit; step: 'alistirma' | 'quiz' | 'test'; progress: UnitProgress; intro: string; make: () => ReturnType<typeof testQuestions> }) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [runKey, setRunKey] = useState(0);
  const [last, setLast] = useState<{ pct: number; passed: boolean; firstPass: boolean } | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = useMemo(make, [runKey]);
  const best = progress.steps[step].best;
  const n = nextOf(step);
  const nextUnit = UNITS[unit.order];

  const onDone = () => {
    if (last?.passed && step !== 'test' && n) navigate(`/kurs/${unit.id}/${n}`);
    else if (last?.passed && step === 'test') navigate(nextUnit ? `/kurs/${nextUnit.id}` : '/kurs');
    else { setLast(null); setRunKey((k) => k + 1); }
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-ink-2">{intro} {questions.length} soru · %{PASS * 100} ve üstü geçer.</p>
        {best !== undefined && <p className="text-sm text-muted">En iyi: %{Math.round(best * 100)}</p>}
      </div>

      {last && step === 'test' && last.passed && (
        <div className="mb-6 rounded-2xl border border-good/40 bg-good-soft p-6 text-center sm:p-8" role="status">
          <p className="display text-[2.4rem] leading-none sm:text-[3rem]" lang="es">¡Unidad completada! <span aria-hidden="true">🎉</span></p>
          <p className="mt-3 text-ink-2">Ünite {unit.order} tamam: %{last.pct}. {nextUnit ? `Ünite ${nextUnit.order} (${nextUnit.title}) açıldı.` : 'A1 kursunu bitirdin!'}</p>
        </div>
      )}
      {last && !(step === 'test' && last.passed) && (
        <p className={`mb-4 rounded-lg px-4 py-3 text-sm ${last.passed ? 'bg-good-soft text-good' : 'bg-sunken text-ink-2'}`} role="status">
          {last.passed ? `%${last.pct}: adım tamamlandı.` : `%${last.pct}: geçmek için %${PASS * 100} gerekli. Bir daha dene.`}
        </p>
      )}

      <QuestionRunner key={runKey} questions={questions} strictAccents={settings.strictAccents}
        onFinish={async (r) => {
          const res = await saveStep(repos, settings, unit, step, r.correct, r.total, r.wrong.map((q) => q.wordId ?? q.id));
          setLast({ pct: Math.round((r.correct / Math.max(1, r.total)) * 100), passed: res.passed, firstPass: res.firstPass });
        }}
        onRetry={(wrong) => void markForgotten(repos, settings, wrong.flatMap((q) => (q.wordId ? [q.wordId] : [])))}
        doneLabel={!last ? 'Bitir' : last.passed ? (step === 'test' ? (nextUnit ? `Ünite ${nextUnit.order}’e geç` : 'Kursa dön') : `${label(n!)} adımına geç`) : 'Yeniden dene'}
        onDone={onDone} />
    </>
  );
}
