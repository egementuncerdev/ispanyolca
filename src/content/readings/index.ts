/* Bütün okumalar: önce metinler, sonra mini hikâyeler */
import type { Reading } from '@/types/content';
import { TEXTS } from './texts';
import { STORIES } from './stories';

export const READINGS: Reading[] = [...TEXTS, ...STORIES];
export const READING_BY_ID: Record<string, Reading> = Object.fromEntries(READINGS.map((r) => [r.id, r]));
export const KIND_LABEL: Record<Reading['kind'], string> = { text: 'Metin', story: 'Hikâye' };
