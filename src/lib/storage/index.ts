/* Uygulamanın kullandığı tek giriş noktası */
import { AppDB } from './db';
import { createRepos } from './dexie';

export const db = new AppDB();
export const repos = createRepos(db);
export type { Repos } from './dexie';
export { BackupError } from './dexie';
