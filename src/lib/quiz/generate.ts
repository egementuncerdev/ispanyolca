/* Quiz motoru: kelime verisinden ve grammar sorularından soru üretir.
   Dışarıdan üretilmiş (ör. ileride AI) Question[] de doğrudan QuestionRunner'a verilebilir. */
import type { GrammarTopic, Question, Word } from '@/types/content';
import { withArticle } from '@/content/vocabulary/helpers';
import { distractors, typedAnswers } from '@/lib/srs/prompt';
import { shuffle } from './check';

export type QuizCategory = 'mixed' | 'vocab' | 'grammar' | 'spelling' | 'tr_es' | 'es_tr' | 'fill';

export const CATEGORIES: { id: QuizCategory; label: string; desc: string }[] = [
  { id: 'mixed', label: 'Karışık', desc: 'Her türden biraz' },
  { id: 'vocab', label: 'Kelime', desc: 'Anlamı seç' },
  { id: 'grammar', label: 'Grammar', desc: 'Konu alıştırmalarından' },
  { id: 'spelling', label: 'Yazım', desc: 'Türkçesi verilen kelimeyi yaz' },
  { id: 'tr_es', label: 'TR → ES çeviri', desc: 'Cümle kur ya da çevir' },
  { id: 'es_tr', label: 'ES → TR çeviri', desc: 'Cümlenin Türkçesini seç' },
  { id: 'fill', label: 'Boşluk doldurma', desc: 'Örnek cümledeki eksik kelime' }
];

interface Ctx { pool: Word[]; all: Word[]; grammar: GrammarTopic[]; rnd: () => number }

const blankOut = (w: Word) => {
  const i = w.exampleEs.toLowerCase().indexOf(w.blank!.toLowerCase());
  return `${w.exampleEs.slice(0, i)}___${w.exampleEs.slice(i + w.blank!.length)}`;
};
const orderable = (w: Word) => !w.exampleEs.includes('—') && w.exampleEs.split(' ').length >= 3 && w.exampleEs.split(' ').length <= 8;

const make = {
  vocab(w: Word, c: Ctx): Question {
    if (c.rnd() < 0.5) {
      return { id: `q-vocab-${w.id}`, type: 'multiple_choice', prompt: withArticle(w), hint: 'Türkçesi hangisi?', answers: [w.tr], options: [w.tr, ...distractors(w, c.all, c.rnd)], wordId: w.id };
    }
    const others = shuffle(c.all.filter((x) => x.id !== w.id && x.partOfSpeech === w.partOfSpeech && x.tr !== w.tr), c.rnd);
    const opts = [withArticle(w)];
    for (const o of others) { const f = withArticle(o); if (!opts.includes(f)) opts.push(f); if (opts.length === 4) break; }
    return { id: `q-vocab2-${w.id}`, type: 'multiple_choice', prompt: w.tr, hint: 'İspanyolcası hangisi?', answers: [withArticle(w)], options: opts, wordId: w.id };
  },
  spelling(w: Word): Question {
    return { id: `q-spell-${w.id}`, type: 'type_word', prompt: w.tr, hint: w.article ? 'İsim · artikeliyle yazabilirsin' : undefined, answers: typedAnswers(w), wordId: w.id };
  },
  fill(w: Word): Question | null {
    if (!w.blank) return null;
    return { id: `q-fill-${w.id}`, type: 'fill_blank', prompt: blankOut(w), hint: `${w.exampleTr} (${w.tr})`, answers: [w.blank], wordId: w.id };
  },
  order(w: Word): Question | null {
    if (!orderable(w)) return null;
    return { id: `q-order-${w.id}`, type: 'word_order', prompt: 'Kelimeleri doğru sıraya koy.', hint: w.exampleTr, answers: [w.exampleEs], parts: w.exampleEs.split(' '), wordId: w.id };
  },
  esTr(w: Word, c: Ctx): Question | null {
    if (w.exampleEs.includes('—')) return null;
    const others = shuffle(c.all.filter((x) => x.id !== w.id && !x.exampleEs.includes('—')), c.rnd);
    const same = others.filter((x) => x.tags.some((t) => w.tags.includes(t)));
    const opts = [w.exampleTr];
    for (const o of [...same, ...others]) { if (!opts.includes(o.exampleTr)) opts.push(o.exampleTr); if (opts.length === 4) break; }
    return { id: `q-estr-${w.id}`, type: 'translate_es_tr', prompt: w.exampleEs, answers: [w.exampleTr], options: opts, wordId: w.id };
  }
};

const grammarOf = (c: Ctx, types?: Question['type'][]) => c.grammar.flatMap((t) => t.questions).filter((q) => !types || types.includes(q.type));

function fromWords(c: Ctx, n: number, fn: (w: Word) => Question | null): Question[] {
  const out: Question[] = [];
  for (const w of shuffle(c.pool, c.rnd)) { const q = fn(w); if (q) out.push(q); if (out.length >= n) break; }
  return out;
}

export function generateQuiz(cat: QuizCategory, count: number, ctx: Omit<Ctx, 'rnd'> & { rnd?: () => number }): Question[] {
  const c: Ctx = { ...ctx, rnd: ctx.rnd ?? Math.random };
  switch (cat) {
    case 'vocab': return fromWords(c, count, (w) => make.vocab(w, c));
    case 'spelling': return fromWords(c, count, make.spelling);
    case 'fill': return fromWords(c, count, make.fill);
    case 'es_tr': {
      const half = Math.ceil(count / 2);
      return shuffle([...fromWords(c, half, (w) => make.esTr(w, c)), ...shuffle(grammarOf(c, ['translate_es_tr']), c.rnd).slice(0, count - half)], c.rnd);
    }
    case 'tr_es': {
      const half = Math.ceil(count / 2);
      return shuffle([...fromWords(c, half, make.order), ...shuffle(grammarOf(c, ['translate_tr_es']), c.rnd).slice(0, count - half)], c.rnd);
    }
    case 'grammar': return shuffle(grammarOf(c), c.rnd).slice(0, count);
    case 'mixed': {
      const parts: QuizCategory[] = ['vocab', 'spelling', 'fill', 'grammar', 'es_tr', 'tr_es'];
      const per = Math.ceil(count / parts.length);
      return shuffle(parts.flatMap((p) => generateQuiz(p, per, c)), c.rnd).slice(0, count);
    }
  }
}
