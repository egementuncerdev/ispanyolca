/* Kart çalışma oturumu: bekleyen tekrarlar + bugünün yeni kelimeleri */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Check, Maximize2, Minimize2, X } from 'lucide-react';
import { useSettings } from '@/app/settings';
import { useFocusMode } from '@/app/focus';
import { repos } from '@/lib/storage';
import { answer, introduce, showAgainSoon, todayPlan } from '@/lib/srs/study';
import { preview, type Score } from '@/lib/srs/scheduler';
import { buildPrompt, CARD_TYPE_LABEL, type Prompt } from '@/lib/srs/prompt';
import { checkAnswer, type CheckResult } from '@/lib/text/normalize';
import { shortInterval, untilText } from '@/lib/srs/humanize';
import { WORDS, WORD_BY_ID, isVerb } from '@/content/vocabulary';
import { display, Example, Ipa, POS_LABEL } from '@/components/WordBits';
import { Button, ButtonLink } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { inputClass } from '@/components/Field';
import { dayKey } from '@/lib/time/dayKey';
import type { CardState } from '@/types/user';

const SCORES: { s: Score; label: string; key: string }[] = [
  { s: 1, label: 'Unuttum', key: '1' },
  { s: 2, label: 'Zorlandım', key: '2' },
  { s: 3, label: 'Hatırladım', key: '3' },
  { s: 4, label: 'Çok kolay', key: '4' }
];

type Phase = 'loading' | 'question' | 'revealed' | 'done' | 'empty';
interface Outcome { check?: CheckResult; picked?: string }

