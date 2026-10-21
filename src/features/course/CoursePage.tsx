import { Link } from 'react-router';
import { Check, Lock } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { ButtonLink } from '@/components/Button';
import { STEPS, type UnitProgress } from '@/lib/course/progress';
import type { Unit } from '@/types/content';
import { useCourse } from './useCourse';

export default function CoursePage() {
  const data = useCourse();
  if (!data) return <p className="py-20 text-center text-muted" role="status">Yükleniyor…</p>;
  const { units } = data;
  const completed = units.filter((x) => x.progress.completed).length;
  const overall = Math.round(units.reduce((a, x) => a + x.progress.percent, 0) / units.length);
  const current = units.find((x) => x.unlocked && !x.progress.completed);

  return (
    <>
      <PageHeader eyebrow={`A1 · ${completed} / ${units.length} ünite · %${overall}`} title="A1 Kursu"
        subtitle="Her ünite altı adımdır: ders, kelimeler, alıştırma, quiz, okuma ve ünite testi. Adımlar sırayla açılır; testi %70 ile geçince sıradaki ünite açılır." />

      <div className="mb-8 h-2 overflow-hidden rounded-full bg-sunken" role="progressbar" aria-label="Kurs ilerlemesi" aria-valuenow={overall} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${overall}%` }} />
      </div>

      {current && (
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line-2 bg-surface p-5 sm:p-6">
          <div>
            <p className="eyebrow mb-1">Devam et · Ünite {current.unit.order}</p>
            <p lang="es" className="display text-[1.8rem] leading-tight">{current.unit.title}</p>
            <p className="mt-1 text-ink-2">Sıradaki adım: {STEPS.find((s) => s.id === current.progress.next)?.label}</p>
          </div>
          <ButtonLink to={`/kurs/${current.unit.id}/${current.progress.next}`} size="lg">Devam et</ButtonLink>
        </div>
      )}

      <ol className="relative grid gap-3 before:absolute before:bottom-6 before:left-[1.4rem] before:top-6 before:w-px before:bg-line sm:before:left-[1.65rem]">
        {units.map(({ unit, progress, unlocked }) => (
          <li key={unit.id} className="relative">
            {unlocked ? (
              <Link to={`/kurs/${unit.id}`} className="group flex gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-2 sm:gap-5 sm:p-5">
                <Badge order={unit.order} done={progress.completed} />
                <UnitBody unit={unit} progress={progress} />
              </Link>
            ) : (
              <div className="flex gap-4 rounded-xl border border-dashed border-line p-4 sm:gap-5 sm:p-5" aria-label={`Ünite ${unit.order}: ${unit.title}, kilitli`}>
                <span className="relative grid size-9 shrink-0 place-items-center rounded-full border border-line-2 bg-paper text-muted sm:size-11" aria-hidden="true"><Lock className="size-4" strokeWidth={1.75} /></span>
                <div className="min-w-0">
                  <p className="eyebrow">Ünite {unit.order} · kilitli</p>
                  <p lang="es" className="display mt-1 text-[1.45rem] leading-tight">{unit.title}</p>
                  <p className="mt-1 text-sm text-muted">{unit.goal}</p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}

function Badge({ order, done }: { order: number; done: boolean }) {
  return (
    <span className={`relative grid size-9 shrink-0 place-items-center rounded-full border font-semibold tabular-nums sm:size-11 ${done ? 'border-good bg-good-soft text-good' : 'border-accent bg-paper text-accent-ink'}`}>
      {done ? <Check className="size-4" strokeWidth={2.25} aria-label="Tamamlandı" /> : order}
    </span>
  );
}

function UnitBody({ unit, progress }: { unit: Unit; progress: UnitProgress }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="eyebrow">Ünite {unit.order} · {unit.titleTr}</p>
        <p className="text-sm tabular-nums text-muted">%{progress.percent}</p>
      </div>
      <p lang="es" className="display mt-1 text-[1.6rem] leading-tight group-hover:text-accent-ink">{unit.title}</p>
      <p className="mt-1 text-[15px] text-ink-2">{unit.goal}</p>
      <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Adımlar">
        {STEPS.map((s) => {
          const st = progress.steps[s.id];
          return (
            <li key={s.id} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs ${st.done ? 'border-good/40 text-good' : st.open ? 'border-accent/50 text-accent-ink' : 'border-line text-muted'}`}>
              {st.done && <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />}{s.label}<span className="sr-only">{st.done ? ' (tamam)' : st.open ? ' (açık)' : ' (kilitli)'}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
