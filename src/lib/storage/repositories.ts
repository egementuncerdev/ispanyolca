/* Repository arayüzleri. Uygulama yalnız bunları kullanır; ileride Supabase vb.
   bir backend'e geçmek = bu arayüzlerin yeni bir uygulamasını yazmak. */
import type { ActivityEvent, CardState, Favorite, ReviewLog, Settings, StudySession } from '@/types/user';

export interface SettingsRepo {
  get(): Promise<Settings>;
  update(patch: Partial<Settings>): Promise<Settings>;
}

export interface FavoritesRepo {
  all(): Promise<Favorite[]>;
  toggle(wordId: string): Promise<boolean>;
}

export interface EventsRepo {
  add(e: Omit<ActivityEvent, 'id'>): Promise<void>;
  byDay(dayKey: string): Promise<ActivityEvent[]>;
  all(): Promise<ActivityEvent[]>;
}

export interface CardRepo {
  all(): Promise<CardState[]>;
  byWord(wordId: string): Promise<CardState[]>;
  /** zamanı gelmiş kartlar (due <= iso) */
  dueBefore(iso: string): Promise<CardState[]>;
  put(c: CardState): Promise<void>;
  bulkPut(cs: CardState[]): Promise<void>;
  /** kartı olan kelime id'leri */
  wordIds(): Promise<Set<string>>;
}

export interface ReviewRepo {
  add(r: Omit<ReviewLog, 'id'>): Promise<void>;
  all(): Promise<ReviewLog[]>;
  byDay(dayKey: string): Promise<ReviewLog[]>;
}

export interface SessionRepo {
  add(s: Omit<StudySession, 'id'>): Promise<void>;
  byDay(dayKey: string): Promise<StudySession[]>;
}

export interface BackupFile {
  app: 'ispanyolca';
  version: number;
  exportedAt: string;
  data: Record<string, unknown[]>;
}

export interface BackupService {
  exportAll(): Promise<BackupFile>;
  /** Doğrular, sonra mevcut verinin yerine koyar. Hatalıysa hiçbir şeye dokunmaz. */
  importAll(file: unknown): Promise<{ tables: number; rows: number }>;
}
