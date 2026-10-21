/* İçerik yazımını kısaltan yardımcılar. Artikel, çoğul, id, IPA ve boşluk biçimi
   kurallarla üretilir; gerekirse her kelimede elle verilir (opts). */
import type { Gender, Level, PartOfSpeech, Word } from '@/types/content';
import { toIpa } from '@/lib/text/ipa';
import { stripAccents } from '@/lib/text/normalize';

export interface Opts {
  id?: string;
  ipa?: string;
  plural?: string | null;
  feminine?: string;
  article?: 'el' | 'la';
  blank?: string | null;
  synonyms?: string[];
  antonyms?: string[];
  related?: string[];
  emoji?: string;
  latamNote?: string;
  level?: Level;
  tags?: string[];
}

export const slug = (s: string) => stripAccents(s.toLocaleLowerCase('es')).replace(/[¿?¡!.,]/g, '').trim().replace(/\s+/g, '-');

const VOWEL = /[aeiouáéíóú]$/;
const DROP: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };

/** Çoğul: sesliyle biten +s, ünsüzle biten +es, z → ces; -ión/-ín/-és/-ús/-án aksanı düşer */
export function pluralize(w: string): string {
  if (VOWEL.test(w)) return `${w}s`;
  if (w.endsWith('z')) return `${w.slice(0, -1)}ces`;
  const m = /([áéíóú])([nsl])$/.exec(w);
  if (m) return `${w.slice(0, -2)}${DROP[m[1]!]}${m[2]}es`;
  return `${w}es`;
}

/** Örnek cümlede kelimenin geçtiği tam biçim (bütün kelime, büyük/küçük harf duyarsız) */
function findBlank(sentence: string, form: string): string | undefined {
  const esc = form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(`(^|[^\\p{L}])(${esc})(?=$|[^\\p{L}])`, 'iu').exec(sentence);
  return m?.[2];
}

function base(es: string, tr: string, pos: PartOfSpeech, gender: Gender, ex: [string, string], o: Opts, topic: string): Word {
  const article = pos === 'noun' ? (o.article ?? (gender === 'f' ? 'la' : 'el')) : null;
  const blank = o.blank === null ? undefined : o.blank ?? findBlank(ex[0], es);
  return {
    id: o.id ?? slug(es),
    es,
    tr,
    ipa: o.ipa ?? toIpa(es),
    partOfSpeech: pos,
    gender,
    article,
    ...(pos === 'noun' || pos === 'adjective' ? (o.plural === null ? {} : { plural: o.plural ?? pluralize(es) }) : {}),
    ...(o.feminine ? { feminine: o.feminine } : {}),
    exampleEs: ex[0],
    exampleTr: ex[1],
    ...(blank ? { blank } : {}),
    ...(o.synonyms ? { synonyms: o.synonyms } : {}),
    ...(o.antonyms ? { antonyms: o.antonyms } : {}),
    ...(o.related ? { related: o.related } : {}),
    level: o.level ?? 'A1',
    tags: o.tags ?? [topic],
    ...(o.emoji ? { emoji: o.emoji } : {}),
    ...(o.latamNote ? { latamNote: o.latamNote } : {})
  };
}

/** Bir konu için kısayollar: t.n('casa', 'ev', 'f', [örnek, çeviri]) */
export function topic(name: string) {
  return {
    n: (es: string, tr: string, g: 'm' | 'f', ex: [string, string], o: Opts = {}) => base(es, tr, 'noun', g, ex, o, name),
    adj: (es: string, tr: string, ex: [string, string], o: Opts = {}) => base(es, tr, 'adjective', null, ex, { feminine: o.feminine ?? (es.endsWith('o') ? `${es.slice(0, -1)}a` : undefined), ...o }, name),
    w: (es: string, tr: string, pos: PartOfSpeech, ex: [string, string], o: Opts = {}) => base(es, tr, pos, null, ex, o, name)
  };
}

/** Artikelle birlikte gösterim: "la casa", "el agua" */
export const withArticle = (w: Pick<Word, 'es' | 'article'>) => (w.article ? `${w.article} ${w.es}` : w.es);
