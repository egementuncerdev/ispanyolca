/* Repository arayüzlerinin IndexedDB (Dexie) uygulaması */
import { AppDB, TABLES } from './db';
import type { BackupFile, BackupService, CardRepo, EventsRepo, FavoritesRepo, QuizResultRepo, ReviewRepo, SessionRepo, SettingsRepo } from './repositories';
import { DEFAULT_SETTINGS, type Settings } from '@/types/user';

export const BACKUP_VERSION = 1;

export function createRepos(db: AppDB) {
  const settings: SettingsRepo = {
    async get() {
      const row = await db.settings.get('me');
      const { id: _id, ...rest } = row ?? { id: 'me' as const };
      return { ...DEFAULT_SETTINGS, ...rest };
    },
    async update(patch) {
      const next: Settings = { ...(await settings.get()), ...patch };
      await db.settings.put({ ...next, id: 'me' });
      return next;
    }
  };

  const favorites: FavoritesRepo = {
    all: () => db.favorites.toArray(),
    async toggle(wordId) {
      if (await db.favorites.get(wordId)) { await db.favorites.delete(wordId); return false; }
      await db.favorites.put({ wordId, addedAt: new Date().toISOString() });
      return true;
    }
  };

  const events: EventsRepo = {
    async add(e) { await db.events.add(e); },
    byDay: (dayKey) => db.events.where('dayKey').equals(dayKey).toArray(),
    all: () => db.events.toArray()
  };

  const cards: CardRepo = {
    all: () => db.cards.toArray(),
    byWord: (wordId) => db.cards.where('wordId').equals(wordId).toArray(),
    dueBefore: (iso) => db.cards.where('due').belowOrEqual(iso).toArray(),
    async put(c) { await db.cards.put(c); },
    async bulkPut(cs) { await db.cards.bulkPut(cs); },
    async wordIds() { return new Set((await db.cards.orderBy('wordId').uniqueKeys()) as string[]); }
  };

  const reviews: ReviewRepo = {
    async add(r) { await db.reviews.add(r); },
    all: () => db.reviews.toArray(),
    byDay: (dayKey) => db.reviews.where('dayKey').equals(dayKey).toArray()
  };

  const sessions: SessionRepo = {
    async add(s) { await db.sessions.add(s); },
    byDay: (dayKey) => db.sessions.where('dayKey').equals(dayKey).toArray()
  };

  const quizResults: QuizResultRepo = {
    async add(r) { await db.quizResults.add(r); },
    all: () => db.quizResults.toArray(),
    byKind: (kind) => db.quizResults.where('kind').equals(kind).toArray()
  };

  const backup: BackupService = {
    async exportAll() {
      const data: Record<string, unknown[]> = {};
      for (const t of TABLES) data[t] = await db.table(t).toArray();
      return { app: 'ispanyolca', version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data };
    },
    async importAll(file) {
      const f = validateBackup(file);
      let rows = 0;
      await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
        for (const t of TABLES) {
          const list = f.data[t] ?? [];
          await db.table(t).clear();
          if (list.length) await db.table(t).bulkAdd(list);
          rows += list.length;
        }
      });
      return { tables: TABLES.length, rows };
    }
  };

  return { settings, favorites, events, cards, reviews, sessions, quizResults, backup };
}

export class BackupError extends Error {}

export function validateBackup(file: unknown): BackupFile {
  const f = file as Partial<BackupFile> | null;
  if (!f || typeof f !== 'object') throw new BackupError('Dosya okunamadı.');
  if (f.app !== 'ispanyolca') throw new BackupError('Bu dosya bu uygulamanın yedeği değil.');
  if (typeof f.version !== 'number' || f.version > BACKUP_VERSION) throw new BackupError('Yedek sürümü desteklenmiyor.');
  if (!f.data || typeof f.data !== 'object') throw new BackupError('Yedekte veri bulunamadı.');
  for (const [k, v] of Object.entries(f.data)) {
    if (!(TABLES as readonly string[]).includes(k)) throw new BackupError(`Bilinmeyen tablo: ${k}`);
    if (!Array.isArray(v)) throw new BackupError(`Hatalı tablo: ${k}`);
    if (v.some((row) => !row || typeof row !== 'object')) throw new BackupError(`Hatalı kayıt: ${k}`);
  }
  return f as BackupFile;
}

export type Repos = ReturnType<typeof createRepos>;
