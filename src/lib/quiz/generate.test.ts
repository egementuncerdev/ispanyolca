import { describe, expect, it } from 'vitest';
import { CATEGORIES, generateQuiz } from './generate';
import { checkQuestion } from './check';
import { WORDS } from '@/content/vocabulary';
import { GRAMMAR } from '@/content/grammar';

let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const ctx = { pool: WORDS.slice(0, 60), all: WORDS, grammar: GRAMMAR, rnd };

describe('quiz motoru', () => {
  for (const { id } of CATEGORIES) {
    it(`${id}: 10 soru, her biri kendi cevabıyla doğru`, () => {
      const qs = generateQuiz(id, 10, ctx);
      expect(qs).toHaveLength(10);
      expect(new Set(qs.map((q) => q.id)).size).toBe(10);
      for (const q of qs) {
        if (q.options) { expect(q.options).toContain(q.answers[0]); expect(new Set(q.options).size).toBe(q.options.length); expect(q.options.length).toBeGreaterThanOrEqual(3); }
        expect(checkQuestion(q, q.type === 'word_order' ? q.parts! : q.answers[0]!).ok, q.id).toBe(true);
      }
    });
  }
  it('boşluk doldurma cümlede ___ içerir ve Türkçe ipucu verir', () => {
    for (const q of generateQuiz('fill', 10, ctx)) { expect(q.prompt).toContain('___'); expect(q.hint).toBeTruthy(); }
  });
});
