import { useSettings } from '@/app/settings';
import { EmptyState } from '@/components/EmptyState';
import { ButtonLink } from '@/components/Button';
import { Brain, Settings } from 'lucide-react';
import { dayKey } from '@/lib/time/dayKey';

const longDate = (tz: string) => new Intl.DateTimeFormat('tr-TR', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

export default function DashboardPage() {
  const { settings } = useSettings();
  return (
    <>
      <header className="mb-10 border-b border-line pb-8">
        <p className="eyebrow mb-3">{longDate(settings.timezone)} · Seviye {settings.level}</p>
        <h1 className="display text-[2.6rem] leading-[1.02] sm:text-[3.4rem]">¡Hola, <em className="text-accent-ink">{settings.name || 'amigo'}</em>!</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-2">Bugün ne çalışacağın burada görünecek.</p>
      </header>
      <EmptyState
        icon={<Brain className="size-5" strokeWidth={1.75} />}
        title="Henüz kelime öğrenmedin"
        text="Kelimeler ve tekrar sistemi bir sonraki aşamada geliyor. Şimdilik ayarlarını yapabilirsin: günlük yeni kelime sayısı, hedef süren ve günün başlangıç saati."
        action={<ButtonLink to="/ayarlar" variant="secondary" icon={<Settings className="size-4" strokeWidth={1.75} />}>Ayarlara git</ButtonLink>}
      />
      <p className="sr-only">Gün: {dayKey(new Date(), settings.timezone, settings.dayStartsAt)}</p>
    </>
  );
}
