import { useSettings } from '@/app/settings';
import { EmptyState } from '@/components/EmptyState';
import { ButtonLink } from '@/components/Button';
import { Settings } from 'lucide-react';

export default function DashboardPage() {
  const { settings } = useSettings();
  return (
    <>
      <header className="mb-8">
        <p className="text-sm font-medium text-accent-600 dark:text-accent-400">Seviye {settings.level}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">¡Hola, {settings.name || 'amigo'}!</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Bugün ne çalışacağın burada görünecek.</p>
      </header>
      <EmptyState
        emoji="🧠"
        title="Henüz kelime öğrenmedin"
        text="Kelimeler ve tekrar sistemi bir sonraki aşamada geliyor. Şimdilik ayarlarını yapabilirsin: günlük yeni kelime sayısı, hedef süren ve günün başlangıç saati."
        action={<ButtonLink to="/ayarlar" variant="secondary" icon={<Settings className="size-4" />}>Ayarlara git</ButtonLink>}
      />
    </>
  );
}
