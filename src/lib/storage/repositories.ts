/* Repository arayüzleri. Uygulama yalnız bunları kullanır; ileride Supabase vb.
   bir backend'e geçmek = bu arayüzlerin yeni bir uygulamasını yazmak. */
import type { ActivityEvent, Favorite, Settings } from '@/types/user';

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
