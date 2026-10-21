/* QuestionRunner üstüne kurulu oyunlar: çeviri ve boşluk doldurma */
import { useMemo, useState } from 'react';
import { GameShell } from './GameShell';
import { QuestionRunner } from '@/components/quiz/QuestionRunner';
import { useLearnedIds } from '@/lib/games/useLearned';
import { practicePool } from '@/lib/games/pool';
import { generateQuiz } from '@/lib/quiz/generate';
import { shuffle } from '@/lib/quiz/check';
import { markForgotten, saveResult } from '@/lib/games/record';
import { WORDS } from '@/content/vocabulary';
import { GRAMMAR } from '@/content/grammar';
import { repos } from '@/lib/storage';
import { useSettings } from '@/app/settings';

const N = 8;

export function TranslateGame() {
  const { settings } = useSettings();
  const [key, setKey] = useState(0);
  const qs = useMemo(() => shuffle(GRAMMAR.flatMap((t) => t.questions).filter((q) => q.type === 'translate_tr_es')).slice(0, N), [key]);
  return (
    <GameShell id="ceviri">
      <p className="mb-4 text-ink-2">Türkçe cümleyi İspanyolcaya çevir. Farklı doğru söyleyişler de kabul edilir.</p>
      <QuestionRunner key={key} questions={qs} strictAccents={settings.strictAccents}
        onFinish={(r) => void saveResult(repos, settings, 'game', 'ceviri', r.correct, r.total)} doneLabel="Tekrar oyna" onDone={() => setKey((k) => k + 1)} />
    </GameShell>
  );
}

export function FillGapGame() {
  const { settings } = useSettings();
  const learned = useLearnedIds();
  const [key, setKey] = useState(0);
  const qs = useMemo(() => (learned ? generateQuiz('fill', N, { pool: practicePool(learned, 30), all: WORDS, grammar: GRAMMAR }) : null), [learned === undefined, key]);
  if (!qs) return null;
  return (
    <GameShell id="bosluk">
      <p className="mb-4 text-ink-2">Cümledeki eksik kelimeyi yaz; Türkçesi ipucu olarak altında.</p>
      <QuestionRunner key={key} questions={qs} strictAccents={settings.strictAccents}
        onFinish={(r) => void saveResult(repos, settings, 'game', 'bosluk', r.correct, r.total)}
        onRetry={(wrong) => void markForgotten(repos, settings, wrong.flatMap((q) => (q.wordId ? [q.wordId] : [])))}
        doneLabel="Tekrar oyna" onDone={() => setKey((k) => k + 1)} />
    </GameShell>
  );
}
