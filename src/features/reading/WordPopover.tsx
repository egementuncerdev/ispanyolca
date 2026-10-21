/* Metindeki kelimeye dokununca açılan kart. Masaüstünde kelimenin altında,
   telefonda ekranın altında açılır. Escape ya da dışarı tıklama kapatır; odak kelimeye döner. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Check, Plus, X } from 'lucide-react';
import type { Word } from '@/types/content';
import type { ExtraEntry } from '@/content/readings/extra';
import { display, POS_LABEL, StatusBadge } from '@/components/WordBits';
import { Button } from '@/components/Button';
import { toIpa } from '@/lib/text/ipa';
import type { WordStatus } from '@/lib/srs/status';

export type PopoverEntry =
  | { t: 'word'; text: string; word: Word; note?: string }
  | { t: 'extra'; text: string; key: string; entry: ExtraEntry };

interface Props {
  entry: PopoverEntry;
  anchor: HTMLElement;
  status?: WordStatus;
  inDeck: boolean;
  onAdd: (w: Word) => Promise<void>;
  /** refocus: odağı kelimeye geri ver (dışarı tıklamada verilmez) */
  onClose: (refocus?: boolean) => void;
}

const W = 320;

export function WordPopover({ entry, anchor, status, inDeck, onAdd, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches);
  const [adding, setAdding] = useState(false);

  useLayoutEffect(() => {
    const place = () => {
      const m = window.matchMedia('(max-width: 639px)').matches;
      setMobile(m);
      if (m) {
        // alttaki kartın kelimeyi örtmemesi için sayfayı kaydır
        const r = anchor.getBoundingClientRect();
        const h = ref.current?.offsetHeight ?? 260;
        const gap = r.bottom - (window.innerHeight - h - 16);
        if (gap > 0) window.scrollBy({ top: gap, behavior: 'smooth' });
        return;
      }
      const r = anchor.getBoundingClientRect();
      const h = ref.current?.offsetHeight ?? 220;
      const above = r.bottom + 8 + h > window.innerHeight && r.top - 8 - h > 0;
      const left = Math.min(Math.max(12, r.left + r.width / 2 - W / 2), window.innerWidth - W - 12);
      setPos({ top: above ? r.top - 8 - h : r.bottom + 8, left, above });
    };
    place();
    const onScroll = () => { if (!window.matchMedia('(max-width: 639px)').matches) place(); };
    window.addEventListener('resize', place);
    window.addEventListener('scroll', onScroll, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', onScroll, true); };
  }, [anchor, entry]);

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose(true); } };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !anchor.contains(t)) onClose(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [anchor, onClose]);

  const w = entry.t === 'word' ? entry.word : null;
  const title = entry.t === 'word' ? display(entry.word) : entry.key;
  const shell = mobile
    ? 'fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-line-2 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]'
    : 'fixed z-50 rounded-xl border border-line-2 p-5 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)]';

  return (
    <div ref={ref} role="dialog" aria-label={`${title}: anlamı`} tabIndex={-1}
      className={`${shell} bg-surface focus:outline-none`}
      style={mobile ? undefined : { width: W, top: pos?.top ?? -9999, left: pos?.left ?? 0 }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p lang="es" className="display text-[1.7rem] leading-tight">{title}</p>
          <p className="mt-0.5 text-sm"><span className="ipa text-muted" lang="es-ES-fonipa">/{entry.t === 'word' ? entry.word.ipa : toIpa(entry.key)}/</span></p>
        </div>
        <button type="button" onClick={() => onClose(true)} className="-mr-2 -mt-1 grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-sunken hover:text-ink" aria-label="Kapat"><X className="size-4" /></button>
      </div>

      {w ? (
        <>
          <p className="mt-3 text-lg">{w.tr}</p>
          <p className="mt-1 text-sm text-muted">
            {POS_LABEL[w.partOfSpeech]}
            {entry.t === 'word' && entry.text.toLocaleLowerCase('es') !== w.es.toLocaleLowerCase('es') && <> · <span lang="es" className="text-ink-2">{entry.text.toLocaleLowerCase('es')}</span>{entry.note ? ` (${entry.note})` : ''}</>}
          </p>
          <p lang="es" className="mt-3 border-l-2 border-line-2 pl-3 text-[15px] text-ink-2">{w.exampleEs}<span lang="tr" className="mt-0.5 block text-sm text-muted">{w.exampleTr}</span></p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {inDeck ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-good"><Check className="size-4" />Kartlarında {status && <StatusBadge status={status} />}</span>
            ) : (
              <Button size="sm" disabled={adding} icon={<Plus className="size-4" />} onClick={async () => { setAdding(true); await onAdd(w); setAdding(false); }}>Kartlarıma ekle</Button>
            )}
            <Link to={`/kelimeler/${w.id}`} className="ml-auto text-sm text-accent-ink underline decoration-line-2 underline-offset-4 hover:decoration-accent">Ayrıntı</Link>
          </div>
        </>
      ) : entry.t === 'extra' && (
        <>
          <p className="mt-3 text-lg">{entry.entry.tr}</p>
          <p className="mt-1 text-sm text-muted">{entry.entry.kind}</p>
          {entry.entry.note && <p className="mt-3 border-l-2 border-line-2 pl-3 text-[15px] text-ink-2">{entry.entry.note}</p>}
          <p className="mt-4 text-xs text-muted">{entry.entry.kind === 'isim' ? 'Bu kelime kart listesinde yok; yalnız bu metin için açıklandı.' : 'Dilbilgisi kelimesi; kartlara eklenmez.'}</p>
        </>
      )}
    </div>
  );
}
