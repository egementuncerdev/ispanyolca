import { useLiveQuery } from 'dexie-react-hooks';
import { repos } from '@/lib/storage';

/** Kartı olan kelime id'leri (canlı) */
export const useLearnedIds = () => useLiveQuery(() => repos.cards.wordIds(), [], undefined);
