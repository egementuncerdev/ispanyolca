import { describe, expect, it } from 'vitest';
import { newCard, preview, review, STATE } from './scheduler';
import { wordStatus } from './status';
import { typesToUnlock, ladderFor } from './ladder';
import { shortInterval, untilText } from './humanize';
import { WORD_BY_ID } from '@/content/vocabulary';

const t0 = new Date('2026-10-21T10:00:00+03:00');
const later = (c: { due: string }, mins = 0) => new Date(new Date(c.due).getTime() + mins * 60_000);

describe('FSRS planlama', () => {
  it('yeni kart hemen gösterilir, puanlar artan aralık verir', () => {
    const c = newCard('casa', 'es_tr', t0);
    expect(c.state).toBe(STATE.New);
    expect(new Date(c.due).getTime()).toBeLessThanOrEqual(t0.getTime());
    const p = preview(c, t0);
    expect(p[1].getTime()).toBeLessThan(p[3].getTime());
    expect(p[3].getTime()).toBeLessThanOrEqual(p[4].getTime());
  });

  it('Hatırladım ile ilerler, Unuttum ile geri döner', () => {
    let c = newCard('casa', 'es_tr', t0);
    c = review(c, 4, t0, { fuzz: false }); // Çok kolay → doğrudan tekrara
    expect(c.state).toBe(STATE.Review);
    expect(c.scheduledDays).toBeGreaterThanOrEqual(1);
    const next = review(c, 3, later(c), { fuzz: false });
    expect(next.scheduledDays).toBeGreaterThan(c.scheduledDays);
    const lapse = review(next, 1, later(next), { fuzz: false });
    expect(lapse.state).toBe(STATE.Relearning);
    expect(lapse.lapses).toBe(1);
  });
});

describe('kelime durumu', () => {
  const w = WORD_BY_ID.casa!;
  it('kart yoksa Yeni, öğrenme adımındaysa Öğreniliyor', () => {
    expect(wordStatus(w, [])).toBe('new');
    expect(wordStatus(w, [review(newCard('casa', 'es_tr', t0), 3, t0, { fuzz: false })])).toBe('learning');
  });
  it('kararlılığa göre Biliniyor / Ustalaşıldı', () => {
    const mk = (type: Parameters<typeof newCard>[1], stability: number) => ({ ...newCard('casa', type, t0), state: STATE.Review, stability });
    const all = ladderFor(w);
    expect(wordStatus(w, all.map((t) => mk(t, 10)))).toBe('known');
    expect(wordStatus(w, all.map((t) => mk(t, 40)))).toBe('mastered');
    expect(wordStatus(w, [mk('es_tr', 40), mk('tr_es', 40)])).toBe('known'); // merdiven tamamlanmadı
  });
});

describe('kart merdiveni', () => {
  it('ES→TR tekrara geçince yeni tipler açılır', () => {
    const w = WORD_BY_ID.casa!; // emoji ve boşluk var
    const es = { ...newCard('casa', 'es_tr', t0), state: STATE.Review };
    const tr = newCard('casa', 'tr_es', t0);
    expect(typesToUnlock(w, [es, tr]).sort()).toEqual(['emoji', 'fill_blank', 'multiple_choice']);
    expect(typesToUnlock(w, [es, { ...tr, state: STATE.Review }])).toContain('type_word');
  });
});

describe('zaman metni', () => {
  it('dakika, saat, yarın, gün', () => {
    expect(untilText(new Date(t0.getTime() + 10 * 60_000), t0)).toBe('10 dk sonra');
    expect(untilText(new Date(t0.getTime() + 5 * 3_600_000), t0)).toBe('5 saat sonra');
    expect(untilText(new Date('2026-10-22T09:00:00+03:00'), t0)).toBe('yarın');
    expect(untilText(new Date('2026-10-24T09:00:00+03:00'), t0)).toBe('3 gün sonra');
    expect(shortInterval(new Date(t0.getTime() + 2 * 86_400_000), t0)).toBe('2 g');
  });
});
