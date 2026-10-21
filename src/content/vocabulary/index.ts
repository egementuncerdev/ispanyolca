/* Bütün kelimeler tek listede; sayfalar ve SRS buradan okur. */
import type { Verb, Word } from '@/types/content';
import { FAMILY, GREETINGS, HOME, NUMBERS } from './basics';
import { CITY, FOOD, TIME } from './world';
import { ADJECTIVES, COLORS, JOBS } from './describe';
import { VERBS } from '../verbs/verbs';

export const TOPICS: { id: string; label: string }[] = [
  { id: 'selamlasma', label: 'Selamlaşma' },
  { id: 'sayilar', label: 'Sayılar' },
  { id: 'aile', label: 'Aile' },
  { id: 'ev', label: 'Ev' },
  { id: 'yemek', label: 'Yemek ve içecek' },
  { id: 'sehir', label: 'Şehir' },
  { id: 'rutin', label: 'Günlük rutin' },
  { id: 'zaman', label: 'Zaman' },
  { id: 'renkler', label: 'Renkler' },
  { id: 'meslekler', label: 'Meslekler' },
  { id: 'sifatlar', label: 'Sıfatlar' },
  { id: 'fiiller', label: 'Temel fiiller' }
];
export const TOPIC_LABEL = Object.fromEntries(TOPICS.map((t) => [t.id, t.label]));

/** Öğrenme sırası: konu sırası (fiiller araya serpiştirilir) */
export const WORDS: Word[] = [...GREETINGS, ...NUMBERS, ...FAMILY, ...VERBS.slice(0, 10), ...HOME, ...FOOD, ...VERBS.slice(10, 25), ...CITY, ...TIME, ...COLORS, ...VERBS.slice(25), ...JOBS, ...ADJECTIVES];
export const WORD_BY_ID: Record<string, Word> = Object.fromEntries(WORDS.map((w) => [w.id, w]));
export const isVerb = (w: Word): w is Verb => w.partOfSpeech === 'verb' && 'conjugations' in w;
export { VERBS };
