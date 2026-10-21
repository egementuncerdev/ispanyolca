import { useLiveQuery } from 'dexie-react-hooks';
import { Play } from 'lucide-react';
import { useSettings } from '@/app/settings';
import { ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { repos } from '@/lib/storage';
import { todayPlan } from '@/lib/srs/study';
import { WORDS } from '@/content/vocabulary';

const longDate = (tz: string) => new Intl.DateTimeFormat('tr-TR', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

export default function DashboardPage() {
  const { settings } = useSettings();
  const cardCount = useLiveQuery(() => repos.cards.all().then((c) => c.length), [], 0);
  const plan = useLiveQuery(() => todayPlan(repos, settings), [settings, cardCount]);
  const learned = useLiveQuery(() => repos.cards.wordIds().then((s) => s.size), [cardCount], 0);
  const due = plan?.due.length ?? 0;
  const fresh = plan?.newWords.length ?? 0;
  const firstTime = learned === 0;

  return (
    <>
      <header className="mb-10 border-b border-line pb-8">
        <p className="eyebrow mb-3">{longDate(settings.timezone)} · Seviye {settings.level}</p>
        <h1 className="display text-[2.6rem] leading-[1.02] sm:text-[3.4rem]">¡Hola, <em className="text-accent-ink">{settings.name || 'amigo'}</em>!</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-2">
          {firstTime ? 'Bugünün ilk kelimeleriyle başlayalım.' : due + fresh ? 'Bugün seni bekleyenler hazır.' : 'Bugünlük kartlarını bitirdin.'}
        </p>
      </header>

      <Card className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
        <div>
          <p className="eyebrow mb-3">Bugünkü çalışma</p>
          <dl className="flex gap-10">
            <div><dt className="text-sm text-muted">Bekleyen tekrar</dt><dd className="display text-4xl">{due}</dd></div>
            <div><dt className="text-sm text-muted">Yeni kelime</dt><dd className="display text-4xl">{fresh}</dd></div>
            <div><dt className="text-sm text-muted">Kartlarında</dt><dd className="display text-4xl">{learned}<span className="text-lg text-muted"> / {WORDS.length}</span></dd></div>
          </dl>
        </div>
        <ButtonLink to="/calis" size="lg" icon={<Play className="size-4" strokeWidth={2} />} className={due + fresh ? '' : 'pointer-events-none opacity-45'} aria-disabled={!(due + fresh)}>
          {firstTime ? 'Çalışmaya başla' : 'Bugünkü çalışmaya başla'}
        </ButtonLink>
      </Card>
      <p className="mt-4 text-sm text-muted">Grammar, quiz, okuma ve günlük hedefler sonraki aşamalarda bu ekrana eklenecek.</p>
    </>
  );
}
