/* Kurs ilerlemesi. Hiçbir şey ayrıca saklanmaz: adımlar sonuç kayıtlarından (quizResults)
   ve kartlardan türetilir. Adımlar sırayla açılır; ünite testi %70 ile ünite tamamlanır. */
import type { GrammarTopic, Question, Reading, Unit, Word } from '@/types/content';
import type { QuizResult, Settings } from '@/types/user';
import type { Repos } from '@/lib/storage';
import { WORD_BY_ID, WORDS } from '@/content/vocabulary';
import { GRAMMAR_BY_ID } from '@/content/grammar';
import { READING_BY_ID } from '@/content/readings';
import { generateQuiz } from '@/lib/quiz/generate';
import { shuffle } from '@/lib/quiz/check';
import { dayKey } from '@/lib/time/dayKey';

export const PASS = 0.7;

export const STEPS = [
  { id: 'ders', label: 'Ders' },
  { id: 'kelimeler', label: 'Kelimeler' },
  { id: 'alistirma', label: 'Alıştırma' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'okuma', label: 'Okuma' },
  { id: 'test', label: 'Ünite testi' }
] as const;
export type StepId = (typeof STEPS)[number]['id'];

export interface StepState { done: boolean; open: boolean; best?: number; count?: [number, number] }
export interface UnitProgress { steps: Record<StepId, StepState>; doneCount: number; percent: number; completed: boolean; next: StepId | null }

export const unitWords = (u: Unit): Word[] => u.wordIds.map((id) => WORD_BY_ID[id]).filter(Boolean) as Word[];
export const unitTopics = (u: Unit): GrammarTopic[] => u.grammarIds.map((id) => GRAMMAR_BY_ID[id]).filter(Boolean) as GrammarTopic[];
export const unitReadings = (u: Unit): Reading[] => u.readingIds.map((id) => READING_BY_ID[id]).filter(Boolean) as Reading[];
export const stepSource = (u: Unit, step: StepId) => `${u.id}/${step}`;

function best(results: QuizResult[], kind: string, sourceId: string): number | undefined {
  let b: number | undefined;
  for (const r of results) if (r.kind === kind && r.sourceId === sourceId && r.total) b = Math.max(b ?? 0, r.correct / r.total);
  return b;
}

/** results: 'course' ve 'reading' sonuçları; known: kartı olan kelime id'leri */
export function unitProgress(u: Unit, results: QuizResult[], known: Set<string>): UnitProgress {
  const words = u.wordIds.filter((id) => known.has(id)).length;
  const readings = u.readingIds.map((id) => best(results, 'reading', id));
  const scored = (s: StepId) => best(results, 'course', stepSource(u, s));
  const raw: Record<StepId, Omit<StepState, 'open'>> = {
    ders: { done: scored('ders') !== undefined },
    kelimeler: { done: words === u.wordIds.length, count: [words, u.wordIds.length] },
    alistirma: { done: (scored('alistirma') ?? 0) >= PASS, best: scored('alistirma') },
    quiz: { done: (scored('quiz') ?? 0) >= PASS, best: scored('quiz') },
    okuma: { done: readings.every((b) => (b ?? 0) >= PASS), count: [readings.filter((b) => (b ?? 0) >= PASS).length, readings.length] },
    test: { done: (scored('test') ?? 0) >= PASS, best: scored('test') }
  };
  const steps = {} as Record<StepId, StepState>;
  let open = true;
  for (const { id } of STEPS) { steps[id] = { ...raw[id], open }; open = open && raw[id].done; }
  const doneCount = STEPS.filter((s) => steps[s.id].done).length;
  const completed = steps.test.done;
  return { steps, doneCount, percent: completed ? 100 : Math.round((doneCount / STEPS.length) * 100), completed, next: STEPS.find((s) => !steps[s.id].done)?.id ?? null };
}

/** Ünite açık mı: ilk ünite hep açık, sonrakiler bir öncekinin testiyle açılır */
export function courseProgress(units: Unit[], results: QuizResult[], known: Set<string>) {
  const list = units.map((u) => ({ unit: u, progress: unitProgress(u, results, known) }));
  return list.map((x, i) => ({ ...x, unlocked: i === 0 || list[i - 1]!.progress.completed }));
}

const pick = <T,>(xs: T[], n: number, rnd: () => number) => shuffle(xs, rnd).slice(0, n);

/** Alıştırma: konuların alıştırmalarından eşit pay, toplam ~12 */
export function practiceQuestions(u: Unit, rnd = Math.random, total = 12): Question[] {
  const topics = unitTopics(u);
  const per = Math.ceil(total / Math.max(1, topics.length));
  return shuffle(topics.flatMap((t) => pick(t.questions, per, rnd)), rnd).slice(0, total);
}

/** Quiz: ünitenin kelimelerinden anlam, yazım ve boşluk soruları */
export function quizQuestions(u: Unit, rnd = Math.random): Question[] {
  const ctx = { pool: unitWords(u), all: WORDS, grammar: [], rnd };
  return shuffle([...generateQuiz('vocab', 4, ctx), ...generateQuiz('spelling', 3, ctx), ...generateQuiz('fill', 3, ctx)], rnd);
}

const QUESTION_BY_ID = (() => {
  const m = new Map<string, Question>();
  for (const t of Object.values(GRAMMAR_BY_ID)) for (const q of [...t.check, ...t.questions]) m.set(q.id, q);
  for (const r of Object.values(READING_BY_ID)) for (const q of r.questions) m.set(q.id, q);
  return m;
})();
export const questionById = (id: string) => QUESTION_BY_ID.get(id);

/** Ünite testi: hazır sorular + 4 kelime sorusu */
export function testQuestions(u: Unit, rnd = Math.random): Question[] {
  const fixed = u.unitTestQuestionIds.map(questionById).filter(Boolean) as Question[];
  const words = generateQuiz('vocab', 4, { pool: unitWords(u), all: WORDS, grammar: [], rnd });
  return shuffle([...fixed, ...words], rnd);
}

/** Adım sonucunu kaydet. Test ilk kez geçilince "unit_done" olayı (XP Faz 7'de bundan hesaplanır). */
export async function saveStep(repos: Repos, s: Settings, u: Unit, step: StepId, correct: number, total: number, wrongIds: string[] = [], now = new Date()) {
  const dk = dayKey(now, s.timezone, s.dayStartsAt);
  const sourceId = stepSource(u, step);
  const before = await repos.quizResults.byKind('course');
  const wasDone = (best(before, 'course', sourceId) ?? 0) >= PASS;
  await repos.quizResults.add({ kind: 'course', sourceId, correct, total, wrongIds, finishedAt: now.toISOString(), dayKey: dk });
  await repos.events.add({ type: 'course_step', refId: sourceId, value: Math.round((correct / Math.max(1, total)) * 100), at: now.toISOString(), dayKey: dk });
  const passed = correct / Math.max(1, total) >= PASS;
  if (step === 'test' && passed && !wasDone) await repos.events.add({ type: 'unit_done', refId: u.id, at: now.toISOString(), dayKey: dk });
  return { passed, firstPass: passed && !wasDone };
}
