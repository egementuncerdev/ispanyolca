/* Ayarlar: IndexedDB'den yüklenir, değişince kaydedilir; tema <html> üzerine uygulanır. */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { repos } from '@/lib/storage';
import { DEFAULT_SETTINGS, type Settings } from '@/types/user';

interface Ctx { settings: Settings; ready: boolean; update: (patch: Partial<Settings>) => Promise<void>; reload: () => Promise<void> }
const SettingsContext = createContext<Ctx | null>(null);

const prefersDark = () => matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(theme: Settings['theme']) {
  const dark = theme === 'dark' || (theme === 'system' && prefersDark());
  document.documentElement.classList.toggle('dark', dark);
  try { localStorage.setItem('theme', theme); } catch { /* gizli mod */ }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    const s = await repos.settings.get();
    setSettings(s);
    setReady(true);
  }, []);

  useEffect(() => { void reload(); }, [reload]);
  useEffect(() => { if (ready) applyTheme(settings.theme); }, [ready, settings.theme]);
  useEffect(() => {
    if (settings.theme !== 'system') return;
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = () => applyTheme('system');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [settings.theme]);

  const update = useCallback(async (patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
    setSettings(await repos.settings.update(patch));
  }, []);

  return <SettingsContext.Provider value={{ settings, ready, update, reload }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings, SettingsProvider içinde kullanılmalı');
  return ctx;
}
