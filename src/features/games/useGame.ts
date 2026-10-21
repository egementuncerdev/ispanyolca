/* Oyun kurulumu: havuzdan rastgele kelime seç, kaydet, yeniden başlat */
import { useCallback, useEffect, useState } from 'react';
import type { Word } from '@/types/content';
import { practicePool } from '@/lib/games/pool';
import { useLearnedIds } from '@/lib/games/useLearned';
import { shuffle } from '@/lib/quiz/check';
import { saveResult } from '@/lib/games/record';
import { repos } from '@/lib/storage';
import { useSettings } from '@/app/settings';

export function useGame(gameId: string, n: number, filter?: (w: Word) => boolean) {
  const learned = useLearnedIds();
  const { settings } = useSettings();
  const [words, setWords] = useState<Word[] | null>(null);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!learned) return;
    setWords(shuffle(practicePool(learned, Math.max(n, 16), filter)).slice(0, n));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learned === undefined, round]);

  const restart = useCallback(() => setRound((r) => r + 1), []);
  const save = useCallback((correct: number, total: number) => saveResult(repos, settings, 'game', gameId, correct, total), [settings, gameId]);
  return { words, restart, save, round };
}
