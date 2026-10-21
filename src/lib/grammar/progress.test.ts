import { describe, expect, it } from 'vitest';
import { recentRate, topicProgress } from './progress';

const r = (sourceId: string, correct: number, total: number, finishedAt: string) => ({ kind: 'grammar', sourceId, correct, total, wrongIds: [], finishedAt, dayKey: finishedAt.slice(0, 10) });

describe('grammar ilerlemesi', () => {
  it('en iyi, son ve geçti bilgisi', () => {
    const m = topicProgress([r('ser', 5, 10, '2026-10-20T10:00:00Z'), r('ser', 9, 10, '2026-10-21T10:00:00Z'), r('ser', 6, 10, '2026-10-22T10:00:00Z')]);
    expect(m.get('ser')).toMatchObject({ best: 0.9, last: 0.6, attempts: 3, done: true });
  });
  it('son günlerdeki oran', () => {
    const rs = [r('ser', 2, 10, '2026-10-01T10:00:00Z'), r('ser', 8, 10, '2026-10-20T10:00:00Z')];
    expect(recentRate(rs, 'ser', '2026-10-15T00:00:00Z')).toBe(0.8);
    expect(recentRate(rs, 'estar', '2026-10-15T00:00:00Z')).toBeNull();
  });
});
