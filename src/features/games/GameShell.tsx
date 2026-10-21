/* Oyunların ortak çerçevesi: başlık, sağda durum, bitiş ekranı */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button, ButtonLink } from '@/components/Button';
import { GAME_BY_ID } from './catalog';

export function GameShell({ id, status, children }: { id: string; status?: ReactNode; children: ReactNode }) {
  const g = GAME_BY_ID[id]!;
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/oyunlar" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="size-4" strokeWidth={1.75} /> Oyunlar</Link>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="eyebrow mb-1">Oyun</p>
          <h1 className="display text-[2.2rem] leading-none">{g.title}</h1>
        </div>
        {status && <div className="text-right text-sm tabular-nums text-ink-2">{status}</div>}
      </header>
      {children}
    </div>
  );
}

export function GameOver({ title = '¡Fin del juego!', score, detail, best, onAgain }: { title?: string; score: ReactNode; detail?: ReactNode; best?: ReactNode; onAgain: () => void }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-7 sm:p-9" role="status">
      <p className="eyebrow mb-2">Oyun bitti</p>
      <p className="display text-[2.6rem] leading-none">{title}</p>
      <p className="display mt-5 text-5xl">{score}</p>
      {detail && <p className="mt-2 text-ink-2">{detail}</p>}
      {best && <p className="mt-1 text-sm text-muted">{best}</p>}
      <div className="mt-7 flex flex-wrap gap-3">
        <Button icon={<RotateCcw className="size-4" strokeWidth={1.75} />} onClick={onAgain}>Tekrar oyna</Button>
        <ButtonLink to="/oyunlar" variant="secondary">Başka oyun</ButtonLink>
      </div>
    </div>
  );
}
