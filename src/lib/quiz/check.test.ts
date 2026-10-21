import { describe, expect, it } from 'vitest';
import { checkQuestion, shuffleParts } from './check';
import { questions } from '@/content/grammar/helpers';

const q = questions('t');

describe('soru kontrolü', () => {
  it('çoktan seçmeli birebir', () => {
    const m = q.mc('Yo ___ estudiante.', 'soy', ['eres']);
    expect(checkQuestion(m, 'soy').ok).toBe(true);
    expect(checkQuestion(m, 'eres').ok).toBe(false);
  });
  it('boşluk doldurmada aksan uyarısı, katı soruda yanlış', () => {
    expect(checkQuestion(q.fill('¿___ vives?', ['Dónde']), 'donde')).toMatchObject({ ok: true, note: 'accent' });
    expect(checkQuestion(q.fix('Donde está?', ['¿Dónde está?'], '', true), 'Donde está').ok).toBe(false);
  });
  it('kelime sıralama: parçaların birleşimi', () => {
    const o = q.order('Yo soy estudiante.');
    expect(o.parts).toEqual(['Yo', 'soy', 'estudiante.']);
    expect(checkQuestion(o, ['Yo', 'soy', 'estudiante.']).ok).toBe(true);
    expect(checkQuestion(o, ['soy', 'Yo', 'estudiante.']).ok).toBe(false);
    expect(shuffleParts(o.parts!).join(' ')).not.toBe('Yo soy estudiante.');
  });
  it('çeviride alternatif cevaplar, noktalama önemsiz', () => {
    const t = q.trEs('Ben Türküm.', ['Soy turco', 'Soy turca']);
    expect(checkQuestion(t, 'soy turca.').ok).toBe(true);
  });
});
