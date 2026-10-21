import { describe, expect, it } from 'vitest';
import { AppDB } from '@/lib/storage/db';
import { createRepos } from '@/lib/storage/dexie';
import { DEFAULT_SETTINGS } from '@/types/user';
import { answer, introduce, todayPlan } from './study';

const setup = () => createRepos(new AppDB(`study-${Math.random()}`));
const s = { ...DEFAULT_SETTINGS, dailyNewWords: 5 };
const t0 = new Date('2026-10-21T10:00:00+03:00');

describe('çalışma akışı', () => {
  it('günlük yeni kelime limiti uygulanır', async () => {
    const repos = setup();
    const plan = await todayPlan(repos, s, t0);
    expect(plan.newWords).toHaveLength(5);
    await introduce(repos, s, plan.newWords.slice(0, 3), t0);
    const after = await todayPlan(repos, s, t0);
    expect(after.newToday).toBe(3);
    expect(after.newWords).toHaveLength(2);
    expect(after.due).toHaveLength(6); // 3 kelime × 2 kart
    // ertesi gün limit sıfırlanır
    expect((await todayPlan(repos, s, new Date('2026-10-22T10:00:00+03:00'))).newWords).toHaveLength(5);
  });

  it('cevap kaydedilir; tekrara geçen kart yeni tipleri açar', async () => {
    const repos = setup();
    const [w] = (await todayPlan(repos, s, t0)).newWords;
    const cards = await introduce(repos, s, [w!], t0);
    const es = cards.find((c) => c.cardType === 'es_tr')!;
    const { next, unlocked } = await answer(repos, s, es, 4, t0);
    expect(new Date(next.due).getTime()).toBeGreaterThan(t0.getTime());
    expect(unlocked.map((c) => c.cardType)).toContain('multiple_choice');
    expect(await repos.reviews.byDay('2026-10-21')).toHaveLength(1);
  });
});
