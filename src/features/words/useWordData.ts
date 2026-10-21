/* Kelime sayfalarının canlı verisi (IndexedDB değişince kendiliğinden güncellenir) */
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';
import { repos } from '@/lib/storage';
import { WORDS } from '@/content/vocabulary';
import { wordStatus, type WordStatus } from '@/lib/srs/status';
import type { CardState } from '@/types/user';

export function useWordData() {
  const cards = useLiveQuery(() => repos.cards.all(), [], [] as CardState[]);
  const favs = useLiveQuery(() => repos.favorites.all(), [], []);
  const reviews = useLiveQuery(() => repos.reviews.all(), [], []);

  return useMemo(() => {
    const byWord = new Map<string, CardState[]>();
    for (const c of cards) byWord.set(c.wordId, [...(byWord.get(c.wordId) ?? []), c]);
    const status = new Map<string, WordStatus>();
    for (const w of WORDS) status.set(w.id, wordStatus(w, byWord.get(w.id) ?? []));
    const errors = new Map<string, number>();
    for (const r of reviews) if (r.rating <= 2) errors.set(r.wordId, (errors.get(r.wordId) ?? 0) + 1);
    const favorites = new Set(favs.map((f) => f.wordId));
    const nextDue = new Map<string, string>();
    for (const [id, cs] of byWord) nextDue.set(id, cs.map((c) => c.due).sort()[0]!);
    return { cards, byWord, status, errors, favorites, nextDue };
  }, [cards, favs, reviews]);
}
