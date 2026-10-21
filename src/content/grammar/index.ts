/* A1 grammar konuları — öğrenme sırasıyla. Yeni konu: dosya ekle, buraya yaz. */
import type { GrammarTopic } from '@/types/content';
import { pronombres } from './pronombres';
import { ser } from './ser';
import { estar } from './estar';
import { serEstar } from './ser-estar';
import { tener } from './tener';
import { articulos } from './articulos';
import { genero } from './genero';
import { plural } from './plural';
import { adjetivos } from './adjetivos';
import { verbosAr } from './verbos-ar';
import { verbosEr } from './verbos-er';
import { verbosIr } from './verbos-ir';
import { negacion } from './negacion';
import { preguntas } from './preguntas';
import { hayEstar } from './hay-estar';
import { preposiciones } from './preposiciones';
import { posesivos } from './posesivos';
import { numeros } from './numeros';
import { hora } from './hora';
import { fechas } from './fechas';
import { reflexivos } from './reflexivos';
import { gustar } from './gustar';
import { irA } from './ir-a';

export const GRAMMAR: GrammarTopic[] = [
  pronombres, ser, estar, serEstar, tener, articulos, genero, plural, adjetivos,
  verbosAr, verbosEr, verbosIr, negacion, preguntas, hayEstar, preposiciones, posesivos,
  numeros, hora, fechas, reflexivos, gustar, irA
];
export const GRAMMAR_BY_ID: Record<string, GrammarTopic> = Object.fromEntries(GRAMMAR.map((g) => [g.id, g]));
