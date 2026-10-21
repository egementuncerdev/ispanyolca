import { BookA, BookOpen, BookText, Brain, ChartColumn, Gamepad2, GraduationCap, House, ListChecks, Settings, Trophy, type LucideIcon } from 'lucide-react';

export interface NavItem { to: string; label: string; short?: string; icon: LucideIcon; mobile?: boolean }

/** Menü sırası; mobile: alt menüde doğrudan görünenler (geri kalanı "Diğer") */
export const NAV: NavItem[] = [
  { to: '/', label: 'Ana Sayfa', icon: House, mobile: true },
  { to: '/kurs', label: 'Kurs', icon: GraduationCap },
  { to: '/kelimeler', label: 'Kelimeler', icon: Brain, mobile: true },
  { to: '/grammar', label: 'Grammar', icon: BookOpen, mobile: true },
  { to: '/quiz', label: 'Quizler', icon: ListChecks },
  { to: '/oyunlar', label: 'Oyunlar', icon: Gamepad2, mobile: true },
  { to: '/okuma', label: 'Okuma', icon: BookText },
  { to: '/sozluk', label: 'Sözlük', icon: BookA },
  { to: '/istatistikler', label: 'İstatistikler', short: 'İstatistik', icon: ChartColumn, mobile: true },
  { to: '/basarimlar', label: 'Başarımlar', icon: Trophy },
  { to: '/ayarlar', label: 'Ayarlar', icon: Settings }
];
