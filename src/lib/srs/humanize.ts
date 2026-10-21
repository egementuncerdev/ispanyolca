/* "Sonraki tekrar" metni: algoritma gizli, kullanıcı yalnız zamanı görür. */
import { diffDays, dayKey } from '@/lib/time/dayKey';

export function untilText(due: Date, now = new Date(), tz = 'Europe/Istanbul', dayStartsAt = '04:00'): string {
  const ms = due.getTime() - now.getTime();
  if (ms < 60_000) return 'şimdi';
  if (ms < 60 * 60_000) return `${Math.round(ms / 60_000)} dk sonra`;
  const days = diffDays(dayKey(now, tz, dayStartsAt), dayKey(due, tz, dayStartsAt));
  if (days <= 0) return `${Math.round(ms / 3_600_000)} saat sonra`;
  if (days === 1) return 'yarın';
  if (days < 30) return `${days} gün sonra`;
  const months = Math.round(days / 30);
  return months >= 12 ? '1 yıl sonra' : `${months} ay sonra`;
}

/** Buton altı için kısa biçim: "10 dk", "1 g", "4 g", "2 ay" */
export function shortInterval(due: Date, now = new Date()): string {
  const min = Math.max(1, Math.round((due.getTime() - now.getTime()) / 60_000));
  if (min < 60) return `${min} dk`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} sa`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} g`;
  return `${Math.round(d / 30)} ay`;
}
