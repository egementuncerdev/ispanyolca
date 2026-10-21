/* Grammar ilerlemesi: alıştırma sonuçlarından konu başarısı ve tamamlanma */
import type { QuizResult } from '@/types/user';

export const PASS = 0.7;

export interface TopicProgress { best: number; last: number; attempts: number; done: boolean; lastAt?: string }

export function topicProgress(results: QuizResult[]): Map<string, TopicProgress> {
  const m = new Map<string, TopicProgress>();
  const sorted = [...results].filter((r) => r.kind === 'grammar' && r.sourceId && r.total).sort((a, b) => a.finishedAt.localeCompare(b.finishedAt));
  for (const r of sorted) {
    const pct = r.correct / r.total;
    const prev = m.get(r.sourceId!);
    m.set(r.sourceId!, { best: Math.max(prev?.best ?? 0, pct), last: pct, attempts: (prev?.attempts ?? 0) + 1, done: (prev?.done ?? false) || pct >= PASS, lastAt: r.finishedAt });
  }
  return m;
}

/** Son N günde konu başarı oranı (öneri sistemi için) */
export function recentRate(results: QuizResult[], topicId: string, sinceIso: string): number | null {
  const rs = results.filter((r) => r.kind === 'grammar' && r.sourceId === topicId && r.finishedAt >= sinceIso);
  const total = rs.reduce((a, r) => a + r.total, 0);
  return total ? rs.reduce((a, r) => a + r.correct, 0) / total : null;
}
