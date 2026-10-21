import { useParams } from 'react-router';
import { EmptyState } from '@/components/EmptyState';
import { ButtonLink } from '@/components/Button';
import WordMatch from './WordMatch';
import Memory from './Memory';
import Scramble from './Scramble';
import Hangman from './Hangman';
import SpeedQuiz from './SpeedQuiz';
import { FillGapGame, TranslateGame } from './RunnerGame';

const MAP: Record<string, () => React.JSX.Element | null> = {
  eslestir: WordMatch, hafiza: Memory, karisik: Scramble, 'adam-asmaca': Hangman, hiz: SpeedQuiz, ceviri: TranslateGame, bosluk: FillGapGame
};

export default function GameRoute() {
  const { id = '' } = useParams();
  const G = MAP[id];
  if (!G) return <EmptyState title="Oyun bulunamadı" action={<ButtonLink to="/oyunlar" variant="secondary">Oyunlara dön</ButtonLink>} />;
  return <G key={id} />;
}
