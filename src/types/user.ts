/* Kullanıcı verisi — IndexedDB'de tutulur, yalnız src/lib/storage/ üzerinden erişilir. */

import type { Level } from './content';

export type ThemePref = 'light' | 'dark' | 'system';

export interface Settings {
  theme: ThemePref;
  dailyNewWords: number;
  /** dakika */
  dailyGoalMinutes: number;
  level: Level;
  /** "HH:MM" — bu saatten önce yapılan çalışma bir önceki güne sayılır */
  dayStartsAt: string;
  timezone: string;
  /** açıkken eksik aksanlı cevap yanlış sayılır */
  strictAccents: boolean;
  name: string;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  dailyNewWords: 10,
  dailyGoalMinutes: 20,
  level: 'A1',
  dayStartsAt: '04:00',
  timezone: 'Europe/Istanbul',
  strictAccents: false,
  name: 'Egemen'
};

export type CardType = 'es_tr' | 'tr_es' | 'fill_blank' | 'type_word' | 'multiple_choice' | 'emoji';

/** FSRS kart durumu (ts-fsrs Card alanları, tarihler ISO metin) */
export interface CardState {
  id: string; // `${wordId}:${cardType}`
  wordId: string;
  cardType: CardType;
  due: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  /** 0 New, 1 Learning, 2 Review, 3 Relearning */
  state: number;
  lastReview?: string;
  createdAt: string;
}

export interface ReviewLog {
  id?: number;
  cardId: string;
  wordId: string;
  /** 1 Again, 2 Hard, 3 Good, 4 Easy */
  rating: number;
  reviewedAt: string;
  dayKey: string;
}

export interface QuizResult {
  id?: number;
  kind: string; // 'vocab' | 'grammar' | 'unit' | 'quick' | oyun adı…
  sourceId?: string;
  correct: number;
  total: number;
  wrongIds: string[];
  finishedAt: string;
  dayKey: string;
}

export interface StudySession {
  id?: number;
  activity: string;
  startedAt: string;
  endedAt: string;
  seconds: number;
  dayKey: string;
}

/** Her eylem bir olay; XP, streak, hedef ve istatistikler buradan türetilir. */
export interface ActivityEvent {
  id?: number;
  type: string; // 'review' | 'new_word' | 'grammar_done' | 'quiz_done' | 'game' | 'reading_done' | 'unit_done' | …
  refId?: string;
  value?: number;
  at: string;
  dayKey: string;
}

export interface DailyGoal {
  dayKey: string;
  items: { kind: string; target: number }[];
  createdAt: string;
}

export interface UserProgress {
  id: 'me';
  unlockedAchievements: { id: string; at: string }[];
  completedUnits: string[];
  completedTopics: string[];
  /** ileride Streak Freeze vb. */
  streakFreezes: number;
  /** yarım kalan "Bugünkü çalışma" akışı */
  sessionDraft?: unknown;
}

export interface Favorite {
  wordId: string;
  addedAt: string;
}
