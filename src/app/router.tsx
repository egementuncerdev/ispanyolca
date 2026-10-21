import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { comingSoon } from '@/features/placeholder/ComingSoon';
import { EmptyState } from '@/components/EmptyState';
import { ButtonLink } from '@/components/Button';

const page = (load: () => Promise<{ default: ComponentType }>) => {
  const C = lazy(load);
  return <Suspense fallback={<div className="py-20 text-center text-slate-400" role="status">Yükleniyor…</div>}><C /></Suspense>;
};
const soon = (title: string, emoji: string, text: string) => { const C = comingSoon(title, emoji, text); return <C />; };

function NotFound() {
  return <EmptyState emoji="🧭" title="Sayfa bulunamadı" text="Aradığın sayfa yok ya da taşınmış." action={<ButtonLink to="/">Ana sayfaya dön</ButtonLink>} />;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: page(() => import('@/features/dashboard/DashboardPage')) },
      { path: '/kurs', element: soon('A1 Kursu', '🎓', '8 üniteli A1 kursu: her ünitede ders, kelimeler, alıştırma, quiz, okuma ve ünite testi.') },
      { path: '/kelimeler', element: soon('Kelimeler', '🧠', 'Yaklaşık 300 A1 kelime, kelime kartları ve tekrar sistemi bir sonraki aşamada geliyor.') },
      { path: '/grammar', element: soon('Grammar', '📚', '23 A1 konusu: kısa anlatım, çekim tabloları ve alıştırmalar.') },
      { path: '/quiz', element: soon('Quizler', '🧩', 'Kelime, grammar, çeviri ve boşluk doldurma quizleri.') },
      { path: '/oyunlar', element: soon('Oyunlar', '🎮', 'Word Match, Hangman, Memory, Speed Quiz ve daha fazlası.') },
      { path: '/okuma', element: soon('Okuma', '📖', 'Kısa A1 metinleri ve mini hikâyeler; her kelimeye tıklayıp anlamını görebileceksin.') },
      { path: '/sozluk', element: soon('Sözlük', '🔎', 'İspanyolca veya Türkçe anlık arama, fiil çekim tabloları.') },
      { path: '/istatistikler', element: soon('İstatistikler', '📊', 'İlerleme grafikleri ve çalışma ısı haritası.') },
      { path: '/basarimlar', element: soon('Başarımlar', '🏆', 'Seriler, kelime sayıları ve quizlerle açılan rozetler.') },
      { path: '/ayarlar', element: page(() => import('@/features/settings/SettingsPage')) },
      { path: '*', element: <NotFound /> }
    ]
  }
]);
