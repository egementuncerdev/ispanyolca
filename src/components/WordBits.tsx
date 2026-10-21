/* Kelime gösterimi için küçük parçalar */
import { Star } from 'lucide-react';
import type { Verb, Word } from '@/types/content';
import { withArticle } from '@/content/vocabulary/helpers';
import { STATUS_LABEL, type WordStatus } from '@/lib/srs/status';
import { PERSONS, PERSON_LABEL } from '@/content/verbs/conjugate';
import { repos } from '@/lib/storage';

export const POS_LABEL: Record<Word['partOfSpeech'], string> = {
  noun: 'isim', verb: 'fiil', adjective: 'sıfat', adverb: 'zarf', pronoun: 'zamir', preposition: 'edat',
  conjunction: 'bağlaç', interjection: 'ünlem', number: 'sayı', article: 'artikel', phrase: 'kalıp'
};

export const display = (w: Word) => withArticle(w);

export function Ipa({ w, className = '' }: { w: Word; className?: string }) {
  return <span className={`ipa text-muted ${className}`} lang="es-ES-fonipa">/{w.ipa}/</span>;
}

const STATUS_STYLE: Record<WordStatus, string> = {
  new: 'border-line-2 text-muted',
  learning: 'border-accent/40 text-accent-ink',
  known: 'border-good/40 text-good',
  mastered: 'border-good bg-good-soft text-good'
};

export function StatusBadge({ status }: { status: WordStatus }) {
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function FavoriteButton({ wordId, active, size = 'md' }: { wordId: string; active: boolean; size?: 'sm' | 'md' }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); void repos.favorites.toggle(wordId); }}
      aria-pressed={active}
      aria-label={active ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      className={`grid place-items-center rounded-lg transition-colors hover:bg-sunken ${size === 'sm' ? 'size-8' : 'size-10'} ${active ? 'text-accent' : 'text-muted'}`}
    >
      <Star className={size === 'sm' ? 'size-4' : 'size-5'} strokeWidth={1.75} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}

export function ConjugationTable({ verb }: { verb: Verb }) {
  const p = verb.conjugations.presente;
  return (
    <table className="w-full text-[15px]">
      <caption className="eyebrow mb-2 text-left">Presente</caption>
      <tbody>
        {PERSONS.map((k) => (
          <tr key={k} className="border-t border-line first:border-t-0">
            <th scope="row" className="w-1/2 py-1.5 pr-4 text-left font-normal text-muted">{PERSON_LABEL[k]}</th>
            <td className="py-1.5 font-medium" lang="es">{p[k]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Örnek cümlede kelimeyi vurgula */
export function Example({ w, hideBlank = false }: { w: Word; hideBlank?: boolean }) {
  const parts = w.blank ? w.exampleEs.split(new RegExp(`(${w.blank.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i')) : [w.exampleEs];
  return (
    <p lang="es" className="display text-xl leading-snug">
      {parts.map((p, i) => (w.blank && p.toLowerCase() === w.blank.toLowerCase()
        ? (hideBlank ? <span key={i} className="inline-block min-w-16 border-b-2 border-accent" aria-label="boşluk">&nbsp;</span> : <mark key={i} className="bg-accent-soft px-0.5 text-ink">{p}</mark>)
        : <span key={i}>{p}</span>))}
    </p>
  );
}
