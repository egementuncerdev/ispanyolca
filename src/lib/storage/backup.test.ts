import { describe, expect, it } from 'vitest';
import { AppDB } from './db';
import { BackupError, createRepos, validateBackup } from './dexie';

const fresh = () => { const db = new AppDB(`test-${Math.random()}`); return { db, repos: createRepos(db) }; };

describe('yedekleme', () => {
  it('dışa aktar → içe aktar gidiş-dönüş', async () => {
    const a = fresh();
    await a.repos.settings.update({ theme: 'dark', dailyNewWords: 15 });
    await a.repos.favorites.toggle('casa');
    await a.repos.events.add({ type: 'review', at: '2026-10-21T10:00:00Z', dayKey: '2026-10-21' });
    const file = JSON.parse(JSON.stringify(await a.repos.backup.exportAll()));

    const b = fresh();
    await b.repos.favorites.toggle('perro'); // içe aktarınca silinmeli
    const res = await b.repos.backup.importAll(file);
    expect(res.rows).toBe(3);
    expect((await b.repos.settings.get()).dailyNewWords).toBe(15);
    expect((await b.repos.favorites.all()).map((f) => f.wordId)).toEqual(['casa']);
    expect(await b.repos.events.byDay('2026-10-21')).toHaveLength(1);
  });

  it('hatalı dosya reddedilir ve mevcut veri bozulmaz', async () => {
    const a = fresh();
    await a.repos.favorites.toggle('casa');
    await expect(a.repos.backup.importAll({ app: 'baska' })).rejects.toBeInstanceOf(BackupError);
    await expect(a.repos.backup.importAll({ app: 'ispanyolca', version: 1, data: { bilinmeyen: [] } })).rejects.toThrow('Bilinmeyen tablo');
    expect(await a.repos.favorites.all()).toHaveLength(1);
  });

  it('ayarlar varsayılanlarla birleşir', async () => {
    const a = fresh();
    expect((await a.repos.settings.get()).dayStartsAt).toBe('04:00');
    expect(() => validateBackup(null)).toThrow(BackupError);
  });
});
