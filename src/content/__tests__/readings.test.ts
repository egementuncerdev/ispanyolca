import { describe, expect, it } from 'vitest';
import { READINGS } from '@/content/readings';
import { EXTRA } from '@/content/readings/extra';
import { TOPICS, WORD_BY_ID } from '@/content/vocabulary';
import { FORMS, tokenize } from '@/lib/reading/lexicon';

describe('okumalar', () => {
  it('id ve soru id’leri benzersiz', () => {
    expect(new Set(READINGS.map((r) => r.id)).size).toBe(READINGS.length);
    const qs = READINGS.flatMap((r) => r.questions.map((q) => q.id));
    expect(new Set(qs).size).toBe(qs.length);
  });

  it('en az 10 metin ve 2 hikâye; konu geçerli; her paragrafın Türkçesi var', () => {
    expect(READINGS.filter((r) => r.kind === 'text').length).toBeGreaterThanOrEqual(10);
    expect(READINGS.filter((r) => r.kind === 'story').length).toBeGreaterThanOrEqual(2);
    const topics = new Set(TOPICS.map((t) => t.id));
    for (const r of READINGS) {
      expect(topics.has(r.topic), r.id).toBe(true);
      for (const p of r.paragraphs) { expect(p.es.trim(), r.id).not.toBe(''); expect(p.tr.trim(), r.id).not.toBe(''); }
      expect(r.questions.length, r.id).toBeGreaterThanOrEqual(4);
    }
  });

  it('glossary yalnız var olan kelimelere ve ek sözlüğe işaret ediyor', () => {
    for (const r of READINGS) for (const [form, id] of Object.entries(r.glossary ?? {})) {
      const ok = id.startsWith('x:') ? !!EXTRA[id.slice(2)] : !!WORD_BY_ID[id];
      expect(ok, `${r.id}: ${form} → ${id}`).toBe(true);
    }
  });

  it('metinlerdeki her kelime çözülüyor (kart, ek sözlük ya da özel ad); çok anlamlılar glossary’de', () => {
    const problems: string[] = [];
    for (const r of READINGS) for (const p of r.paragraphs) for (const tk of tokenize(p.es, r)) {
      if (tk.t === 'unknown') problems.push(`${r.id}: "${tk.text}"${tk.ambiguous ? ` belirsiz (${tk.ambiguous.join(' / ')})` : ''}`);
    }
    expect(problems).toEqual([]);
  });

  it('çoktan seçmeli sorularda doğru cevap şıklar arasında', () => {
    for (const r of READINGS) for (const q of r.questions) if (q.options) expect(q.options, q.id).toContain(q.answers[0]);
  });
});

describe('lexicon', () => {
  it('çekimli biçimler ve kalıplar bulunur', () => {
    expect(FORMS.get('tengo')?.[0]?.wordId).toBe('tener');
    expect(FORMS.get('levanto')?.[0]?.wordId).toBe('levantarse');
    expect(FORMS.get('pequeña')?.[0]?.wordId).toBe('pequeno');
    const toks = tokenize('El fin de semana me levanto tarde.', { glossary: { tarde: 'tarde-gec' } });
    const words = toks.filter((t) => t.t === 'word').map((t) => t.t === 'word' && t.word.id);
    expect(words).toEqual(['fin-de-semana', 'levantarse', 'tarde-gec']);
    expect(toks.map((t) => t.text).join('')).toBe('El fin de semana me levanto tarde.');
  });
  it('glossary olmadan çok anlamlı biçim belirsiz kalır', () => {
    const t = tokenize('mañana')[0]!;
    expect(t.t).toBe('unknown');
  });
});
