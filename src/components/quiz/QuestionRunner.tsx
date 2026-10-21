/* Tek tek soru gösteren ortak bileşen: grammar alıştırmaları, mini testler, quizler.
   Soru tipleri: çoktan seçmeli, boşluk doldurma, cümle düzeltme, kelime sıralama, TR→ES, ES→TR. */
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import type { Question } from '@/types/content';
import { checkQuestion, shuffle, shuffleParts, type Response } from '@/lib/quiz/check';
import type { CheckResult } from '@/lib/text/normalize';
import { Button } from '@/components/Button';
import { inputClass } from '@/components/Field';

export interface RunResult { correct: number; total: number; wrong: Question[] }

const INSTRUCTION: Record<Question['type'], string> = {
  multiple_choice: 'Doğru seçeneği seç',
  fill_blank: 'Boşluğu doldur',
  fix_sentence: 'Cümleyi düzelt',
  word_order: 'Kelimeleri doğru sıraya koy',
  translate_tr_es: 'İspanyolcaya çevir',
  translate_es_tr: 'Türkçesi hangisi?',
  type_word: 'Kelimeyi yaz',
  match: 'Eşleştir'
};

interface Props {
  questions: Question[];
  strictAccents?: boolean;
  /** ilk tur bitince bir kez çağrılır (kaydetmek için) */
  onFinish?: (r: RunResult) => void;
  /** sonuç ekranındaki ana buton */
  doneLabel?: string;
  onDone?: () => void;
  /** "Yanlışları tekrar et" tıklanınca (ör. kelimeleri SRS'te Unuttum işaretlemek için) */
  onRetry?: (wrong: Question[]) => void;
  compact?: boolean;
}

export function QuestionRunner({ questions, strictAccents = false, onFinish, doneLabel = 'Bitir', onDone, onRetry, compact = false }: Props) {
  const [round, setRound] = useState(questions);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<{ q: Question; ok: boolean }[]>([]);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [finished, setFinished] = useState(false);
  const [firstRound, setFirstRound] = useState(true);
  const q = round[idx];

  const next = () => {
    if (!q || !result) return;
    const all = [...results, { q, ok: result.ok }];
    setResults(all);
    setResult(null);
    if (idx + 1 < round.length) { setIdx(idx + 1); return; }
    setFinished(true);
    if (firstRound) {
      const correct = all.filter((r) => r.ok).length;
      onFinish?.({ correct, total: all.length, wrong: all.filter((r) => !r.ok).map((r) => r.q) });
    }
  };

  useEffect(() => {
    if (!result) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); next(); } };
    const t = window.setTimeout(() => window.addEventListener('keydown', onKey), 50);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', onKey); };
  });

  if (finished) {
    const correct = results.filter((r) => r.ok).length;
    const wrong = results.filter((r) => !r.ok).map((r) => r.q);
    const pct = Math.round((correct / results.length) * 100);
    return (
      <div className={`rounded-xl border border-line bg-surface ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
        <p className="eyebrow mb-2">Sonuç</p>
        <p className="display text-4xl">{correct} / {results.length} <span className="text-2xl text-muted">· %{pct}</span></p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sunken"><div className={`h-full rounded-full ${pct >= 70 ? 'bg-good' : 'bg-accent'}`} style={{ width: `${pct}%` }} /></div>
        {wrong.length > 0 && (
          <div className="mt-6">
            <p className="eyebrow mb-2">Yanlışların</p>
            <ul className="divide-y divide-line rounded-lg border border-line">
              {wrong.map((w) => (
                <li key={w.id} className="px-4 py-3 text-[15px]">
                  <p className="text-ink-2" lang={w.type === 'translate_tr_es' ? 'tr' : 'es'}>{w.type === 'word_order' ? INSTRUCTION.word_order : w.prompt}</p>
                  <p className="mt-0.5 font-medium" lang={w.type === 'translate_es_tr' ? 'tr' : 'es'}>→ {w.answers[0]}</p>
                  {w.explanation && <p className="mt-1 text-sm text-muted">{w.explanation}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {wrong.length > 0 && (
            <Button variant="secondary" icon={<RotateCcw className="size-4" strokeWidth={1.75} />}
              onClick={() => { onRetry?.(wrong); setRound(shuffle(wrong)); setIdx(0); setResults([]); setFinished(false); setFirstRound(false); }}>
              Yanlışları tekrar et
            </Button>
          )}
          {onDone && <Button onClick={onDone}>{doneLabel}</Button>}
        </div>
      </div>
    );
  }
  if (!q) return null;

  return (
    <div className={`rounded-xl border border-line bg-surface ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
      <div className="mb-5 flex items-center gap-3">
        <p className="eyebrow">{INSTRUCTION[q.type]}</p>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-sunken" aria-hidden="true"><div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${(idx / round.length) * 100}%` }} /></div>
        <span className="text-sm tabular-nums text-muted">{idx + 1} / {round.length}</span>
      </div>
      <QuestionView key={`${q.id}-${firstRound}`} q={q} result={result} strictAccents={strictAccents} onCheck={(resp) => setResult(checkQuestion(q, resp, { strictAccents }))} />
      {result && (
        <div className="mt-5" role="status">
          <div className={`flex items-start gap-2 rounded-lg px-4 py-3 ${result.ok ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'}`}>
            {result.ok ? <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} /> : <X className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />}
            <div>
              <p>
                {result.ok
                  ? result.note === 'accent' ? <>Doğru, ama aksan: <strong lang="es">{result.expected}</strong></> : <>Doğru!</>
                  : <>Doğrusu: <strong lang={q.type === 'translate_es_tr' ? 'tr' : 'es'}>{result.expected}</strong></>}
              </p>
              {q.explanation && <p className="mt-1 text-sm opacity-90">{q.explanation}</p>}
            </div>
          </div>
          <Button className="mt-4 w-full sm:w-auto" onClick={next}>{idx + 1 < round.length ? 'Devam' : 'Sonucu gör'} <kbd className="ml-1 rounded border border-on-accent/50 px-1.5 text-xs">Enter</kbd></Button>
        </div>
      )}
    </div>
  );
}

