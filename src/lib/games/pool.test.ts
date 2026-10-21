import { describe, expect, it } from 'vitest';
import { practicePool, singleWord } from './pool';

describe('oyun havuzu', () => {
  it('öğrenilenler önce, yetmezse tamamlanır', () => {
    const p = practicePool(new Set(['casa', 'perro']), 6);
    expect(p.slice(0, 2).map((w) => w.id).sort()).toEqual(['casa', 'perro']);
    expect(p).toHaveLength(6);
  });
  it('harf oyunları için tek kelime filtresi', () => {
    const p = practicePool(new Set(), 30, singleWord);
    expect(p.every((w) => !w.es.includes(' '))).toBe(true);
  });
});
