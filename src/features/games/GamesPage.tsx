import { Link } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { PageHeader } from '@/components/PageHeader';
import { repos } from '@/lib/storage';
import { bestScores } from '@/lib/games/record';
import { useLearnedIds } from '@/lib/games/useLearned';
import { GAMES } from './catalog';

export default function GamesPage() {
  const results = useLiveQuery(() => repos.quizResults.byKind('game'), [], []);
  const best = bestScores(results);
  const learned = useLearnedIds();
  return (
    <>
      <PageHeader eyebrow="Oyun merkezi" title="Oyunlar" subtitle="Hepsi kartlarındaki kelimelerle oynanır; kartların azsa öğrenme sırasındaki ilk kelimelerle tamamlanır." />
      {learned && learned.size < 12 && <p className="mb-6 rounded-lg bg-sunken px-4 py-3 text-sm text-ink-2">Kartlarında {learned.size} kelime var. Daha çok kelime çalıştıkça oyunlar sana özel hâle gelir.</p>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {GAMES.map(({ id, title, desc, icon: Icon }) => {
          const b = best.get(id);
          return (
            <li key={id}>
              <Link to={`/oyunlar/${id}`} className="group flex h-full gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-2">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line-2 text-accent-ink" aria-hidden="true"><Icon className="size-5" strokeWidth={1.75} /></span>
                <span className="min-w-0">
                  <span className="display block text-[1.45rem] leading-tight group-hover:text-accent-ink">{title}</span>
                  <span className="mt-1 block text-[15px] text-ink-2">{desc}</span>
                  <span className="mt-2 block text-sm text-muted">{b ? (id === 'hiz' ? `En iyi: ${b.correct} doğru` : `En iyi: ${b.correct} / ${b.total}`) + ` · ${b.plays} oyun` : 'Henüz oynamadın'}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