function QuestionView({ q, result, onCheck }: { q: Question; result: CheckResult | null; strictAccents: boolean; onCheck: (r: Response) => void }) {
  const locked = !!result;
  const options = useMemo(() => (q.options ? shuffle(q.options) : []), [q]);
  const [picked, setPicked] = useState<string | null>(null);
  const [text, setText] = useState(q.type === 'fix_sentence' ? q.prompt : '');
  const inputRef = useRef<HTMLInputElement>(null);

  // 1–4 ile şık seçimi
  useEffect(() => {
    if (!options.length || locked) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) { e.preventDefault(); const o = options[n - 1]!; setPicked(o); onCheck(o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [options, locked, onCheck]);

  const submit = (e: FormEvent) => { e.preventDefault(); if (text.trim() && !locked) onCheck(text); };

  if (q.type === 'multiple_choice' || q.type === 'translate_es_tr') {
    return (
      <>
        <p lang={q.type === 'translate_es_tr' ? 'es' : undefined} className={`display text-[1.7rem] leading-snug sm:text-[2rem] ${q.hint ? 'mb-1' : 'mb-6'}`}>{q.prompt}</p>
        {q.hint && <p className="mb-6 text-muted">{q.hint}</p>}
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((o, i) => {
            const state = !locked ? 'idle' : o === q.answers[0] ? 'good' : o === picked ? 'bad' : 'idle';
            return (
              <button key={o} type="button" disabled={locked} onClick={() => { setPicked(o); onCheck(o); }}
                className={`flex min-h-12 items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors ${state === 'good' ? 'border-good bg-good-soft text-good' : state === 'bad' ? 'border-bad bg-bad-soft text-bad' : 'border-line-2 bg-surface hover:border-ink-2 disabled:opacity-70'}`}>
                <kbd className="text-xs text-muted">{i + 1}</kbd><span lang={q.type === 'translate_es_tr' ? 'tr' : 'es'}>{o}</span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  if (q.type === 'word_order') return <>{q.hint && <p className="display mb-5 text-[1.5rem] leading-snug">{q.hint}</p>}<WordOrder q={q} locked={locked} onCheck={onCheck} /></>;

  if (q.type === 'fill_blank') {
    const [before, after] = q.prompt.split('___');
    return (
      <form onSubmit={submit}>
        <p lang="es" className="display mb-6 text-[1.7rem] leading-[1.6] sm:text-[2rem]">
          {before}
          <label className="inline-block align-baseline"><span className="sr-only">Boşluk</span>
            <input ref={inputRef} autoFocus disabled={locked} lang="es" autoComplete="off" autoCapitalize="none" spellCheck={false} value={text} onChange={(e) => setText(e.target.value)}
              className="mx-1 w-40 border-b-2 border-accent bg-transparent px-1 text-center font-sans text-[1.4rem] focus:outline-none disabled:opacity-80" style={{ width: `${Math.max(6, text.length + 2)}ch` }} />
          </label>
          {after}
        </p>
        {q.hint && <p className="-mt-3 mb-5 text-muted">{q.hint}</p>}
        {!locked && <Button type="submit" disabled={!text.trim()}>Kontrol et</Button>}
      </form>
    );
  }

  // fix_sentence, translate_tr_es, type_word
  return (
    <form onSubmit={submit}>
      {q.type === 'fix_sentence'
        ? <p lang="es" className="display mb-2 text-[1.7rem] leading-snug text-ink-2 sm:text-[2rem]"><span className="decoration-bad/60 decoration-wavy underline underline-offset-[6px]">{q.prompt}</span></p>
        : <p className="display mb-2 text-[1.7rem] leading-snug sm:text-[2rem]">{q.prompt}</p>}
      <p className="mb-5 text-sm text-muted">{q.type === 'fix_sentence' ? 'Cümlede bir hata var. Düzeltip doğrusunu yaz.' : q.hint ?? 'İspanyolca yaz; aksan eksikse uyarırım.'}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1"><span className="sr-only">Cevabın</span>
          <input ref={inputRef} autoFocus disabled={locked} lang="es" autoComplete="off" autoCapitalize="sentences" spellCheck={false} className={`${inputClass} h-12 text-lg`} value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        {!locked && <Button type="submit" size="lg" className="h-12" disabled={!text.trim()}>Kontrol et</Button>}
      </div>
    </form>
  );
}

function WordOrder({ q, locked, onCheck }: { q: Question; locked: boolean; onCheck: (r: Response) => void }) {
  const bank = useMemo(() => shuffleParts(q.parts ?? []).map((t, i) => ({ t, i })), [q]);
  const [chosen, setChosen] = useState<{ t: string; i: number }[]>([]);
  const left = bank.filter((b) => !chosen.some((c) => c.i === b.i));
  const chip = 'rounded-lg border px-3 py-2 text-[17px] transition-colors';
  return (
    <div>
      <div className="mb-4 flex min-h-14 flex-wrap items-center gap-2 rounded-lg border border-dashed border-line-2 bg-sunken/50 p-2" aria-label="Senin cümlen" lang="es">
        {chosen.length === 0 && <span className="px-2 text-sm text-muted">Aşağıdaki kelimelere sırayla dokun</span>}
        {chosen.map((c) => (
          <button key={c.i} type="button" disabled={locked} onClick={() => setChosen(chosen.filter((x) => x.i !== c.i))} className={`${chip} border-line-2 bg-surface hover:border-bad`} aria-label={`${c.t} — çıkar`}>{c.t}</button>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap gap-2" lang="es">
        {left.map((b) => (
          <button key={b.i} type="button" disabled={locked} onClick={() => setChosen([...chosen, b])} className={`${chip} border-line-2 bg-surface hover:border-ink-2`}>{b.t}</button>
        ))}
      </div>
      {!locked && (
        <div className="flex gap-2">
          <Button disabled={left.length > 0} onClick={() => onCheck(chosen.map((c) => c.t))}>Kontrol et</Button>
          {chosen.length > 0 && <Button variant="ghost" onClick={() => setChosen([])}>Temizle</Button>}
        </div>
      )}
    </div>
  );
}
