/* Kart merdiveni: yeni kelime 2 kartla başlar (ES→TR, TR→ES).
   ES→TR kartı tekrara geçince çoktan seçmeli, boşluk doldurma ve emoji;
   TR→ES kartı tekrara geçince "kelimeyi yaz" açılır. Böylece günlük yük taşınabilir kalır. */
import type { Word } from '@/types/content';
import type { CardState, CardType } from '@/types/user';
import { STATE } from './scheduler';

export const FIRST_TYPES: CardType[] = ['es_tr', 'tr_es'];

/** Bu kelime için mümkün olan bütün kart tipleri */
export function ladderFor(w: Word): CardType[] {
  const types: CardType[] = ['es_tr', 'tr_es', 'multiple_choice', 'type_word'];
  if (w.blank) types.push('fill_blank');
  if (w.emoji && w.partOfSpeech === 'noun') types.push('emoji');
  return types;
}

/** Mevcut kartlara göre şimdi açılması gereken yeni tipler */
export function typesToUnlock(w: Word, cards: CardState[]): CardType[] {
  const has = (t: CardType) => cards.some((c) => c.cardType === t);
  const graduated = (t: CardType) => cards.some((c) => c.cardType === t && c.state === STATE.Review);
  const possible = ladderFor(w);
  const out: CardType[] = [];
  if (graduated('es_tr')) for (const t of ['multiple_choice', 'fill_blank', 'emoji'] as CardType[]) if (possible.includes(t) && !has(t)) out.push(t);
  if (graduated('tr_es') && !has('type_word')) out.push('type_word');
  return out;
}
