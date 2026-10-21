/* İçerik modelleri — src/content/ altındaki veri dosyaları bu tiplere uyar. */

export type Level = 'A1' | 'A2' | 'B1' | 'B2';
export type Gender = 'm' | 'f' | null;
export type PartOfSpeech =
  | 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition'
  | 'conjunction' | 'interjection' | 'number' | 'article' | 'phrase';

export interface Word {
  id: string;
  es: string;
  tr: string;
  ipa: string;
  partOfSpeech: PartOfSpeech;
  gender: Gender;
  /** "el" / "la" / null (isim değilse) */
  article: 'el' | 'la' | null;
  plural?: string;
  /** sıfat ve meslek adlarında dişil biçim (pequeña, médica) */
  feminine?: string;
  exampleEs: string;
  /** örnek cümlede boşluk doldurmada gizlenecek tam biçim (yoksa boşluk kartı üretilmez) */
  blank?: string;
  exampleTr: string;
  synonyms?: string[];
  antonyms?: string[];
  /** ilişkili kelimelerin id'leri */
  related?: string[];
  level: Level;
  /** konu etiketleri, ör. "aile", "yemek" */
  tags: string[];
  unitId?: string;
  emoji?: string;
  latamNote?: string;
}

export type Person = 'yo' | 'tu' | 'el' | 'nosotros' | 'vosotros' | 'ellos';
export type Conjugation = Record<Person, string>;

/** Yeni zamanlar buraya eklenir; hepsi isteğe bağlı. */
export interface Conjugations {
  presente: Conjugation;
  preterito?: Conjugation;
  imperfecto?: Conjugation;
  futuro?: Conjugation;
  condicional?: Conjugation;
  subjuntivo?: Conjugation;
}

export interface Verb extends Word {
  partOfSpeech: 'verb';
  conjugations: Conjugations;
  /** düzenli -ar/-er/-ir mi, düzensiz mi (testler bunu kontrol eder) */
  regular: boolean;
}

export type QuestionType =
  | 'multiple_choice' | 'fill_blank' | 'fix_sentence' | 'word_order'
  | 'translate_tr_es' | 'translate_es_tr' | 'type_word' | 'match';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  /** kabul edilen cevaplar; ilk eleman "doğru cevap" olarak gösterilir */
  answers: string[];
  options?: string[];
  /** word_order için parçalar, match için çiftler */
  parts?: string[];
  pairs?: [string, string][];
  explanation?: string;
  /** soru üretildiyse kaynak kelime / konu */
  wordId?: string;
  topicId?: string;
}

export interface GrammarTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface GrammarTopic {
  id: string;
  level: Level;
  title: string;
  summary: string;
  table?: GrammarTable;
  usage: string[];
  examples: { es: string; tr: string }[];
  notes?: string[];
  /** mini test (2–3 soru) */
  check: Question[];
  /** alıştırmalar (8–12 soru) */
  questions: Question[];
}

export interface Reading {
  id: string;
  level: Level;
  topic: string;
  title: string;
  text: string;
  /** metindeki biçim (küçük harf) → wordId */
  glossary: Record<string, string>;
  questions: Question[];
}

export interface Unit {
  id: string;
  order: number;
  title: string;
  lessonIds: string[];
  wordIds: string[];
  grammarIds: string[];
  readingIds: string[];
  unitTestQuestionIds: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** kural: hangi metrik, hedef kaç (ilerleme göstermek için) */
  metric: string;
  target: number;
}
