/* Presente çekim üretici. Düzenli -ar/-er/-ir, kök değişimi (e→ie, o→ue, u→ue, e→i),
   "yo" düzensizliği ve tamamen düzensiz tablolar. Dönüşlü fiillerde zamir eklenir. */
import type { Conjugation, Person } from '@/types/content';

export const PERSONS: Person[] = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
export const PERSON_LABEL: Record<Person, string> = { yo: 'yo', tu: 'tú', el: 'él / ella / usted', nosotros: 'nosotros/as', vosotros: 'vosotros/as', ellos: 'ellos / ellas / ustedes' };

const ENDINGS: Record<'ar' | 'er' | 'ir', string[]> = {
  ar: ['o', 'as', 'a', 'amos', 'áis', 'an'],
  er: ['o', 'es', 'e', 'emos', 'éis', 'en'],
  ir: ['o', 'es', 'e', 'imos', 'ís', 'en']
};
const REFLEXIVE = ['me', 'te', 'se', 'nos', 'os', 'se'];

export type StemChange = 'e>ie' | 'o>ue' | 'u>ue' | 'e>i';

export interface ConjSpec {
  /** kök değişimi: yo, tú, él, ellos biçimlerinde */
  stem?: StemChange;
  /** düzensiz "yo" biçimi (hago, conozco) */
  yo?: string;
  /** tamamen düzensiz: 6 biçim */
  full?: [string, string, string, string, string, string];
}

const fromArray = (a: string[]): Conjugation => Object.fromEntries(PERSONS.map((p, i) => [p, a[i]!])) as Conjugation;

function changeStem(stem: string, change: StemChange): string {
  const [from, to] = change.split('>') as [string, string];
  const i = stem.lastIndexOf(from);
  return i < 0 ? stem : stem.slice(0, i) + to + stem.slice(i + 1);
}

export function conjugate(infinitive: string, spec: ConjSpec = {}): Conjugation {
  const reflexive = infinitive.endsWith('se');
  const inf = reflexive ? infinitive.slice(0, -2) : infinitive;
  let forms: string[];
  if (spec.full) forms = [...spec.full];
  else {
    const type = inf.slice(-2) as 'ar' | 'er' | 'ir';
    const stem = inf.slice(0, -2);
    const boot = spec.stem ? changeStem(stem, spec.stem) : stem;
    forms = ENDINGS[type].map((e, i) => (i === 3 || i === 4 ? stem : boot) + e);
    if (spec.yo) forms[0] = spec.yo;
  }
  if (reflexive) forms = forms.map((f, i) => `${REFLEXIVE[i]} ${f}`);
  return fromArray(forms);
}

export const isRegularSpec = (spec: ConjSpec) => !spec.full && !spec.stem && !spec.yo;
