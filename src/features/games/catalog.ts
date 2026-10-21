import { Grid3x3, Layers, Puzzle, Shuffle, SpellCheck, Timer, Languages, type LucideIcon } from 'lucide-react';

export interface GameInfo { id: string; title: string; desc: string; icon: LucideIcon }

export const GAMES: GameInfo[] = [
  { id: 'eslestir', title: 'Word Match', desc: 'İspanyolca kelimeyi Türkçesiyle eşleştir.', icon: Puzzle },
  { id: 'hafiza', title: 'Memory', desc: 'Kartları aç, kelimeyle anlamını bul.', icon: Grid3x3 },
  { id: 'karisik', title: 'Word Scramble', desc: 'Harfleri karışık kelimeyi bul.', icon: Shuffle },
  { id: 'adam-asmaca', title: 'Hangman', desc: 'Türkçesine bakarak kelimeyi harf harf tahmin et.', icon: SpellCheck },
  { id: 'hiz', title: 'Speed Quiz', desc: '60 saniyede olabildiğince çok doğru.', icon: Timer },
  { id: 'ceviri', title: 'Translation Challenge', desc: 'Kısa Türkçe cümleleri İspanyolcaya çevir.', icon: Languages },
  { id: 'bosluk', title: 'Fill the Gap', desc: 'Cümledeki eksik kelimeyi yaz.', icon: Layers }
];
export const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g]));
