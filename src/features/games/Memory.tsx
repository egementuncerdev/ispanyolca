import { useEffect, useMemo, useState } from 'react';
import { GameOver, GameShell } from './GameShell';
import { useGame } from './useGame';
import { pairable } from '@/lib/games/pool';
import { shuffle } from '@/lib/quiz/check';
import { display } from '@/components/WordBits';

const PAIRS = 6;
interface Tile { key: string; wordId: string; text: string; es: boolean }

export default function Memory() {
  const { words, restart, save } = useGame('hafiza', PAIRS, pairable);
  const tiles = useMemo<Tile[]>(() => (words ? shuffle(words.flatMap((w) => [{ key: `${w.id}-es`, wordId: w.id, text: display(w), es: true }, { key: `${w.id}-tr`, wordId: w.id, text: w.tr, es: false }])) : []), [words]);
  const [open, setOpen] = useState<string[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const over = words !== null && found.size === PAIRS;
  const score = Math.max(0, 100 - Math.max(0, moves - PAIRS) * 8);

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open.map((k) => tiles.find((t) => t.key === k)!);
    const t = window.setTimeout(() => {
      if (a!.wordId === b!.wordId) {
        const f = new Set(found).add(a!.wordId);
        setFound(f);
        if (f.size === PAIRS) void save(Math.max(0, 100 - Math.max(0, moves - PAIRS) * 8), 100);
      }
      setOpen([]);
    }, a!.wordId === b!.wordId ? 250 : 900);
    return () => window.clearTimeout(t);
  }, [open, tiles, found, moves, save]);

  if (!words) return null;
  const flip = (k: string) => {
    setOpen((cur) => {
      if (cur.length === 2 || cur.includes(k)) return cur;
      const n = [...cur, k];
      if (n.length === 2) setMoves((m) => m + 1);
      return n;
    });
  };

  return (
    <GameShell id="hafiza" status={<>{found.size} / {PAIRS} çift · {moves} hamle</>}>
      {over ? <GameOver score={`${score} puan`} detail={`${moves} hamlede bitirdin (en az ${PAIRS}).`} onAgain={() => { setOpen([]); setFound(new Set()); setMoves(0); restart(); }} /> : (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
          {tiles.map((t) => {
            const shown = open.includes(t.key) || found.has(t.wordId);
            return (
              <li key={t.key}>
                <button type="button" onClick={() => flip(t.key)} disabled={found.has(t.wordId)} aria-label={shown ? t.text : 'Kapalı kart'}
                  className={`flex aspect-[4/3] w-full items-center justify-center rounded-xl border p-2 text-center text-[15px] transition-colors sm:text-base ${found.has(t.wordId) ? 'border-good/40 bg-good-soft text-good' : shown ? 'border-accent bg-surface' : 'border-line-2 bg-sunken hover:border-ink-2'}`}>
                  {shown ? <span lang={t.es ? 'es' : 'tr'} className={t.es ? 'display text-lg' : ''}>{t.text}</span> : <span className="display text-2xl text-muted" aria-hidden="true">ñ</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </GameShell>
  );
}
