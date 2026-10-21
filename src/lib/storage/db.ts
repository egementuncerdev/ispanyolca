/* IndexedDB şeması (Dexie). Yalnız storage katmanı bu dosyayı kullanır. */
import Dexie, { type EntityTable } from 'dexie';
import type { ActivityEvent, CardState, DailyGoal, Favorite, QuizResult, ReviewLog, Settings, StudySession, UserProgress } from '@/types/user';

export interface SettingsRow extends Settings { id: 'me' }

export class AppDB extends Dexie {
  settings!: EntityTable<SettingsRow, 'id'>;
  cards!: EntityTable<CardState, 'id'>;
  reviews!: EntityTable<ReviewLog, 'id'>;
  quizResults!: EntityTable<QuizResult, 'id'>;
  sessions!: EntityTable<StudySession, 'id'>;
  events!: EntityTable<ActivityEvent, 'id'>;
  goals!: EntityTable<DailyGoal, 'dayKey'>;
  progress!: EntityTable<UserProgress, 'id'>;
  favorites!: EntityTable<Favorite, 'wordId'>;

  constructor(name = 'ispanyolca') {
    super(name);
    this.version(1).stores({
      settings: 'id',
      cards: 'id, wordId, cardType, due, state',
      reviews: '++id, cardId, wordId, dayKey, reviewedAt',
      quizResults: '++id, kind, dayKey, finishedAt',
      sessions: '++id, dayKey, activity',
      events: '++id, type, dayKey, at',
      goals: 'dayKey',
      progress: 'id',
      favorites: 'wordId'
    });
  }
}

/** Yedeklemeye giren tablolar (sıra önemli değil) */
export const TABLES = ['settings', 'cards', 'reviews', 'quizResults', 'sessions', 'events', 'goals', 'progress', 'favorites'] as const;
export type TableName = (typeof TABLES)[number];
