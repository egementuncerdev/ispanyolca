/* Sözlük araması: İspanyolca (çekimli biçimler dahil) ya da Türkçe. Aksan ve Türkçe harfler
   önemsiz (kopek → köpek, manana → mañana). Sonuç puanla sıralanır. */
import type { Word } from '@/types/content';
import { WORDS, WORD_BY_ID } from '@/content/vocabulary';
import { EXTRA, type ExtraEntry } from '@/content/readings/extra';
import { FORMS } from '@/lib/reading/lexicon';
import { stripAccents } from '@/lib/text/normalize';

export const norm = (s: string) => stripAccents(s.toLowerCase()).replace(/ı/g, 'i').replace(/[¿?¡!.,]/g, '').replace(/\s+/g, ' ').trim();

export type DictHit =
  | { t: 'word'; word: Word; score: number; via?: string }
  | { t: 'extra'; key: string; entry: ExtraEntry; score: number };

/** normalize biçim → { kelime, not } (tengo → tener · yo) */
const FORM_INDEX = new Map<string, { wordId: string; form: string; note?: string }[]>();
for (const [form, hits] of FORMS) {
  const k = norm(form);
  FORM_INDEX.set(k, [...(FORM_INDEX.get(k) ?? []), ...hits.map((h) => ({ ...h, form }))]);
}

const parts = (tr: string) => tr.split(/[,;()]/).map((p) => norm(p)).filter(Boolean);
const PREP = WORDS.map((w, order) => ({ w, order, es: norm(w.es), alt: [w.feminine, w.plural].filter(Boolean).map((x) => norm(x!)), tr: norm(w.tr), trParts: parts(w.tr) }));
const EXTRA_PREP = Object.entries(EXTRA).map(([key, entry]) => ({ key, entry, k: norm(key), trParts: parts(entry.tr) }));

export function searchDictionary(q: string, limit = 60): DictHit[] {
  const n = norm(q);
  if (!n) return [];
  const out: (DictHit & { order: number })[] = [];
  const formHits = new Map((FORM_INDEX.get(n) ?? []).map((h) => [h.wordId, h]));
  for (const p of PREP) {
    let score = 0;
    let via: string | undefined;
    if (p.es === n) score = 100;
    else if (formHits.has(p.w.id)) { score = 92; const h = formHits.get(p.w.id)!; via = `${h.form}${h.note ? ` · ${h.note}` : ''}`; }
    else if (p.trParts.includes(n)) score = 88;
    else if (p.es.startsWith(n)) score = 80;
    else if (p.alt.some((a) => a.startsWith(n))) score = 70;
    else if (p.trParts.some((t) => t.startsWith(n) || t.split(' ').some((x) => x.startsWith(n)))) score = 62;
    else if (n.length >= 3 && p.es.includes(n)) score = 45;
    else if (n.length >= 3 && p.tr.includes(n)) score = 40;
    if (score) out.push({ t: 'word', word: p.w, score, via, order: p.order });
  }
  for (const [i, e] of EXTRA_PREP.entries()) {
    let score = 0;
    if (e.k === n) score = 60;
    else if (e.trParts.includes(n)) score = 35;
    else if (n.length >= 2 && e.k.startsWith(n)) score = 30;
    if (score) out.push({ t: 'extra', key: e.key, entry: e.entry, score, order: 10_000 + i });
  }
  return out.sort((a, b) => b.score - a.score || a.order - b.order).slice(0, limit).map(({ order: _o, ...h }) => h as DictHit);
}

/** Arama yokken: bütün kelimeler alfabetik */
export const ALPHABETICAL: Word[] = [...WORDS].sort((a, b) => a.es.localeCompare(b.es, 'es'));
export const wordById = (id: string) => WORD_BY_ID[id];
