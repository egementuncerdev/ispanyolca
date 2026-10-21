import { describe, expect, it } from 'vitest';
import { AppDB } from '@/lib/storage/db';
import { createRepos } from '@/lib/storage/dexie';
import { DEFAULT_SETTINGS, type QuizResult } from '@/types/user';
import { UNITS } from '@/content/course/units';
import { WORD_BY_ID } from '@/content/vocabulary';
import { GRAMMAR, GRAMMAR_BY_ID } from '@/content/grammar';
import { READINGS, READING_BY_ID } from '@/content/readings';
import { courseProgress, practiceQuestions, questionById, quizQuestions, saveStep, STEPS, testQuestions, unitProgress } from './progress';

const u = UNITS[0]!;
const r = (kind: string, sourceId: string, correct: number, total = 10): QuizResult => ({ kind, sourceId, correct, total, wrongIds: [], finishedAt: '2026-10-21T10:00:00Z', dayKey: '2026-10-21' });
const allWords = new Set(u.wordIds);

describe('kurs içeriği', () => {
  it('8 ünite; bütün id’ler var', () => {
    expect(UNITS).toHaveLength(8);
    for (const x of UNITS) {
      for (const id of x.wordIds) expect(WORD_BY_ID[id], `${x.id}: ${id}`).toBeDefined();
      for (const id of x.grammarIds) expect(GRAMMAR_BY_ID[id], `${x.id}: ${id}`).toBeDefined();
      for (const id of x.readingIds) expect(READING_BY_ID[id], `${x.id}: ${id}`).toBeDefined();
      for (const id of x.unitTestQuestionIds) expect(questionById(id), `${x.id}: ${id}`).toBeDefined();
      expect(new Set(x.wordIds).size, x.id).toBe(x.wordIds.length);
    }
  });
  it('bütün grammar konuları ve okumalar kursta bir kez geçiyor', () => {
    const g = UNITS.flatMap((x) => x.grammarIds);
    expect(new Set(g).size).toBe(g.length);
    expect(new Set(g)).toEqual(new Set(GRAMMAR.map((t) => t.id)));
    const rs = UNITS.flatMap((x) => x.readingIds);
    expect(new Set(rs)).toEqual(new Set(READINGS.map((x) => x.id)));
  });
  it('soru üreticileri dolu set veriyor', () => {
    for (const x of UNITS) {
      expect(practiceQuestions(x).length, x.id).toBeGreaterThanOrEqual(10);
      expect(quizQuestions(x).length, x.id).toBe(10);
      expect(testQuestions(x).length, x.id).toBe(x.unitTestQuestionIds.length + 4);
    }
  });
});

describe('ilerleme', () => {
  it('adımlar sırayla açılır', () => {
    const p0 = unitProgress(u, [], new Set());
    expect(p0.steps.ders.open).toBe(true);
    expect(p0.steps.kelimeler.open).toBe(false);
    expect(p0.percent).toBe(0);
    expect(p0.next).toBe('ders');

    const p1 = unitProgress(u, [r('course', 'u1/ders', 1, 1)], new Set(['hola']));
    expect(p1.steps.kelimeler.open).toBe(true);
    expect(p1.steps.kelimeler.done).toBe(false);
    expect(p1.steps.kelimeler.count).toEqual([1, u.wordIds.length]);
    expect(p1.steps.alistirma.open).toBe(false);
  });

  it('%70 altı adımı tamamlamaz; okuma okuma sonuçlarından gelir', () => {
    const base = [r('course', 'u1/ders', 1, 1), r('course', 'u1/alistirma', 6)];
    const p = unitProgress(u, base, allWords);
    expect(p.steps.alistirma.done).toBe(false);
    expect(p.steps.alistirma.best).toBe(0.6);
    expect(p.steps.quiz.open).toBe(false);

    const all = [...base, r('course', 'u1/alistirma', 8), r('course', 'u1/quiz', 9), ...u.readingIds.map((id) => r('reading', id, 4, 5)), r('course', 'u1/test', 7)];
    const done = unitProgress(u, all, allWords);
    expect(done.completed).toBe(true);
    expect(done.percent).toBe(100);
    expect(done.next).toBeNull();
    expect(STEPS.every((s) => done.steps[s.id].done)).toBe(true);
  });

  it('sonraki ünite öncekinin testiyle açılır', () => {
    expect(courseProgress(UNITS, [], new Set()).map((x) => x.unlocked).slice(0, 2)).toEqual([true, false]);
  });

  it('test ilk kez geçilince tek bir unit_done olayı', async () => {
    const repos = createRepos(new AppDB(`course-${Math.random()}`));
    expect((await saveStep(repos, DEFAULT_SETTINGS, u, 'test', 5, 10)).passed).toBe(false);
    expect((await saveStep(repos, DEFAULT_SETTINGS, u, 'test', 9, 10)).firstPass).toBe(true);
    expect((await saveStep(repos, DEFAULT_SETTINGS, u, 'test', 10, 10)).firstPass).toBe(false);
    const ev = await repos.events.all();
    expect(ev.filter((e) => e.type === 'unit_done')).toHaveLength(1);
    expect(ev.filter((e) => e.type === 'course_step')).toHaveLength(3);
  });
});
