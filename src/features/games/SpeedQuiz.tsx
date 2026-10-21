import { useCallback, useEffect, useMemo, useState } from 'react';
import { GameOver, GameShell } from './GameShell';
import { useGame } from './useGame';
import { distractors } from '@/lib/srs/prompt';
import { shuffle } from '@/lib/quiz/check';
import { WORDS } from '@/content/vocabulary';
import { display } from '@/components/WordBits';
import { Button } from '@/components/Button';
import { useLiveQuery } from 'dexie-react-hooks';
import { repos } from '@/lib/storage';

const SECONDS = 60;

export default function SpeedQuiz() {
  const { words, restart, save } = useGame('hiz', 40);
  const [started, setStarted] = useState(false);
  const [left, setLeft] = useState(SECONDS);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null);
  const [saved, setSaved] = useState(false);
  const best = useLiveQuery(() => repos.quizResults.byKind('game').then((r) => Math.max(0, ...r.filter((x) => x.sourceId === 'hiz').map((x) => x.correct))), [saved], 0);
  const w = words?.[i % (words?.length || 1)];
  const options = useMemo(() => (w ? shuffle([w.tr, ...distractors(w, WORDS, Math.random)]) : []), [w, i]);
  const over = started && left <= 0;

  useEffect(() => {
    if (!started || left <= 0) return;
    const t = window.setTimeout(() => setLeft(left - 1), 1000);
    return () => window.clearTimeout(t);
  }, [started, left]);
  useEffect(() => { if (over && !saved) { setSaved(true); void save(score, answered); } }, [over, saved, save, score, answered]);

  const pick = useCallback((o: string) => {
    if (!w || over) return;
    const ok = o === w.tr;
    setFlash(ok ? 'good' : 'bad'); window.setTimeout(() => setFlash(null), 180);
    setAnswered((a) => a + 1); if (ok) setScore((s) => s + 1);
    setI((x) => x + 1);
  }, [w, over]);
  useEffect(() => {
    if (!started || over) return;
    const onKey = (e: KeyboardEvent) => { const n = Number(e.key); if (n >= 1 && n <= options.length) pick(options[n - 1]!); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, over, options, pick]);

  if (!words) return null;
  const again = () => { setStarted(false); setLeft(SECONDS); setI(0); setScore(0); setAnswered(0); setSaved(false); restart(); };

  return (
    <GameShell id="hiz" status={started && !over ? <><span className={`display text-3xl ${left <= 10 ? 'text-bad' : ''}`}>{left}</span> sn · {score} doğru</> : best ? `En iyi: ${best}` : undefined}>
      {!started ? (
        <div className="rounded-xl border border-line bg-surface p-7 sm:p-9">
          <p className="display text-3xl">60 saniye. Hazır mısın?</p>
          <p className="mt-2 text-ink-2">Her kelimenin Türkçesini seç. Klavyeden 1–4 ile de seçebilirsin.</p>
          <Button size="lg" className="mt-6" autoFocus onClick={() => setStarted(true)}>Başla</Button>
        </div>
      ) : over ? (
        <GameOver score={`${score} doğru`} detail={`${answered} sorudan ${score} doğru.`} best={score > (best ?? 0) || score === best ? 'Yeni en iyi skorun!' : `En iyi skorun: ${best}`} onAgain={again} />
      ) : (
        <div className={`rounded-xl border bg-surface p-6 transition-colors sm:p-8 ${flash === 'good' ? 'border-good' : flash === 'bad' ? 'border-bad' : 'border-line'}`}>
          <div className="mb-6 h-1 overflow-hidden rounded-full bg-sunken"><div className="h-full bg-accent transition-[width] duration-1000 ease-linear" style={{ width: `${(left / SECONDS) * 100}%` }} /></div>
          <p lang="es" className="display mb-6 text-center text-[2.6rem] leading-none">{display(w!)}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((o, k) => (
              <button key={o} type="button" onClick={() => pick(o)} className="flex min-h-12 items-center gap-3 rounded-lg border border-line-2 bg-surface px-4 py-2.5 text-left hover:border-ink-2">
                <kbd className="text-xs text-muted">{k + 1}</kbd>{o}
              </button>
            ))}
          </div>
        </div>
      )}
    </GameShell>
  );
}
