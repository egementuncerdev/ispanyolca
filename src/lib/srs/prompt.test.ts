import { describe, expect, it } from 'vitest';
import { buildPrompt, distractors, typedAnswers } from './prompt';
import { newCard } from './scheduler';
import { WORDS, WORD_BY_ID } from '@/content/vocabulary';
import { checkAnswer } from '@/lib/text/normalize';

const rnd = () => 0.42;

describe('kart soruları', () => {
  it('çoktan seçmeli: 4 farklı seçenek, doğru cevap içinde, çeldiriciler aynı türden', () => {
    const w = WORD_BY_ID.perro!;
    const p = buildPrompt(newCard('perro', 'multiple_choice'), w, WORDS, rnd);
    if (p.kind !== 'choice') throw new Error();
    expect(new Set(p.options).size).toBe(4);
    expect(p.options).toContain('köpek');
    for (const d of distractors(w, WORDS, rnd)) expect(WORDS.find((x) => x.tr === d)!.partOfSpeech).toBe('noun');
  });
  it('kelimeyi yaz: artikelli ve artikelsiz kabul', () => {
    const w = WORD_BY_ID.casa!;
    expect(typedAnswers(w)).toEqual(['la casa', 'casa']);
    expect(checkAnswer('casa', typedAnswers(w)).ok).toBe(true);
    expect(checkAnswer('La casa', typedAnswers(w)).ok).toBe(true);
    expect(typedAnswers(WORD_BY_ID.pequeno!)).toEqual(['pequeño', 'pequeña']);
  });
  it('boşluk doldurma örnek cümledeki biçimi ister', () => {
    const p = buildPrompt(newCard('hablar', 'fill_blank'), WORD_BY_ID.hablar!, WORDS, rnd);
    expect(p.kind === 'type' && p.answers).toEqual(['Hablo']);
    expect(checkAnswer('hablo', ['Hablo']).ok).toBe(true);
  });
});
