import { describe, expect, it } from 'vitest';
import { TOPICS, WORDS, WORD_BY_ID, VERBS } from '../vocabulary';
import { pluralize } from '../vocabulary/helpers';
import { conjugate, PERSONS } from '../verbs/conjugate';

describe('kelime içeriği', () => {
  it('en az 300 kelime ve id’ler benzersiz', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(300);
    const ids = WORDS.map((w) => w.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it('her kelimede zorunlu alanlar dolu', () => {
    for (const w of WORDS) {
      expect(w.es, w.id).toBeTruthy();
      expect(w.tr, w.id).toBeTruthy();
      expect(w.ipa, w.id).toBeTruthy();
      expect(w.exampleEs, w.id).toBeTruthy();
      expect(w.exampleTr, w.id).toBeTruthy();
      expect(w.tags.length, w.id).toBeGreaterThan(0);
      for (const t of w.tags) expect(TOPICS.some((x) => x.id === t), `${w.id}: ${t}`).toBe(true);
    }
  });

  it('isimlerde artikel cinsiyetle uyumlu (el agua istisnası)', () => {
    for (const w of WORDS.filter((x) => x.partOfSpeech === 'noun')) {
      expect(w.gender, w.id).not.toBeNull();
      const expected = w.gender === 'f' ? 'la' : 'el';
      if (w.id === 'agua') { expect(w.article).toBe('el'); expect(w.gender).toBe('f'); continue; }
      expect(w.article, w.id).toBe(expected);
    }
  });

  it('bilinen cinsiyet istisnaları doğru', () => {
    expect(WORD_BY_ID.dia!.gender).toBe('m');
    expect(WORD_BY_ID.sofa!.gender).toBe('m');
    expect(WORD_BY_ID.mano).toBeUndefined(); // listede yok; eklenirse f olmalı
  });

  it('çoğul kuralları', () => {
    expect(pluralize('casa')).toBe('casas');
    expect(pluralize('ciudad')).toBe('ciudades');
    expect(pluralize('estación')).toBe('estaciones');
    expect(pluralize('autobús')).toBe('autobuses');
    expect(pluralize('jardín')).toBe('jardines');
    expect(pluralize('feliz')).toBe('felices');
    expect(pluralize('móvil')).toBe('móviles');
    expect(WORD_BY_ID.lunes!.plural).toBe('lunes');
    expect(WORD_BY_ID.joven!.plural).toBe('jóvenes');
    expect(WORD_BY_ID.reloj!.plural).toBe('relojes');
  });

  it('boşluk biçimi örnek cümlede gerçekten geçiyor', () => {
    for (const w of WORDS) if (w.blank) expect(w.exampleEs.toLowerCase(), w.id).toContain(w.blank.toLowerCase());
  });

  it('ilişkili, eş ve zıt anlamlı id’ler var olan kelimeler', () => {
    for (const w of WORDS) {
      for (const r of [...(w.related ?? []), ...(w.antonyms ?? [])]) expect(WORD_BY_ID[r], `${w.id} → ${r}`).toBeDefined();
    }
  });
});

describe('fiil çekimleri', () => {
  const table = (id: string) => PERSONS.map((p) => VERBS.find((v) => v.id === id)!.conjugations.presente[p]);

  it('her fiilde 6 kişi dolu', () => {
    expect(VERBS.length).toBeGreaterThanOrEqual(40);
    for (const v of VERBS) for (const p of PERSONS) expect(v.conjugations.presente[p], `${v.id} ${p}`).toBeTruthy();
  });

  it('düzensiz fiiller (elle yazılmış beklenen tablolar)', () => {
    expect(table('ser')).toEqual(['soy', 'eres', 'es', 'somos', 'sois', 'son']);
    expect(table('estar')).toEqual(['estoy', 'estás', 'está', 'estamos', 'estáis', 'están']);
    expect(table('ir')).toEqual(['voy', 'vas', 'va', 'vamos', 'vais', 'van']);
    expect(table('tener')).toEqual(['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen']);
    expect(table('hacer')).toEqual(['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen']);
    expect(table('poder')).toEqual(['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden']);
    expect(table('querer')).toEqual(['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren']);
    expect(table('venir')).toEqual(['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen']);
    expect(table('decir')).toEqual(['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen']);
    expect(table('salir')).toEqual(['salgo', 'sales', 'sale', 'salimos', 'salís', 'salen']);
    expect(table('poner')).toEqual(['pongo', 'pones', 'pone', 'ponemos', 'ponéis', 'ponen']);
    expect(table('saber')).toEqual(['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben']);
    expect(table('conocer')).toEqual(['conozco', 'conoces', 'conoce', 'conocemos', 'conocéis', 'conocen']);
    expect(table('dar')).toEqual(['doy', 'das', 'da', 'damos', 'dais', 'dan']);
    expect(table('ver')).toEqual(['veo', 'ves', 've', 'vemos', 'veis', 'ven']);
    expect(table('oir')).toEqual(['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen']);
    expect(table('traer')).toEqual(['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen']);
  });

  it('kök değişimi', () => {
    expect(table('jugar')).toEqual(['juego', 'juegas', 'juega', 'jugamos', 'jugáis', 'juegan']);
    expect(table('dormir')).toEqual(['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen']);
    expect(table('pedir')).toEqual(['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden']);
    expect(table('empezar')).toEqual(['empiezo', 'empiezas', 'empieza', 'empezamos', 'empezáis', 'empiezan']);
    expect(table('preferir')).toEqual(['prefiero', 'prefieres', 'prefiere', 'preferimos', 'preferís', 'prefieren']);
    expect(table('repetir')).toEqual(['repito', 'repites', 'repite', 'repetimos', 'repetís', 'repiten']);
    expect(table('encontrar')).toEqual(['encuentro', 'encuentras', 'encuentra', 'encontramos', 'encontráis', 'encuentran']);
  });

  it('düzenli fiiller ve dönüşlüler', () => {
    expect(table('hablar')).toEqual(['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan']);
    expect(table('comer')).toEqual(['como', 'comes', 'come', 'comemos', 'coméis', 'comen']);
    expect(table('vivir')).toEqual(['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven']);
    expect(table('levantarse')).toEqual(['me levanto', 'te levantas', 'se levanta', 'nos levantamos', 'os levantáis', 'se levantan']);
    expect(table('acostarse')).toEqual(['me acuesto', 'te acuestas', 'se acuesta', 'nos acostamos', 'os acostáis', 'se acuestan']);
    expect(conjugate('leer').nosotros).toBe('leemos');
    for (const v of VERBS.filter((x) => x.regular)) expect(v.conjugations.presente.nosotros, v.id).toMatch(/(amos|emos|imos)$/);
  });
});
