/* Kurs ekranlarının canlı verisi: kurs ve okuma sonuçları + kartı olan kelimeler */
import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { repos } from '@/lib/storage';
import { UNITS } from '@/content/course/units';
import { courseProgress } from '@/lib/course/progress';

export function useCourse() {
  const course = useLiveQuery(() => repos.quizResults.byKind('course'), []);
  const reading = useLiveQuery(() => repos.quizResults.byKind('reading'), []);
  const known = useLiveQuery(() => repos.cards.wordIds(), []);
  return useMemo(() => {
    if (!course || !reading || !known) return null;
    return { known, units: courseProgress(UNITS, [...course, ...reading], known) };
  }, [course, reading, known]);
}
