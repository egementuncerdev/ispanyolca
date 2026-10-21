/* "Gün" kavramı: saat dilimi + gün başlangıç saati (ör. 04:00).
   04:00'ten önce yapılan çalışma bir önceki güne sayılır. */

const parseHHMM = (s: string): number => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return 0;
  const h = Math.min(23, Number(m[1]));
  const min = Math.min(59, Number(m[2]));
  return h * 60 + min;
};

/** Verilen an için "YYYY-MM-DD" gün anahtarı */
export function dayKey(date: Date, timezone = 'Europe/Istanbul', dayStartsAt = '04:00'): string {
  const shifted = new Date(date.getTime() - parseHHMM(dayStartsAt) * 60_000);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(shifted);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** "YYYY-MM-DD" anahtarına gün ekle/çıkar */
export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d! + n));
  return dt.toISOString().slice(0, 10);
}

/** İki gün anahtarı arasındaki gün farkı (b - a) */
export function diffDays(a: string, b: string): number {
  const t = (k: string) => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y!, m! - 1, d!); };
  return Math.round((t(b) - t(a)) / 86_400_000);
}
