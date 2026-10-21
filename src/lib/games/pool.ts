/* Oyun ve quiz kelime havuzu: önce kartlarındaki (öğrenilen / öğreniliyor) kelimeler,
   yetmezse öğrenme sırasındaki ilk kelimelerle tamamlanır. */
import type { Word } from '@/types/content';
import { WORDS } from '@/content/vocabulary';

export function practicePool(learned: Set<string>, min: number, filter: (w: Word) => boolean = () => true): Word[] {
  const ok = WORDS.filter(filter);
  const mine = ok.filter((w) => learned.has(w.id));
  if (mine.length >= min) return mine;
  const extra = ok.filter((w) => !learned.has(w.id)).slice(0, min - mine.length);
  return [...mine, ...extra];
}

/** Tek kelimelik, harf oyunlarına uygun (adam asmaca, karışık harf) */
export const singleWord = (w: Word) => /^[a-záéíóúüñ]{3,10}$/i.test(w.es);

/** Eşleştirme için: kısa Türkçe karşılık */
export const pairable = (w: Word) => w.tr.length <= 24;
