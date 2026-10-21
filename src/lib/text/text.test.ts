import { describe, expect, it } from 'vitest';
import { checkAnswer, clean } from './normalize';
import { toIpa } from './ipa';

describe('cevap kontrolü', () => {
  it('büyük harf, boşluk ve noktalama önemsiz', () => {
    expect(checkAnswer('  Hablar ', ['hablar']).ok).toBe(true);
    expect(checkAnswer('¿Cómo estás?', ['cómo estás']).ok).toBe(true);
    expect(clean('  Hola   amigo. ')).toBe('hola amigo');
  });
  it('eksik aksan uyarıyla doğru', () => {
    expect(checkAnswer('esta', ['está'])).toEqual({ ok: true, note: 'accent', expected: 'está' });
    expect(checkAnswer('nino', ['niño'])).toMatchObject({ ok: true, note: 'accent' });
  });
  it('katı modda eksik aksan yanlış', () => {
    expect(checkAnswer('esta', ['está'], { strictAccents: true }).ok).toBe(false);
  });
  it('artikelsiz isim uyarıyla doğru', () => {
    expect(checkAnswer('casa', ['la casa'])).toEqual({ ok: true, note: 'article', expected: 'la casa' });
  });
  it('yanlış cevap ve boş cevap', () => {
    expect(checkAnswer('perro', ['gato']).ok).toBe(false);
    expect(checkAnswer('  ', ['gato']).ok).toBe(false);
  });
  it('alternatif cevaplar', () => {
    expect(checkAnswer('el coche', ['el coche', 'el carro']).ok).toBe(true);
    expect(checkAnswer('el carro', ['el coche', 'el carro']).ok).toBe(true);
  });
});

describe('IPA (İspanya)', () => {
  const cases: [string, string][] = [
    ['casa', 'ˈkasa'], ['hola', 'ˈola'], ['gracias', 'ˈgɾaθjas'], ['cerveza', 'θeɾˈbeθa'], ['perro', 'ˈpero'], ['pero', 'ˈpeɾo'],
    ['niño', 'ˈniɲo'], ['calle', 'ˈkaʝe'], ['jamón', 'xaˈmon'], ['gente', 'ˈxente'], ['guitarra', 'giˈtara'], ['queso', 'ˈkeso'],
    ['ciudad', 'θjuˈdad'], ['bueno', 'ˈbweno'], ['hablar', 'aˈblaɾ'], ['tren', 'tɾen'], ['día', 'ˈdia'], ['país', 'paˈis'],
    ['leche', 'ˈletʃe'], ['rojo', 'ˈroxo'], ['Enrique', 'enˈrike'], ['hoy', 'oj'], ['yo', 'ʝo'], ['familia', 'faˈmilja'],
    ['árbol', 'ˈaɾbol'], ['teléfono', 'teˈlefono'], ['restaurante', 'restawˈɾante'], ['agua', 'ˈagwa'], ['vino', 'ˈbino'],
    ['buenos días', 'ˈbwenos ˈdias'], ['examen', 'ekˈsamen'], ['pingüino', 'pinˈgwino'], ['muy', 'mwi']
  ];
  for (const [w, ipa] of cases) it(w, () => expect(toIpa(w)).toBe(ipa));
});
