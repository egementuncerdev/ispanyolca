import { describe, expect, it } from 'vitest';
import { searchDictionary, norm } from './search';

const first = (q: string) => {
  const h = searchDictionary(q)[0];
  return h?.t === 'word' ? h.word.id : h?.key;
};

describe('sözlük araması', () => {
  it('normalize: aksan, Türkçe harf, noktalama', () => {
    expect(norm('¿Qué tal?')).toBe('que tal');
    expect(norm('Köpek')).toBe('kopek');
    expect(norm('ılık')).toBe('ilik');
  });
  it('İspanyolca tam eşleşme önce', () => {
    expect(first('casa')).toBe('casa');
    expect(first('manana')).toMatch(/^manana-/);
  });
  it('çekimli biçimden fiile', () => {
    const h = searchDictionary('tengo')[0]!;
    expect(h.t === 'word' && h.word.id).toBe('tener');
    expect(h.t === 'word' && h.via).toContain('yo');
    expect(first('vivimos')).toBe('vivir');
  });
  it('Türkçeden', () => {
    expect(first('köpek')).toBe('perro');
    expect(first('kopek')).toBe('perro');
    expect(searchDictionary('ev').some((h) => h.t === 'word' && h.word.id === 'casa')).toBe(true);
  });
  it('dilbilgisi kelimeleri de bulunur', () => {
    expect(first('porque')).toBe('porque');
  });
  it('boş arama boş döner', () => {
    expect(searchDictionary('  ')).toEqual([]);
  });
});
