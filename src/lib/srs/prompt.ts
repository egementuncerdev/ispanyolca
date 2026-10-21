/* Bir SRS kartını ekranda sorulacak biçime çevirir. Saf fonksiyon: test edilebilir. */
import type { Word } from '@/types/content';
import type { CardState, CardType } from '@/types/user';
import { withArticle } from '@/content/vocabulary/helpers';

export type Prompt =
  | { kind: 'flip'; type: CardType; word: Word; direction: 'es_tr' | 'tr_es' }
  | { kind: 'choice'; type: CardType; word: Word; options: string[]; correct: string }
  | { kind: 'type'; type: CardType; word: Word; answers: string[]; hint: string };

export const CARD_TYPE_LABEL: Record<CardType, string> = {
  es_tr: 'İspanyolca → Türkçe',
  tr_es: 'Türkçe → İspanyolca',
  multiple_choice: 'Doğru anlamı seç',
  fill_blank: 'Boşluğu doldur',
  type_word: 'Kelimeyi yaz',
  emoji: 'Resimdeki kelime'
};

const shuffle = <T,>(a: T[], rnd: () => number) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j]!, b[i]!]; }
  return b;
};

/** Yazılı cevapta kabul edilenler: artikelli biçim önce, sonra yalın; sıfatta dişil de */
export function typedAnswers(w: Word): string[] {
  const out = [withArticle(w), w.es];
  if (w.feminine && w.feminine !== w.es) out.push(w.feminine);
  return [...new Set(out)];
}

/** Çoktan seçmeli için 3 çeldirici: aynı tür, mümkünse aynı konu, farklı anlam */
export function distractors(w: Word, pool: Word[], rnd: () => number, n = 3): string[] {
  const same = pool.filter((x) => x.id !== w.id && x.tr !== w.tr && x.partOfSpeech === w.partOfSpeech);
  const sameTopic = shuffle(same.filter((x) => x.tags.some((t) => w.tags.includes(t))), rnd);
  const rest = shuffle(same.filter((x) => !sameTopic.includes(x)), rnd);
  const picks: string[] = [];
  for (const x of [...sameTopic, ...rest]) { if (!picks.includes(x.tr)) picks.push(x.tr); if (picks.length === n) break; }
  return picks;
}

export function buildPrompt(card: CardState, w: Word, pool: Word[], rnd: () => number = Math.random): Prompt {
  switch (card.cardType) {
    case 'es_tr':
    case 'tr_es':
      return { kind: 'flip', type: card.cardType, word: w, direction: card.cardType };
    case 'multiple_choice': {
      const options = shuffle([w.tr, ...distractors(w, pool, rnd)], rnd);
      return { kind: 'choice', type: 'multiple_choice', word: w, options, correct: w.tr };
    }
    case 'fill_blank':
      if (w.blank) return { kind: 'type', type: 'fill_blank', word: w, answers: [w.blank], hint: w.exampleTr };
      return { kind: 'flip', type: 'es_tr', word: w, direction: 'es_tr' };
    case 'type_word':
      return { kind: 'type', type: 'type_word', word: w, answers: typedAnswers(w), hint: w.tr };
    case 'emoji':
      return { kind: 'type', type: 'emoji', word: w, answers: typedAnswers(w), hint: w.emoji ?? w.tr };
  }
}
