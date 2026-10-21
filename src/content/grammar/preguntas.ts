import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('preguntas');

export const preguntas: GrammarTopic = {
  id: 'preguntas', level: 'A1', title: 'Soru cümlesi ve soru kelimeleri',
  summary: 'Soru başta ¿ sonda ? ile yazılır. Evet/hayır sorularında kelime sırası çoğu zaman aynı kalır, ses yükselir. Soru kelimeleri her zaman aksanlıdır.',
  table: { headers: ['Soru kelimesi', 'Anlam', 'Örnek'], rows: [
    ['¿Qué?', 'ne?', '¿Qué es esto?'],
    ['¿Quién? / ¿Quiénes?', 'kim?', '¿Quién es?'],
    ['¿Dónde?', 'nerede?', '¿Dónde vives?'],
    ['¿Adónde?', 'nereye?', '¿Adónde vas?'],
    ['¿De dónde?', 'nereden, nereli?', '¿De dónde eres?'],
    ['¿Cuándo?', 'ne zaman?', '¿Cuándo es la clase?'],
    ['¿Cómo?', 'nasıl?', '¿Cómo estás?'],
    ['¿Cuánto / Cuánta / Cuántos / Cuántas?', 'ne kadar, kaç?', '¿Cuántos años tienes?'],
    ['¿Por qué?', 'neden?', '¿Por qué estudias español?'],
    ['¿Cuál? / ¿Cuáles?', 'hangisi?', '¿Cuál es tu número?']
  ] },
  usage: [
    'Soru kelimesi başa gelir, ardından fiil: ¿Dónde vive Ana?',
    '¿Por qué? (neden) sorusunun cevabı porque (çünkü) ile başlar: bitişik, aksansız.',
    'cuánto, ardından gelen isimle uyum yapar: ¿Cuántas hermanas tienes?'
  ],
  examples: [
    { es: '¿De dónde eres? —Soy de Turquía.', tr: 'Nerelisin? —Türkiyeliyim.' },
    { es: '¿Por qué estudias español? —Porque me gusta.', tr: 'Neden İspanyolca çalışıyorsun? —Çünkü hoşuma gidiyor.' },
    { es: '¿Cuántos hermanos tienes?', tr: 'Kaç kardeşin var?' }
  ],
  check: [
    q.mc('“Nerede yaşıyorsun?”', '¿Dónde vives?', ['¿Qué vives?', '¿Cuándo vives?', '¿Cómo vives?']),
    q.fill('¿___ te llamas? (nasıl)', ['Cómo']),
    q.mc('“Nerelisin?”', '¿De dónde eres?', ['¿Dónde eres?', '¿Adónde eres?', '¿De dónde estás?'])
  ],
  questions: [
    q.fill('¿___ es tu cumpleaños? (ne zaman)', ['Cuándo']),
    q.fill('¿___ es ella? (kim)', ['Quién']),
    q.fill('¿___ hermanas tienes? (kaç)', ['Cuántas'], 'hermanas dişil çoğul → cuántas.'),
    q.mc('—¿Por qué estudias? —___ tengo un examen.', 'Porque', ['Por qué', 'Porqué', 'Para'], 'Cevapta porque (çünkü) bitişik ve aksansız.'),
    q.fill('¿___ vas? —Voy al cine. (nereye)', ['Adónde', 'A dónde']),
    q.fix('Donde está el baño?', ['¿Dónde está el baño?'], 'Soru kelimeleri aksanlıdır: dónde.', true),
    q.order('¿Dónde está la estación?'),
    q.order('¿Cuántos años tiene tu madre?'),
    q.trEs('Saat kaç?', ['¿Qué hora es?']),
    q.esTr('¿Cuál es tu color favorito?', 'En sevdiğin renk ne?', ['Hangi renk güzel?', 'Rengin ne zaman?'])
  ]
};
