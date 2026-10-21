import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Download, Monitor, Moon, Sun, Upload } from 'lucide-react';
import { useSettings } from '@/app/settings';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Field, inputClass } from '@/components/Field';
import { Segmented } from '@/components/Segmented';
import { Button } from '@/components/Button';
import { repos, BackupError } from '@/lib/storage';
import { dayKey } from '@/lib/time/dayKey';
import type { Level } from '@/types/content';
import type { Settings, ThemePref } from '@/types/user';

const GOAL_MINUTES = [5, 10, 15, 20, 30, 45, 60];
const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-5">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h2>
      <div className="grid gap-6">{children}</div>
    </Card>
  );
}

export default function SettingsPage() {
  const { settings, update, reload } = useSettings();
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [pending, setPending] = useState<unknown>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const zones = useMemo(() => {
    try { return Intl.supportedValuesOf('timeZone'); } catch { return ['Europe/Istanbul']; }
  }, []);

  const set = async (patch: Partial<Settings>) => {
    await update(patch);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  const doExport = async () => {
    const data = await repos.backup.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ispanyolca-yedek-${dayKey(new Date(), settings.timezone, settings.dayStartsAt)}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setMsg({ kind: 'ok', text: 'Yedek dosyası indirildi.' });
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setPending(JSON.parse(await file.text()));
      dialogRef.current?.showModal();
    } catch {
      setMsg({ kind: 'error', text: 'Dosya okunamadı; geçerli bir JSON yedeği seçin.' });
    }
  };

  const confirmImport = async () => {
    dialogRef.current?.close();
    try {
      const res = await repos.backup.importAll(pending);
      await reload();
      setMsg({ kind: 'ok', text: `Yedek geri yüklendi (${res.rows} kayıt).` });
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof BackupError ? err.message : 'Yedek geri yüklenemedi.' });
    } finally {
      setPending(null);
    }
  };

  return (
    <>
      <PageHeader title="Ayarlar" subtitle="Değişiklikler otomatik kaydedilir." actions={<p role="status" className={`text-sm text-emerald-600 transition-opacity dark:text-emerald-400 ${saved ? 'opacity-100' : 'opacity-0'}`}>Kaydedildi</p>} />

      <Section title="Görünüm">
        <Field id="theme" label="Tema">
          <Segmented<ThemePref>
            label="Tema"
            value={settings.theme}
            onChange={(theme) => void set({ theme })}
            options={[
              { value: 'light', label: 'Açık', icon: <Sun className="size-4" aria-hidden="true" /> },
              { value: 'dark', label: 'Koyu', icon: <Moon className="size-4" aria-hidden="true" /> },
              { value: 'system', label: 'Sistem', icon: <Monitor className="size-4" aria-hidden="true" /> }
            ]}
          />
        </Field>
        <Field id="name" label="Adın" hint="Ana sayfadaki karşılamada kullanılır.">
          <input id="name" className={inputClass} value={settings.name} maxLength={40} onChange={(e) => void set({ name: e.target.value })} />
        </Field>
      </Section>

      <Section title="Çalışma">
        <Field id="newWords" label="Günlük yeni kelime" hint="Her gün tekrar listesine eklenecek yeni kelime sayısı.">
          <input id="newWords" type="number" inputMode="numeric" min={0} max={50} className={inputClass} value={settings.dailyNewWords}
            onChange={(e) => void set({ dailyNewWords: Math.max(0, Math.min(50, Number(e.target.value) || 0)) })} aria-describedby="newWords-hint" />
        </Field>
        <Field id="goal" label="Günlük hedef süresi">
          <select id="goal" className={inputClass} value={settings.dailyGoalMinutes} onChange={(e) => void set({ dailyGoalMinutes: Number(e.target.value) })}>
            {GOAL_MINUTES.map((m) => <option key={m} value={m}>{m} dakika</option>)}
          </select>
        </Field>
        <Field id="level" label="Seviye">
          <select id="level" className={inputClass} value={settings.level} onChange={(e) => void set({ level: e.target.value as Level })}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <Field id="strict" label="Katı aksan modu" hint="Açıkken eksik aksanlı cevaplar (esta → está) yanlış sayılır.">
          <label className="inline-flex cursor-pointer items-center gap-3">
            <input id="strict" type="checkbox" className="peer sr-only" checked={settings.strictAccents} onChange={(e) => void set({ strictAccents: e.target.checked })} aria-describedby="strict-hint" />
            <span className="relative h-7 w-12 rounded-full bg-slate-300 transition-colors peer-checked:bg-accent-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-500 after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5 dark:bg-slate-700" aria-hidden="true" />
            <span className="text-sm text-slate-600 dark:text-slate-400">{settings.strictAccents ? 'Açık' : 'Kapalı'}</span>
          </label>
        </Field>
      </Section>

      <Section title="Zaman">
        <Field id="dayStart" label="Gün başlangıç saati" hint="Bu saatten önce yaptığın çalışma bir önceki güne sayılır; gece geç çalışınca serin bozulmaz.">
          <input id="dayStart" type="time" className={inputClass} value={settings.dayStartsAt} onChange={(e) => e.target.value && void set({ dayStartsAt: e.target.value })} aria-describedby="dayStart-hint" />
        </Field>
        <Field id="tz" label="Saat dilimi">
          <select id="tz" className={inputClass} value={settings.timezone} onChange={(e) => void set({ timezone: e.target.value })}>
            {zones.map((z) => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}
          </select>
        </Field>
        <p className="text-sm text-slate-500 dark:text-slate-400">Şu an sayılan gün: <strong className="font-medium text-slate-700 dark:text-slate-200">{dayKey(new Date(), settings.timezone, settings.dayStartsAt)}</strong></p>
      </Section>

      <Section title="Veri">
        <p className="text-sm text-slate-600 dark:text-slate-400">Bütün ilerlemen yalnızca bu tarayıcıda saklanır. Tarayıcı verisi silinirse kaybolur; düzenli yedek almanı öneririm.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" icon={<Download className="size-4" aria-hidden="true" />} onClick={() => void doExport()}>Verimi dışa aktar (JSON)</Button>
          <Button variant="secondary" icon={<Upload className="size-4" aria-hidden="true" />} onClick={() => fileRef.current?.click()}>İçe aktar</Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void onFile(e)} aria-label="Yedek dosyası seç" />
        </div>
        {msg && <p role="status" className={`rounded-xl px-4 py-3 text-sm ${msg.kind === 'ok' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'}`}>{msg.text}</p>}
      </Section>

      <dialog ref={dialogRef} className="m-auto w-[min(92vw,28rem)] rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl backdrop:bg-slate-900/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" onClose={() => setPending(null)}>
        <h2 className="text-lg font-semibold">Yedek geri yüklensin mi?</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Bu tarayıcıdaki mevcut ilerlemen, yedek dosyasındakiyle değiştirilecek. Bu işlem geri alınamaz.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => dialogRef.current?.close()}>Vazgeç</Button>
          <Button variant="danger" onClick={() => void confirmImport()}>Evet, geri yükle</Button>
        </div>
      </dialog>
    </>
  );
}
