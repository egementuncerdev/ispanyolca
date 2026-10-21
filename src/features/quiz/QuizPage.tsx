import { useState } from 'react';
import { Link } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { QuestionRunner } from '@/components/quiz/QuestionRunner';
import { CATEGORIES, generateQuiz, type QuizCategory } from '@/lib/quiz/generate';
import { practicePool } from '@/lib/games/pool';
import { markForgotten, saveResult } from '@/lib/games/record';
import { useLearnedIds } from '@/lib/games/useLearned';
import { useSettings } from '@/app/settings';
import { repos } from '@/lib/storage';
import { WORDS } from '@/content/vocabulary';
import { GRAMMAR } from '@/content/grammar';
import type { Question } from '@/types/content';

const LENGTHS = [10, 20];

export default function QuizPage() {
  const { settings } = useSettings();
  const learned = useLearnedIds();
  const [cat, setCat] = useState<QuizCategory>('mixed');
  const [len, setLen] = useState(10);
  const [run, setRun] = useState<{ cat: QuizCategory; qs: Question[]; key: number } | null>(null);
  const recent = useLiveQuery(() => repos.quizResults.byKind('quiz').then((r) => r.sort((a, b) => b.finishedAt.localeCompare(a.finishedAt)).slice(0, 5)), [], []);

  const start = () => {
    const pool = practicePool(learned ?? new Set(), 40);
    setRun({ cat, qs: generateQuiz(cat, len, { pool, all: WORDS, grammar: GRAMMAR }), key: Date.now() });
  };
  const label = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
  const fewLearned = (learned?.size ?? 0) < 20;

  if (run) {
    return (
      <>
        <PageHeader eyebrow="Quiz" title={label(run.cat)} />
        <QuestionRunner key={run.key} questions={run.qs} strictAccents={settings.strictAccents}
          onFinish={(r) => void saveResult(repos, settings, 'quiz', run.cat, r.correct, r.total, r.wrong.map((q) => q.wordId ?? q.id))}
          onRetry={(wrong) => void markForgotten(repos, settings, wrong.flatMap((q) => (q.wordId ? [q.wordId] : [])))}
          doneLabel="Yeni quiz" onDone={() => setRun(null)} />
        <p className="mt-4 text-sm text-muted">“Yanlışları tekrar et” dediğinde yanlış yaptığın kelimeler kart tekrarında da öne alınır.</p>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Kendini sına" title="Quizler" subtitle="Bir tür seç; sorular kartlarındaki kelimelerden ve grammar konularından üretilir." />
      <fieldset className="mb-6">
        <legend className="eyebrow mb-3">Tür</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <label key={c.id} className={`cursor-pointer rounded-xl border p-4 transition-colors ${cat === c.id ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-line-2'}`}>
              <input type="radio" name="cat" value={c.id} checked={cat === c.id} onChange={() => setCat(c.id)} className="sr-only" />
              <span className="display block text-xl">{c.label}</span>
              <span className="text-sm text-muted">{c.desc}</span>
            </label>
          ))}
          <Link to="/okuma" className="rounded-xl border border-dashed border-line-2 p-4 transition-colors hover:border-ink-2"><span className="display block text-xl">Okuma</span><span className="text-sm text-muted">Metni oku, sonundaki soruları çöz →</span></Link>
        </div>
      </fieldset>
      <fieldset className="mb-6">
        <legend className="eyebrow mb-3">Soru sayısı</legend>
        <div className="flex gap-2">
          {LENGTHS.map((n) => (
            <label key={n} className={`cursor-pointer rounded-lg border px-4 py-2 ${len === n ? 'border-accent bg-accent-soft' : 'border-line-2 bg-surface'}`}>
              <input type="radio" name="len" checked={len === n} onChange={() => setLen(n)} className="sr-only" />{n}
            </label>
          ))}
        </div>
      </fieldset>
      {fewLearned && <p className="mb-4 rounded-lg bg-sunken px-4 py-3 text-sm text-ink-2">Kartlarında henüz az kelime var; sorular öğrenme sırasındaki ilk kelimelerle tamamlanır.</p>}
      <Button size="lg" onClick={start} disabled={!learned}>Quizi başlat</Button>

      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="eyebrow mb-3">Son quizler</h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {recent.map((r) => (
              <li key={r.id} className="flex justify-between px-4 py-3 text-[15px]">
                <span>{label(r.sourceId ?? '')}</span>
                <span className="tabular-nums text-muted">{r.correct} / {r.total} · %{Math.round((r.correct / r.total) * 100)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
