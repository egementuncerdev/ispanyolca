/* Soru cevaplarını kontrol eder. Bütün soru tipleri (grammar, quiz, oyunlar) buradan geçer. */
import type { Question } from '@/types/content';
import { checkAnswer, clean, type CheckResult } from '@/lib/text/normalize';

export type Response = string | string[];

export function checkQuestion(q: Question, response: Response, { strictAccents = false } = {}): CheckResult {
  const expected = q.answers[0] ?? '';
  switch (q.type) {
    case 'multiple_choice':
    case 'translate_es_tr':
      return clean(String(response)) === clean(expected) ? { ok: true, expected } : { ok: false, expected };
    case 'word_order': {
      const joined = Array.isArray(response) ? response.join(' ') : response;
      return checkAnswer(joined, q.answers, { strictAccents: true });
    }
    default:
      return checkAnswer(String(response), q.answers, { strictAccents: strictAccents || !!q.strict });
  }
}

/** Basit karıştırma (Fisher–Yates); rnd verilirse tekrarlanabilir */
export function shuffle<T>(a: readonly T[], rnd: () => number = Math.random): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j]!, b[i]!]; }
  return b;
}

/** Kelime sıralamada parçaları karıştır; doğru sırayla aynı kalırsa bir daha dene */
export function shuffleParts(parts: string[], rnd: () => number = Math.random): string[] {
  if (parts.length < 2) return parts;
  for (let i = 0; i < 5; i++) { const s = shuffle(parts, rnd); if (s.join(' ') !== parts.join(' ')) return s; }
  return [...parts.slice(1), parts[0]!];
}
