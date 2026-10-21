import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { ComingSoon } from '@/features/placeholder/ComingSoon';
import { NAV } from './nav';
import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { ButtonLink } from '@/components/Button';

const page = (load: () => Promise<{ default: ComponentType }>) => {
  const C = lazy(load);
  return <Suspense fallback={<div className="py-20 text-center text-muted" role="status">Yükleniyor…</div>}><C /></Suspense>;
};
const iconFor = (path: string) => NAV.find((n) => n.to === path)?.icon ?? Compass;
const soon = (path: string, title: string, text: string) => <ComingSoon title={title} icon={iconFor(path)} text={text} />;

function NotFound() {
  return <EmptyState icon={<Compass className="size-5" strokeWidth={1.75} />} title="Sayfa bulunamadı" text="Aradığın sayfa yok ya da taşınmış." action={<ButtonLink to="/">Ana sayfaya dön</ButtonLink>} />;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: page(() => import('@/features/dashboard/DashboardPage')) },
      { path: '/kurs', element: soon('/kurs', 'A1 Kursu', '8 üniteli A1 kursu: her ünitede ders, kelimeler, alıştırma, quiz, okuma ve ünite testi.') },
      { path: '/kelimeler', element: page(() => import('@/features/words/WordsPage')) },
      { path: '/kelimeler/:id', element: page(() => import('@/features/words/WordDetailPage')) },
      { path: '/calis', element: page(() => import('@/features/flashcards/StudyPage')) },
      { path: '/grammar', element: soon('/grammar', 'Grammar', '23 A1 konusu: kısa anlatım, çekim tabloları ve alıştırmalar.') },
      { path: '/quiz', element: soon('/quiz', 'Quizler', 'Kelime, grammar, çeviri ve boşluk doldurma quizleri.') },
      { path: '/oyunlar', element: soon('/oyunlar', 'Oyunlar', 'Word Match, Hangman, Memory, Speed Quiz ve daha fazlası.') },
      { path: '/okuma', element: soon('/okuma', 'Okuma', 'Kısa A1 metinleri ve mini hikâyeler; her kelimeye tıklayıp anlamını görebileceksin.') },
      { path: '/sozluk', element: soon('/sozluk', 'Sözlük', 'İspanyolca veya Türkçe anlık arama, fiil çekim tabloları.') },
      { path: '/istatistikler', element: soon('/istatistikler', 'İstatistikler', 'İlerleme grafikleri ve çalışma ısı haritası.') },
      { path: '/basarimlar', element: soon('/basarimlar', 'Başarımlar', 'Seriler, kelime sayıları ve quizlerle açılan rozetler.') },
      { path: '/ayarlar', element: page(() => import('@/features/settings/SettingsPage')) },
      { path: '*', element: <NotFound /> }
    ]
  }
]);
