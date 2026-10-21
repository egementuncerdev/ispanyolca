import { describe, expect, it } from 'vitest';
import { GRAMMAR } from '../grammar';
import { checkQuestion } from '@/lib/quiz/check';

const all = GRAMMAR.flatMap((t) => [...t.check, ...t.questions]);

describe('grammar içeriği', () => {
  it('23 konu, benzersiz id', () => {
    expect(GRAMMAR).toHaveLength(23);
    const ids = GRAMMAR.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    const qids = all.map((q) => q.id);
    expect(qids.filter((id, i) => qids.indexOf(id) !== i)).toEqual([]);
  });

  it('her konuda anlatım, örnek, 2–3 mini test, 8–12 alıştırma', () => {
    for (const t of GRAMMAR) {
      expect(t.summary.length, t.id).toBeGreaterThan(40);
      expect(t.usage.length, t.id).toBeGreaterThanOrEqual(2);
      expect(t.examples.length, t.id).toBeGreaterThanOrEqual(2);
      expect(t.check.length, t.id).toBeGreaterThanOrEqual(2);
      expect(t.check.length, t.id).toBeLessThanOrEqual(3);
      expect(t.questions.length, t.id).toBeGreaterThanOrEqual(8);
      expect(t.questions.length, t.id).toBeLessThanOrEqual(12);
      if (t.table) for (const r of t.table.rows) expect(r.length, t.id).toBe(t.table.headers.length);
    }
  });

  it('en az 4 farklı alıştırma tipi her konuda', () => {
    for (const t of GRAMMAR) expect(new Set(t.questions.map((q) => q.type)).size, t.id).toBeGreaterThanOrEqual(4);
  });

  it('soruların kendi doğru cevabı doğru sayılıyor', () => {
    for (const q of all) {
      expect(q.answers.length, q.id).toBeGreaterThan(0);
      if (q.options) {
        expect(q.options, q.id).toContain(q.answers[0]);
        expect(new Set(q.options).size, q.id).toBe(q.options.length);
      }
      if (q.type === 'fill_blank') expect(q.prompt, q.id).toContain('___');
      const resp = q.type === 'word_order' ? q.parts! : q.answers[0]!;
      expect(checkQuestion(q, resp).ok, q.id).toBe(true);
    }
  });

  it('düzeltme sorularında hatalı cümle doğru sayılmıyor', () => {
    for (const q of all.filter((x) => x.type === 'fix_sentence')) expect(checkQuestion(q, q.prompt).ok, q.id).toBe(false);
  });

  it('yanlış şıklar yanlış sayılıyor', () => {
    for (const q of all.filter((x) => x.options)) for (const o of q.options!.slice(1)) expect(checkQuestion(q, o).ok, `${q.id}: ${o}`).toBe(false);
  });
});
