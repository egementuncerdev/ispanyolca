/* Quiz ve oyun sonuçlarını kaydet; yanlış kelimeleri SRS'te "Unuttum" olarak işaretle */
import type { Repos } from '@/lib/storage';
import type { Settings } from '@/types/user';
import { dayKey } from '@/lib/time/dayKey';
import { answer, introduce } from '@/lib/srs/study';
import { WORD_BY_ID } from '@/content/vocabulary';

export async function saveResult(repos: Repos, s: Settings, kind: 'quiz' | 'game' | 'reading', sourceId: string, correct: number, total: number, wrongIds: string[] = []) {
  const now = new Date();
  const dk = dayKey(now, s.timezone, s.dayStartsAt);
  await repos.quizResults.add({ kind, sourceId, correct, total, wrongIds, finishedAt: now.toISOString(), dayKey: dk });
  const type = { quiz: 'quiz_done', game: 'game', reading: 'reading_done' }[kind];
  await repos.events.add({ type, refId: sourceId, value: kind === 'game' ? correct : Math.round((correct / Math.max(1, total)) * 100), at: now.toISOString(), dayKey: dk });
}

/** Yanlış yapılan kelimeler: kartı varsa Unuttum ile tekrarlanır, yoksa kartlara eklenir */
export async function markForgotten(repos: Repos, s: Settings, wordIds: string[]) {
  for (const id of new Set(wordIds)) {
    const word = WORD_BY_ID[id];
    if (!word) continue;
    const cards = await repos.cards.byWord(id);
    const main = cards.find((c) => c.cardType === 'es_tr') ?? cards[0];
    if (main) await answer(repos, s, main, 1);
    else await introduce(repos, s, [word]);
  }
}

/** Oyun başına en iyi sonuç */
export function bestScores(results: { kind: string; sourceId?: string; correct: number; total: number }[]) {
  const m = new Map<string, { correct: number; total: number; plays: number }>();
  for (const r of results) {
    if (r.kind !== 'game' || !r.sourceId) continue;
    const prev = m.get(r.sourceId);
    const better = !prev || (r.sourceId === 'hiz' ? r.correct > prev.correct : r.correct / Math.max(1, r.total) > prev.correct / Math.max(1, prev.total));
    m.set(r.sourceId, { ...(better ? { correct: r.correct, total: r.total } : { correct: prev!.correct, total: prev!.total }), plays: (prev?.plays ?? 0) + 1 });
  }
  return m;
}
