/* Çalışma servisi: bugünün kart kuyruğu, yeni kelime tanıtma, cevap kaydetme.
   Yalnız repository arayüzlerini kullanır. */
import type { Word } from '@/types/content';
import type { CardState, Settings } from '@/types/user';
import type { Repos } from '@/lib/storage';
import { WORDS, WORD_BY_ID } from '@/content/vocabulary';
import { dayKey } from '@/lib/time/dayKey';
import { isDue, newCard, review, type Score } from './scheduler';
import { FIRST_TYPES, typesToUnlock } from './ladder';

export interface TodayPlan {
  due: CardState[];
  newWords: Word[];
  newToday: number;
}

const today = (s: Settings, now: Date) => dayKey(now, s.timezone, s.dayStartsAt);

export async function todayPlan(repos: Repos, settings: Settings, now = new Date()): Promise<TodayPlan> {
  const [due, known, events] = await Promise.all([
    repos.cards.dueBefore(now.toISOString()),
    repos.cards.wordIds(),
    repos.events.byDay(today(settings, now))
  ]);
  const newToday = events.filter((e) => e.type === 'new_word').length;
  const remaining = Math.max(0, settings.dailyNewWords - newToday);
  const newWords = WORDS.filter((w) => !known.has(w.id)).slice(0, remaining);
  due.sort((a, b) => a.due.localeCompare(b.due));
  return { due: due.filter((c) => WORD_BY_ID[c.wordId]), newWords, newToday };
}

/** Yeni kelimeleri tekrar listesine ekle: ilk iki kart (ES→TR, TR→ES) */
export async function introduce(repos: Repos, settings: Settings, words: Word[], now = new Date()): Promise<CardState[]> {
  const known = await repos.cards.wordIds();
  const fresh = words.filter((w) => !known.has(w.id));
  const cards = fresh.flatMap((w) => FIRST_TYPES.map((t) => newCard(w.id, t, now)));
  await repos.cards.bulkPut(cards);
  const dk = today(settings, now);
  for (const w of fresh) await repos.events.add({ type: 'new_word', refId: w.id, at: now.toISOString(), dayKey: dk });
  return cards;
}

/** Tek bir kelimeyi ("Kartlarıma ekle") günlük limitten bağımsız ekle */
export async function addWord(repos: Repos, settings: Settings, word: Word, now = new Date()) {
  return introduce(repos, settings, [word], now);
}

export async function answer(repos: Repos, settings: Settings, card: CardState, score: Score, now = new Date()): Promise<{ next: CardState; unlocked: CardState[] }> {
  const next = review(card, score, now);
  await repos.cards.put(next);
  const dk = today(settings, now);
  await repos.reviews.add({ cardId: card.id, wordId: card.wordId, rating: score, reviewedAt: now.toISOString(), dayKey: dk });
  await repos.events.add({ type: 'review', refId: card.id, value: score, at: now.toISOString(), dayKey: dk });

  // Merdiven: yeni açılan tipler yarına planlanır (aynı oturumu şişirmesin)
  const word = WORD_BY_ID[card.wordId];
  let unlocked: CardState[] = [];
  if (word) {
    const all = (await repos.cards.byWord(word.id)).map((c) => (c.id === next.id ? next : c));
    const tomorrow = new Date(now.getTime() + 20 * 3_600_000);
    unlocked = typesToUnlock(word, all).map((t) => ({ ...newCard(word.id, t, now), due: tomorrow.toISOString() }));
    if (unlocked.length) await repos.cards.bulkPut(unlocked);
  }
  return { next, unlocked };
}

/** Oturum içinde yeniden gösterilecek mi? (öğrenme adımları kısa aralıklı) */
export const showAgainSoon = (c: CardState, now = new Date(), withinMin = 20) => isDue(c, new Date(now.getTime() + withinMin * 60_000));

/** Kelime başına hata sayısı (Unuttum + Zorlandım) */
export async function errorCounts(repos: Repos): Promise<Map<string, number>> {
  const m = new Map<string, number>();
  for (const r of await repos.reviews.all()) if (r.rating <= 2) m.set(r.wordId, (m.get(r.wordId) ?? 0) + 1);
  return m;
}
