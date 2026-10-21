/* ts-fsrs sarmalayıcı. Uygulamanın geri kalanı FSRS'i doğrudan görmez. */
import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type Grade } from 'ts-fsrs';
import type { CardState, CardType } from '@/types/user';

/** Arayüzdeki 4 puan: Unuttum / Zorlandım / Hatırladım / Çok kolay */
export type Score = 1 | 2 | 3 | 4;
export const SCORE_TO_RATING: Record<Score, Grade> = { 1: Rating.Again, 2: Rating.Hard, 3: Rating.Good, 4: Rating.Easy };

const engine = fsrs(generatorParameters({ enable_fuzz: true, request_retention: 0.9, maximum_interval: 365 }));
/** Testler için bulanıklıksız motor */
const exact = fsrs(generatorParameters({ enable_fuzz: false, request_retention: 0.9, maximum_interval: 365 }));

export const cardId = (wordId: string, type: CardType) => `${wordId}:${type}`;

function toFsrs(c: CardState): Card {
  return {
    due: new Date(c.due),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsedDays,
    scheduled_days: c.scheduledDays,
    learning_steps: c.learningSteps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state as State,
    ...(c.lastReview ? { last_review: new Date(c.lastReview) } : {})
  };
}

function fromFsrs(base: Pick<CardState, 'id' | 'wordId' | 'cardType' | 'createdAt'>, c: Card): CardState {
  return {
    ...base,
    due: c.due.toISOString(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsedDays: c.elapsed_days,
    scheduledDays: c.scheduled_days,
    learningSteps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    ...(c.last_review ? { lastReview: c.last_review.toISOString() } : {})
  };
}

export function newCard(wordId: string, cardType: CardType, now = new Date()): CardState {
  return fromFsrs({ id: cardId(wordId, cardType), wordId, cardType, createdAt: now.toISOString() }, createEmptyCard(now));
}

export function review(card: CardState, score: Score, now = new Date(), { fuzz = true } = {}): CardState {
  const res = (fuzz ? engine : exact).next(toFsrs(card), now, SCORE_TO_RATING[score]);
  return fromFsrs(card, res.card);
}

/** Her puan için bir sonraki tekrar zamanı (butonların altında gösterilir) */
export function preview(card: CardState, now = new Date()): Record<Score, Date> {
  const p = exact.repeat(toFsrs(card), now);
  return { 1: p[Rating.Again].card.due, 2: p[Rating.Hard].card.due, 3: p[Rating.Good].card.due, 4: p[Rating.Easy].card.due };
}

export const isDue = (c: CardState, now = new Date()) => new Date(c.due).getTime() <= now.getTime();
export const STATE = State;
