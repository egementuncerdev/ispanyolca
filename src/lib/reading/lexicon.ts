/* Metindeki biçimleri kelimelere bağlar. Her kelimeden bütün biçimler üretilir
   (çoğul, dişil, presente çekimleri, mastar); çok kelimeli kalıplar (fin de semana) önce eşleşir.
   Aynı biçim birden çok kelimeye denk gelirse metnin glossary'si hangisi olduğunu söyler. */
import type { Reading, Word } from '@/types/content';
import { WORDS, WORD_BY_ID, isVerb } from '@/content/vocabulary';
import { pluralize } from '@/content/vocabulary/helpers';
import { PERSONS } from '@/content/verbs/conjugate';
import { EXTRA, type ExtraEntry } from '@/content/readings/extra';

const PERSON_TR: Record<string, string> = { yo: 'yo', tu: 'tú', el: 'él/ella', nosotros: 'nosotros', vosotros: 'vosotros', ellos: 'ellos/ellas' };
const low = (s: string) => s.toLocaleLowerCase('es');
const bare = (s: string) => low(s).replace(/[¿?¡!.,]/g, '').trim();

export interface FormHit { wordId: string; note?: string }

/** biçim → olası kelimeler (not: "tener · yo") */
function buildForms(words: Word[]): Map<string, FormHit[]> {
  const m = new Map<string, FormHit[]>();
  const add = (form: string, hit: FormHit) => {
    const f = bare(form);
    const list = m.get(f) ?? [];
    if (!list.some((h) => h.wordId === hit.wordId)) list.push(hit);
    m.set(f, list);
  };
  for (const w of words) {
    add(w.es, { wordId: w.id });
    if (w.plural) add(w.plural, { wordId: w.id, note: 'çoğul' });
    if (w.feminine) {
      add(w.feminine, { wordId: w.id, note: 'dişil' });
      if (w.partOfSpeech === 'adjective') add(pluralize(w.feminine), { wordId: w.id, note: 'dişil çoğul' });
    }
    if (isVerb(w)) {
      for (const p of PERSONS) {
        const form = w.conjugations.presente[p].split(' ').pop()!;
        add(form, { wordId: w.id, note: `${w.es} · ${PERSON_TR[p]}` });
      }
      if (w.es.endsWith('se')) add(w.es.slice(0, -2), { wordId: w.id, note: 'mastar' });
    }
  }
  return m;
}

export const FORMS = buildForms(WORDS);
const MAX_PHRASE = Math.max(...[...FORMS.keys()].map((k) => k.split(' ').length));

export type Token =
  | { t: 'space'; text: string }
  | { t: 'word'; text: string; word: Word; note?: string }
  | { t: 'extra'; text: string; key: string; entry: ExtraEntry }
  | { t: 'name'; text: string }
  | { t: 'unknown'; text: string; ambiguous?: string[] };

type Resolved = Token extends infer T ? (T extends Token ? Omit<T, 'text'> : never) : never;

const WORD_RE = /[\p{L}]+/gu;

/** Tek biçimi çöz (glossary → kelime biçimleri → ek sözlük) */
export function resolve(form: string, reading?: Pick<Reading, 'glossary' | 'names'>, original = form): Resolved {
  if (reading?.names?.includes(original)) return { t: 'name' };
  const f = low(form);
  const g = reading?.glossary?.[f];
  if (g) {
    if (g.startsWith('x:')) { const entry = EXTRA[g.slice(2)]; if (entry) return { t: 'extra', key: g.slice(2), entry }; }
    const w = WORD_BY_ID[g];
    if (w) return { t: 'word', word: w, note: FORMS.get(f)?.find((h) => h.wordId === g)?.note };
    return { t: 'unknown' };
  }
  const hits = FORMS.get(f) ?? [];
  const extra = EXTRA[f];
  if (hits.length + (extra ? 1 : 0) > 1) return { t: 'unknown', ambiguous: [...hits.map((h) => h.wordId), ...(extra ? [`x:${f}`] : [])] };
  if (hits.length === 1) return { t: 'word', word: WORD_BY_ID[hits[0]!.wordId]!, note: hits[0]!.note };
  if (extra) return { t: 'extra', key: f, entry: extra };
  return { t: 'unknown' };
}

/** Paragrafı tıklanabilir parçalara ayır; boşluk ve noktalama "space" olarak kalır */
export function tokenize(text: string, reading?: Pick<Reading, 'glossary' | 'names'>): Token[] {
  const words = [...text.matchAll(WORD_RE)].map((m) => ({ s: m[0], i: m.index! }));
  const out: Token[] = [];
  let pos = 0;
  for (let k = 0; k < words.length;) {
    // en uzun kalıp: aradaki ayraç yalnız boşluk olmalı
    let len = 1;
    for (let n = Math.min(MAX_PHRASE, words.length - k); n > 1; n--) {
      const slice = words.slice(k, k + n);
      const joined = text.slice(slice[0]!.i, slice[n - 1]!.i + slice[n - 1]!.s.length);
      if (!/^[\p{L} ]+$/u.test(joined)) continue;
      const hits = FORMS.get(bare(joined));
      if (hits?.length === 1) { len = n; break; }
    }
    const first = words[k]!, last = words[k + len - 1]!;
    if (first.i > pos) out.push({ t: 'space', text: text.slice(pos, first.i) });
    const surface = text.slice(first.i, last.i + last.s.length);
    out.push({ text: surface, ...resolve(len > 1 ? bare(surface) : surface, reading, surface) } as Token);
    pos = last.i + last.s.length;
    k += len;
  }
  if (pos < text.length) out.push({ t: 'space', text: text.slice(pos) });
  return out;
}

/** Metindeki kart kelimeleri (ilk geçiş sırasıyla, tekrarsız) */
export function readingWords(r: Reading): Word[] {
  const seen = new Map<string, Word>();
  for (const p of r.paragraphs) for (const tk of tokenize(p.es, r)) if (tk.t === 'word' && !seen.has(tk.word.id)) seen.set(tk.word.id, tk.word);
  return [...seen.values()];
}

export const wordCount = (r: Reading) => r.paragraphs.reduce((n, p) => n + (p.es.match(WORD_RE)?.length ?? 0), 0);
