import { useMemo, useState, type FormEvent } from 'react';
import { GameOver, GameShell } from './GameShell';
import { useGame } from './useGame';
import { singleWord } from '@/lib/games/pool';
import { shuffleParts } from '@/lib/quiz/check';
import { checkAnswer } from '@/lib/text/normalize';
import { Button } from '@/components/Button';
import { inputClass } from '@/components/Field';
import { useSettings } from '@/app/settings';

const N = 8;

export default function Scramble() {
  const { settings } = useSettings();
  const { words, restart, save } = useGame('karisik', N, singleWord);
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [score, setScore] = useState(0);
  const [res, setRes] = useState<null | { ok: boolean; note?: string }>(null);
  const w = words?.[i];
  const letters = useMemo(() => (w ? shuffleParts([...w.es.toLocaleLowerCase('es')]) : []), [w]);
  if (!words) return null;
  const over = i >= words.length;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!w || res) return;
    const r = checkAnswer(text, [w.es], { strictAccents: settings.strictAccents });
    setRes({ ok: r.ok, note: r.ok ? r.note : undefined });
    if (r.ok) setScore(score + 1);
  };
  const next = () => {
    const ni = i + 1;
    setI(ni); setText(''); setRes(null);
    if (ni >= words.length) void save(score, words.length);
  };

  return (
    <GameShell id="karisik" status={<>{Math.min(i + 1, words.length)} / {words.length} · {score} doğru</>}>
      {over ? <GameOver score={`${score} / ${words.length}`} onAgain={() => { setI(0); setScore(0); setText(''); setRes(null); restart(); }} /> : (
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <p className="eyebrow mb-3">İpucu: {w!.tr}</p>
          <p className="mb-6 flex flex-wrap gap-2" lang="es" aria-label="Karışık harfler">
            {letters.map((l, k) => <span key={k} className="display grid size-12 place-items-center rounded-lg border border-line-2 bg-sunken text-2xl uppercase">{l}</span>)}
          </p>
          <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
            <label className="flex-1"><span className="sr-only">Kelime</span>
              <input autoFocus lang="es" autoComplete="off" autoCapitalize="none" spellCheck={false} className={`${inputClass} h-12 text-lg`} value={text} onChange={(e) => setText(e.target.value)} disabled={!!res} placeholder="Kelimeyi yaz…" />
            </label>
            {!res && <Button type="submit" size="lg" className="h-12" disabled={!text.trim()}>Kontrol et</Button>}
            {!res && <Button variant="ghost" size="lg" className="h-12" onClick={() => setRes({ ok: false })}>Pas</Button>}
          </form>
          {res && (
            <div className="mt-4" role="status">
              <p className={`rounded-lg px-4 py-3 ${res.ok ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'}`}>
                {res.ok ? (res.note === 'accent' ? <>Doğru, ama aksan: <strong lang="es">{w!.es}</strong></> : 'Doğru!') : <>Doğrusu: <strong lang="es">{w!.es}</strong></>}
              </p>
              <Button className="mt-3" autoFocus onClick={next}>Devam</Button>
            </div>
          )}
        </div>
      )}
    </GameShell>
  );
}
