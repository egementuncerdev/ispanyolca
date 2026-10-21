import { useEffect, useState } from 'react';
import { GameOver, GameShell } from './GameShell';
import { useGame } from './useGame';
import { singleWord } from '@/lib/games/pool';
import { stripAccents } from '@/lib/text/normalize';
import { Button } from '@/components/Button';

const N = 5;
const LIVES = 6;
const ALPHABET = 'abcdefghijklmnñopqrstuvwxyz'.split('');
/** Aksanlı harfler temel harfle bulunur (a → á); ñ ayrı harftir */
const base = (c: string) => (c === 'ñ' ? 'ñ' : stripAccents(c));

export default function Hangman() {
  const { words, restart, save } = useGame('adam-asmaca', N, singleWord);
  const [i, setI] = useState(0);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(0);
  const w = words?.[i];
  const target = w ? w.es.toLocaleLowerCase('es') : '';
  const wrong = [...guessed].filter((g) => ![...target].some((c) => base(c) === g)).length;
  const won = !!w && [...target].every((c) => guessed.has(base(c)));
  const lost = wrong >= LIVES;
  const over = !!words && i >= words.length;

  const guess = (l: string) => { if (!won && !lost && !guessed.has(l)) setGuessed(new Set(guessed).add(l)); };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { const k = e.key.toLocaleLowerCase('es'); if (ALPHABET.includes(k)) guess(k); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  if (!words) return null;
  const next = () => {
    const s = solved + (won ? 1 : 0);
    setSolved(s); setGuessed(new Set());
    if (i + 1 >= words.length) void save(s, words.length);
    setI(i + 1);
  };

  return (
    <GameShell id="adam-asmaca" status={<>{Math.min(i + 1, words.length)} / {words.length} · {solved} bulundu</>}>
      {over ? <GameOver score={`${solved} / ${words.length}`} onAgain={() => { setI(0); setSolved(0); setGuessed(new Set()); restart(); }} /> : (
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="mb-2 flex items-center justify-between">
            <p className="eyebrow">İpucu: {w!.tr}</p>
            <p className="text-sm text-muted" aria-label={`${LIVES - wrong} hak kaldı`}>{'●'.repeat(LIVES - wrong)}<span className="opacity-30">{'●'.repeat(wrong)}</span></p>
          </div>
          <p className="display my-8 flex flex-wrap justify-center gap-2 text-4xl sm:text-5xl" lang="es" aria-live="polite">
            {[...target].map((c, k) => <span key={k} className="inline-block min-w-[1.2ch] border-b-2 border-line-2 text-center">{guessed.has(base(c)) || lost ? c : ' '}</span>)}
          </p>
          {(won || lost) ? (
            <div role="status" className="text-center">
              <p className={`mb-4 ${won ? 'text-good' : 'text-bad'}`}>{won ? '¡Bien hecho!' : <>Kelime: <strong lang="es">{w!.es}</strong></>}</p>
              <Button autoFocus onClick={next}>{i + 1 < words.length ? 'Sonraki kelime' : 'Sonucu gör'}</Button>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9">
              {ALPHABET.map((l) => {
                const used = guessed.has(l);
                const hit = used && [...target].some((c) => base(c) === l);
                return <button key={l} type="button" disabled={used} onClick={() => guess(l)} aria-label={`Harf ${l}`}
                  className={`h-11 rounded-lg border text-lg font-medium uppercase ${used ? (hit ? 'border-good/40 bg-good-soft text-good' : 'border-line bg-sunken text-muted line-through') : 'border-line-2 bg-surface hover:border-ink-2'}`}>{l}</button>;
              })}
            </div>
          )}
        </div>
      )}
    </GameShell>
  );
}
