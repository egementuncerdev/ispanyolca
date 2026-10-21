import { describe, expect, it } from 'vitest';
import { bestScores } from './record';

describe('bestScores', () => {
  it('oran olarak en iyiyi tutar, oyun sayısını sayar', () => {
    const m = bestScores([
      { kind: 'game', sourceId: 'eslestir', correct: 4, total: 6 },
      { kind: 'game', sourceId: 'eslestir', correct: 6, total: 6 },
      { kind: 'game', sourceId: 'eslestir', correct: 5, total: 6 },
      { kind: 'quiz', sourceId: 'mixed', correct: 10, total: 10 }
    ]);
    expect(m.get('eslestir')).toEqual({ correct: 6, total: 6, plays: 3 });
    expect(m.has('mixed')).toBe(false);
  });
  it('hız oyununda doğru sayısı esas alınır', () => {
    const m = bestScores([
      { kind: 'game', sourceId: 'hiz', correct: 5, total: 5 },
      { kind: 'game', sourceId: 'hiz', correct: 12, total: 15 }
    ]);
    expect(m.get('hiz')).toEqual({ correct: 12, total: 15, plays: 2 });
  });
});
