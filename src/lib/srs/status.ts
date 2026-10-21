/* Kelime durumu (arayüz): Yeni → Öğreniliyor → Biliniyor → Ustalaşıldı.
   FSRS durumu ve kararlılıktan (stability, gün) türetilir. */
import type { Word } from '@/types/content';
import type { CardState } from '@/types/user';
import { STATE } from './scheduler';
import { ladderFor } from './ladder';

export type WordStatus = 'new' | 'learning' | 'known' | 'mastered';
export const STATUS_LABEL: Record<WordStatus, string> = { new: 'Yeni', learning: 'Öğreniliyor', known: 'Biliniyor', mastered: 'Ustalaşıldı' };

export const KNOWN_DAYS = 7;
export const MASTERED_DAYS = 30;

export function wordStatus(word: Word, cards: CardState[]): WordStatus {
  if (!cards.length) return 'new';
  if (cards.some((c) => c.state !== STATE.Review)) return 'learning';
  const minStability = Math.min(...cards.map((c) => c.stability));
  if (minStability < KNOWN_DAYS) return 'learning';
  const allTypes = ladderFor(word).every((t) => cards.some((c) => c.cardType === t));
  return allTypes && minStability >= MASTERED_DAYS ? 'mastered' : 'known';
}
