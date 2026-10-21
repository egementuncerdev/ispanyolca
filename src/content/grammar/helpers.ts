/* Grammar sorularını kısa yazmak için kurucular. Şıklar ve kelime sıralama parçaları
   veride doğru sırayla durur; ekranda karıştırılır. */
import type { Question } from '@/types/content';

export function questions(topicId: string) {
  let n = 0;
  const base = (type: Question['type'], prompt: string, answers: string[], extra: Partial<Question> = {}): Question => {
    const q: Question = { id: `${topicId}-${++n}`, type, prompt, answers, topicId };
    for (const [k, v] of Object.entries(extra)) if (v !== undefined) (q as unknown as Record<string, unknown>)[k] = v;
    return q;
  };
  return {
    /** çoktan seçmeli: doğru cevap + yanlışlar */
    mc: (prompt: string, answer: string, wrong: string[], explanation?: string) => base('multiple_choice', prompt, [answer], { options: [answer, ...wrong], explanation }),
    /** boşluk doldurma (prompt içinde ___) */
    fill: (prompt: string, answers: string[], explanation?: string) => base('fill_blank', prompt, answers, { explanation }),
    /** hatalı cümleyi düzelt */
    fix: (wrong: string, answers: string[], explanation?: string, strict = false) => base('fix_sentence', wrong, answers, { explanation, strict: strict || undefined }),
    /** kelime sıralama: cevap boşluklardan parçalanır */
    order: (answer: string, explanation?: string) => base('word_order', 'Kelimeleri doğru sıraya koy.', [answer], { parts: answer.split(' '), explanation }),
    /** Türkçeden İspanyolcaya (yazarak) */
    trEs: (tr: string, answers: string[], explanation?: string) => base('translate_tr_es', tr, answers, { explanation }),
    /** İspanyolcadan Türkçeye (seçerek) */
    esTr: (es: string, answer: string, wrong: string[], explanation?: string) => base('translate_es_tr', es, [answer], { options: [answer, ...wrong], explanation })
  };
}

export const PERSON_HEADERS = ['Kişi', ''];
export const persons = (forms: string[]) => [['yo', forms[0]!], ['tú', forms[1]!], ['él / ella / usted', forms[2]!], ['nosotros/as', forms[3]!], ['vosotros/as', forms[4]!], ['ellos / ellas / ustedes', forms[5]!]];
