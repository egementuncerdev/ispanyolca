import { useMemo, useState } from 'react';
import { GameOver, GameShell } from './GameShell';
import { useGame } from './useGame';
import { pairable } from '@/lib/games/pool';
import { shuffle } from '@/lib/quiz/check';
import { display } from '@/components/WordBits';

const PAIRS = 6;

export default function WordMatch() {
  const { words, restart, save } = useGame('eslestir', PAIRS, pairable);
  const right = useMemo(() => (words ? shuffle(words) : []), [words]);
  const [sel, setSel] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [miss, setMiss] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  if (!words) return null;
  const again = () => { setSel(null); setDone(new Set()); setMiss(0); setOver(false); restart(); };
  const pickRight = (id: string) => {
    if (!sel || done.has(id)) return;
    if (sel === id) {
      const d = new Set(done).add(id);
      setDone(d); setSel(null);
      if (d.size === words.length) { setOver(true); void save(Math.max(0, PAIRS - miss), PAIRS); }
    } else { setMiss(miss + 1); setFlash(id); window.setTimeout(() => setFlash(null), 450); setSel(null); }
  };
  const btn = 'flex min-h-14 w-full items-center justify-center rounded-lg border px-3 py-2 text-center text-[16px] transition-all';

  return (
    <GameShell id="eslestir" status={<>{done.size} / {words.length} eşleşme · {miss} hata</>}>
      {over ? <GameOver score={`${Math.max(0, PAIRS - miss)} / ${PAIRS}`} detail={`${miss} hatayla bitirdin.`} onAgain={again} /> : (
        <>
          <p className="mb-4 text-ink-2">Soldan bir İspanyolca kelime seç, sağdan Türkçesine dokun.</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            <ul className="grid gap-2" aria-label="İspanyolca">
              {words.map((w) => (
                <li key={w.id}>
                  <button type="button" lang="es" disabled={done.has(w.id)} aria-pressed={sel === w.id} onClick={() => setSel(w.id)}
                    className={`${btn} ${done.has(w.id) ? 'border-good/40 bg-good-soft text-good opacity-60' : sel === w.id ? 'border-accent bg-accent-soft' : 'border-line-2 bg-surface hover:border-ink-2'}`}>{display(w)}</button>
                </li>
              ))}
            </ul>
            <ul className="grid gap-2" aria-label="Türkçe">
              {right.map((w) => (
                <li key={w.id}>
                  <button type="button" disabled={done.has(w.id)} onClick={() => pickRight(w.id)}
                    className={`${btn} ${done.has(w.id) ? 'border-good/40 bg-good-soft text-good opacity-60' : flash === w.id ? 'border-bad bg-bad-soft text-bad' : 'border-line-2 bg-surface hover:border-ink-2'}`}>{w.tr}</button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </GameShell>
  );
}
