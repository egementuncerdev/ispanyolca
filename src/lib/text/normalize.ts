/* Cevap karşılaştırma: büyük/küçük harf, baştaki/sondaki boşluk ve noktalama önemsiz.
   Eksik aksan (está → esta, niño → nino) uyarıyla doğru sayılır; katı modda yanlış. */

const ARTICLES = ['el', 'la', 'los', 'las', 'un', 'una'];

export const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');

/** Karşılaştırma için temel biçim: küçük harf, fazla boşluk ve kenar noktalaması yok */
export function clean(s: string): string {
  return s
    .normalize('NFC')
    .toLocaleLowerCase('es')
    .trim()
    .replace(/[¿¡]/g, '')
    .replace(/[.,;:!?…"“”'’]+$/g, '')
    .replace(/^[.,;:!?…"“”'’]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export type CheckResult =
  | { ok: true; note?: 'accent' | 'article'; expected: string }
  | { ok: false; expected: string };

/**
 * @param input kullanıcının yazdığı
 * @param answers kabul edilen cevaplar (ilk eleman gösterilen doğru cevap)
 */
export function checkAnswer(input: string, answers: string[], { strictAccents = false } = {}): CheckResult {
  const expected = answers[0] ?? '';
  const got = clean(input);
  if (!got) return { ok: false, expected };
  const list = answers.map(clean);

  if (list.includes(got)) return { ok: true, expected };
  if (!strictAccents && list.some((a) => stripAccents(a) === stripAccents(got))) return { ok: true, note: 'accent', expected: matchFor(got, answers, stripAccents) };

  // Artikelsiz yazılan isim: "casa" → "la casa"
  for (const [i, a] of list.entries()) {
    const [first, ...rest] = a.split(' ');
    if (first && ARTICLES.includes(first) && rest.length) {
      const bare = rest.join(' ');
      if (bare === got || (!strictAccents && stripAccents(bare) === stripAccents(got))) return { ok: true, note: 'article', expected: answers[i]! };
    }
  }
  return { ok: false, expected };
}

function matchFor(got: string, answers: string[], f: (s: string) => string) {
  return answers.find((a) => f(clean(a)) === f(got)) ?? answers[0] ?? '';
}
