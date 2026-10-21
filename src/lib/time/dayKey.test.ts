import { describe, expect, it } from 'vitest';
import { addDays, dayKey, diffDays } from './dayKey';

// İstanbul UTC+3 (yaz saati yok)
const ist = (iso: string) => new Date(`${iso}+03:00`);

describe('dayKey', () => {
  it('gün başlangıcından sonra aynı gün', () => {
    expect(dayKey(ist('2026-10-21T04:00:00'))).toBe('2026-10-21');
    expect(dayKey(ist('2026-10-21T23:59:00'))).toBe('2026-10-21');
  });
  it('04:00 öncesi bir önceki güne sayılır', () => {
    expect(dayKey(ist('2026-10-22T03:59:00'))).toBe('2026-10-21');
    expect(dayKey(ist('2026-10-22T00:30:00'))).toBe('2026-10-21');
  });
  it('gün başlangıcı ayarlanabilir', () => {
    expect(dayKey(ist('2026-10-22T00:30:00'), 'Europe/Istanbul', '00:00')).toBe('2026-10-22');
    expect(dayKey(ist('2026-10-22T05:30:00'), 'Europe/Istanbul', '06:00')).toBe('2026-10-21');
  });
  it('ay ve yıl sınırı', () => {
    expect(dayKey(ist('2027-01-01T02:00:00'))).toBe('2026-12-31');
  });
  it('başka saat dilimi', () => {
    expect(dayKey(new Date('2026-10-21T10:00:00Z'), 'America/New_York', '04:00')).toBe('2026-10-21');
    expect(dayKey(new Date('2026-10-21T07:00:00Z'), 'America/New_York', '04:00')).toBe('2026-10-20');
  });
  it('gün aritmetiği', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(diffDays('2026-10-21', '2026-11-04')).toBe(14);
  });
});