export default function StudyPage() {
  const { settings } = useSettings();
  const { focus, setFocus } = useFocusMode();
  const [queue, setQueue] = useState<CardState[]>([]);
  const [pos, setPos] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [outcome, setOutcome] = useState<Outcome>({});
  const [typed, setTyped] = useState('');
  const [stats, setStats] = useState({ reviewed: 0, good: 0, newWords: 0 });
  const [nextDue, setNextDue] = useState<string | null>(null);
  const startedAt = useRef(new Date());
  const logged = useRef(false);

  // Oturumu kur: yeni kelimeleri tanıt, kuyruğu oluştur
  useEffect(() => {
    let alive = true;
    (async () => {
      const plan = await todayPlan(repos, settings);
      const fresh = await introduce(repos, settings, plan.newWords);
      if (!alive) return;
      const firstPass = fresh.filter((c) => c.cardType === 'es_tr');
      const secondPass = fresh.filter((c) => c.cardType === 'tr_es');
      const q = [...plan.due, ...firstPass, ...secondPass];
      setStats((s) => ({ ...s, newWords: fresh.length / 2 }));
      setQueue(q);
      setPhase(q.length ? 'question' : 'empty');
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Çalışma süresini kaydet
  const logSession = useCallback(async () => {
    if (logged.current) return;
    logged.current = true;
    const end = new Date();
    const seconds = Math.round((end.getTime() - startedAt.current.getTime()) / 1000);
    if (seconds < 5) return;
    await repos.sessions.add({ activity: 'flashcards', startedAt: startedAt.current.toISOString(), endedAt: end.toISOString(), seconds, dayKey: dayKey(startedAt.current, settings.timezone, settings.dayStartsAt) });
  }, [settings]);
  useEffect(() => () => { void logSession(); }, [logSession]);

  const card = queue[pos];
  const word = card ? WORD_BY_ID[card.wordId] : undefined;
  const prompt: Prompt | null = useMemo(() => (card && word ? buildPrompt(card, word, WORDS) : null), [card, word]);
  const intervals = useMemo(() => (card ? preview(card) : null), [card]);

  const suggested: Score | null = prompt?.kind === 'flip' ? null
    : outcome.check ? (outcome.check.ok ? (outcome.check.note ? 2 : 3) : 1)
      : outcome.picked !== undefined && prompt?.kind === 'choice' ? (outcome.picked === prompt.correct ? 3 : 1) : null;

  const reveal = () => setPhase('revealed');

  const rate = async (score: Score) => {
    if (!card || phase !== 'revealed') return;
    const { next } = await answer(repos, settings, card, score);
    setStats((s) => ({ ...s, reviewed: s.reviewed + 1, good: s.good + (score >= 3 ? 1 : 0) }));
    let q = queue;
    if (showAgainSoon(next)) {
      q = [...queue];
      q.splice(Math.min(q.length, pos + 4), 0, next);
      setQueue(q);
    }
    if (pos + 1 >= q.length) {
      const all = await repos.cards.all();
      setNextDue(all.map((c) => c.due).sort()[0] ?? null);
      setPhase('done');
      void logSession();
      return;
    }
    setPos(pos + 1);
    setOutcome({});
    setTyped('');
    setPhase('question');
  };

  const submitTyped = (e: FormEvent) => {
    e.preventDefault();
    if (prompt?.kind !== 'type' || !typed.trim()) return;
    setOutcome({ check: checkAnswer(typed, prompt.answers, { strictAccents: settings.strictAccents }) });
    reveal();
  };

  const pick = (opt: string) => { if (phase === 'question') { setOutcome({ picked: opt }); reveal(); } };

  // Klavye: Space = çevir, 1–4 = puan (ya da şık)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;
      if (e.key === ' ' && phase === 'question' && prompt?.kind === 'flip') { e.preventDefault(); reveal(); }
      if (/^[1-4]$/.test(e.key)) {
        const n = Number(e.key);
        if (phase === 'revealed') { e.preventDefault(); void rate(n as Score); }
        else if (phase === 'question' && prompt?.kind === 'choice' && prompt.options[n - 1]) { e.preventDefault(); pick(prompt.options[n - 1]!); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (phase === 'loading') return <p className="py-24 text-center text-muted" role="status">Kartlar hazırlanıyor…</p>;
  if (phase === 'empty') {
    return (
      <EmptyState
        title="Bugünlük kart kalmadı"
        text="Bekleyen tekrarın yok ve bugünün yeni kelimelerini çalıştın. Yarın yeni kartlar seni bekliyor."
        action={<ButtonLink to="/kelimeler" variant="secondary">Kelimelere dön</ButtonLink>}
      />
    );
  }
  if (phase === 'done') {
    const pct = stats.reviewed ? Math.round((stats.good / stats.reviewed) * 100) : 0;
    return (
      <div className="mx-auto max-w-xl py-8">
        <p className="eyebrow mb-3">Oturum bitti</p>
        <h1 className="display text-[2.8rem] leading-none">¡Muy bien!</h1>
        <dl className="my-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
          {[['Kart', stats.reviewed], ['Yeni kelime', stats.newWords], ['Hatırlanan', `%${pct}`]].map(([k, v]) => (
            <div key={k} className="bg-surface px-4 py-4"><dt className="eyebrow">{k}</dt><dd className="display mt-1 text-3xl">{v}</dd></div>
          ))}
        </dl>
        {nextDue && <p className="mb-8 text-ink-2">Sonraki tekrar: <strong className="text-ink">{untilText(new Date(nextDue), new Date(), settings.timezone, settings.dayStartsAt)}</strong></p>}
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/">Ana sayfa</ButtonLink>
          <ButtonLink to="/kelimeler" variant="secondary">Kelimeler</ButtonLink>
        </div>
      </div>
    );
  }
  if (!card || !word || !prompt) return null;

  const isNew = card.reps === 0;
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-2xl flex-col">
      <h1 className="sr-only">Kart çalışması</h1>
      {/* Üst çubuk */}
      <div className="mb-6 flex items-center gap-3">
        <Link to="/kelimeler" className="grid size-10 place-items-center rounded-lg text-muted hover:bg-sunken hover:text-ink" aria-label="Oturumdan çık"><X className="size-5" strokeWidth={1.75} /></Link>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken" role="progressbar" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={pos} aria-label="İlerleme">
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(pos / queue.length) * 100}%` }} />
        </div>
        <span className="w-14 text-right text-sm tabular-nums text-muted">{pos + 1} / {queue.length}</span>
        <button type="button" onClick={() => setFocus(!focus)} aria-pressed={focus} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-sunken hover:text-ink" aria-label={focus ? 'Odak modundan çık' : 'Odak modu'} title={focus ? 'Odak modundan çık (Esc)' : 'Odak modu'}>
          {focus ? <Minimize2 className="size-4" strokeWidth={1.75} /> : <Maximize2 className="size-4" strokeWidth={1.75} />}
        </button>
      </div>

      <p className="eyebrow mb-3 flex items-center gap-2">{CARD_TYPE_LABEL[prompt.type]}{isNew && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] tracking-wider text-on-accent">YENİ</span>}</p>

      <CardStage prompt={prompt} revealed={phase === 'revealed'} onReveal={reveal} onSwipe={(s) => void rate(s)} />

      {/* Soru alanı */}
      <div className="mt-6">
        {prompt.kind === 'choice' && (
          <div className="grid gap-2 sm:grid-cols-2">
            {prompt.options.map((o, i) => {
              const state = phase === 'revealed' ? (o === prompt.correct ? 'good' : o === outcome.picked ? 'bad' : 'idle') : 'idle';
              return (
                <button key={o} type="button" onClick={() => pick(o)} disabled={phase === 'revealed'}
                  className={`flex min-h-12 items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors ${state === 'good' ? 'border-good bg-good-soft text-good' : state === 'bad' ? 'border-bad bg-bad-soft text-bad' : 'border-line-2 bg-surface hover:border-ink-2'}`}>
                  <kbd className="text-xs text-muted">{i + 1}</kbd><span>{o}</span>
                </button>
              );
            })}
          </div>
        )}
        {prompt.kind === 'type' && phase === 'question' && (
          <form onSubmit={submitTyped} className="flex gap-2">
            <label className="flex-1"><span className="sr-only">Cevabın</span>
              <input autoFocus lang="es" autoComplete="off" autoCapitalize="none" spellCheck={false} className={`${inputClass} h-12 text-lg`} value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="İspanyolca yaz…" />
            </label>
            <Button type="submit" size="lg" className="h-12" disabled={!typed.trim()}>Kontrol et</Button>
          </form>
        )}
        {prompt.kind === 'type' && phase === 'revealed' && outcome.check && <Verdict check={outcome.check} typed={typed} />}
        {prompt.kind === 'flip' && phase === 'question' && (
          <Button size="lg" className="w-full" onClick={reveal}>Cevabı göster <kbd className="ml-1 rounded border border-on-accent/50 px-1.5 text-xs text-on-accent">Space</kbd></Button>
        )}
      </div>

      {/* Puanlama */}
      {phase === 'revealed' && intervals && (
        <div className="mt-auto pt-6">
          <div className="grid grid-cols-4 gap-2">
            {SCORES.map(({ s, label, key }) => (
              <button key={s} type="button" onClick={() => void rate(s)}
                className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2.5 text-sm font-medium transition-colors ${suggested === s ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line-2 bg-surface hover:border-ink-2'}`}>
                <span>{label}</span>
                <span className="text-[11px] font-normal text-muted">{shortInterval(intervals[s])} · {key}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 hidden text-center text-xs text-muted md:block">Klavye: 1–4 puan · Space çevir · Esc odak modundan çık</p>
          <p className="mt-3 text-center text-xs text-muted md:hidden">Kartı sola kaydır: Unuttum · sağa: Hatırladım</p>
        </div>
      )}
    </div>
  );
}

function Verdict({ check, typed }: { check: CheckResult; typed: string }) {
  if (check.ok) {
    return (
      <p className="flex items-start gap-2 rounded-lg bg-good-soft px-4 py-3 text-good" role="status">
        <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
        <span>
          {check.note === 'accent' ? <>Doğru, ama aksan: <strong lang="es">{check.expected}</strong></>
            : check.note === 'article' ? <>Doğru. Artikeliyle: <strong lang="es">{check.expected}</strong></>
              : <>Doğru: <strong lang="es">{check.expected}</strong></>}
        </span>
      </p>
    );
  }
  return (
    <p className="flex items-start gap-2 rounded-lg bg-bad-soft px-4 py-3 text-bad" role="status">
      <X className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
      <span>Senin cevabın: <s lang="es">{typed}</s> · Doğrusu: <strong lang="es">{check.expected}</strong></span>
    </p>
  );
}

/** Kartın kendisi: çevirme animasyonu ve (açıkken) kaydırma */
function CardStage({ prompt, revealed, onReveal, onSwipe }: { prompt: Prompt; revealed: boolean; onReveal: () => void; onSwipe: (s: Score) => void }) {
  const w = prompt.word;
  const [dx, setDx] = useState(0);
  const start = useRef<number | null>(null);
  const flip = prompt.kind === 'flip';

  const onDown = (e: React.PointerEvent) => { if (revealed) { start.current = e.clientX; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); } };
  const onMove = (e: React.PointerEvent) => { if (start.current !== null) setDx(e.clientX - start.current); };
  const onUp = () => {
    if (start.current === null) return;
    start.current = null;
    if (dx > 90) onSwipe(3); else if (dx < -90) onSwipe(1);
    setDx(0);
  };

  const front = (() => {
    if (prompt.kind === 'flip' && prompt.direction === 'tr_es') return <Face big={w.tr} sub={POS_LABEL[w.partOfSpeech]} />;
    if (prompt.kind === 'type' && prompt.type === 'fill_blank') return <div className="w-full text-left"><Example w={w} hideBlank /><p className="mt-3 text-ink-2">{w.exampleTr}</p><p className="mt-4 text-sm text-muted">Kelime: {w.tr}</p></div>;
    if (prompt.kind === 'type' && prompt.type === 'emoji') return <div className="text-center"><p className="text-7xl" role="img" aria-label="Resim">{w.emoji}</p><p className="mt-4 text-sm text-muted">{w.partOfSpeech === 'noun' ? 'Artikeliyle yazabilirsin' : ''}</p></div>;
    if (prompt.kind === 'type') return <Face big={`${w.tr} = ____`} sub={w.partOfSpeech === 'noun' ? 'isim · artikeliyle yazabilirsin' : POS_LABEL[w.partOfSpeech]} />;
    return <Face es big={display(w)} sub={<Ipa w={w} />} />;
  })();

  const back = (
    <div className="w-full text-left">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p lang="es" className="display text-[2rem] leading-tight">{display(w)}</p>
        <Ipa w={w} />
      </div>
      <p className="mt-1 text-xl text-ink-2">{w.tr}</p>
      <div className="mt-5 border-t border-line pt-4"><Example w={w} /><p className="mt-1 text-ink-2">{w.exampleTr}</p></div>
      {isVerb(w) && <p className="mt-3 text-sm text-muted" lang="es">yo {w.conjugations.presente.yo} · tú {w.conjugations.presente.tu} · él {w.conjugations.presente.el}</p>}
    </div>
  );

  const tilt = revealed ? Math.max(-8, Math.min(8, dx / 18)) : 0;
  const swipeHint = dx > 40 ? 'Hatırladım' : dx < -40 ? 'Unuttum' : '';

  return (
    <div className="relative [perspective:1400px]" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      style={{ transform: dx ? `translateX(${dx}px) rotate(${tilt}deg)` : undefined, transition: dx ? 'none' : 'transform .25s ease', touchAction: revealed ? 'pan-y' : 'auto' }}>
      {swipeHint && <span className={`absolute top-3 z-10 rounded-full px-3 py-1 text-sm font-semibold ${dx > 0 ? 'right-3 bg-good-soft text-good' : 'left-3 bg-bad-soft text-bad'}`}>{swipeHint}</span>}
      {flip ? (
        <div className="grid transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none" style={{ transform: revealed ? 'rotateY(180deg)' : undefined }}>
          <button type="button" onClick={onReveal} disabled={revealed}
            className="col-start-1 row-start-1 flex min-h-64 cursor-pointer items-center justify-center rounded-2xl border border-line bg-surface p-8 [backface-visibility:hidden] sm:min-h-72">
            {front}
            <span className="sr-only"> — cevabı görmek için kartı çevir</span>
          </button>
          <div className="col-start-1 row-start-1 flex min-h-64 items-center rounded-2xl border border-line-2 bg-surface p-7 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:min-h-72" aria-live="polite">
            {revealed && back}
          </div>
        </div>
      ) : (
        <div className="flex min-h-56 items-center justify-center rounded-2xl border border-line bg-surface p-7 sm:min-h-64">
          {revealed ? back : front}
        </div>
      )}
    </div>
  );
}

function Face({ big, sub, es = false }: { big: React.ReactNode; sub?: React.ReactNode; es?: boolean }) {
  return (
    <div className="text-center">
      <p lang={es ? 'es' : 'tr'} className="display text-[2.6rem] leading-tight sm:text-[3.2rem]">{big}</p>
      {sub && <p className="mt-3 text-muted">{sub}</p>}
    </div>
  );
}
