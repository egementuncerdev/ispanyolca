import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('ir-a');

export const irA: GrammarTopic = {
  id: 'ir-a', level: 'A1', title: 'Ir a + mastar (yakın gelecek)',
  summary: 'Plan ve yakın gelecek için ir fiilinin çekimi + a + mastar kullanılır: Voy a estudiar (ders çalışacağım).',
  table: { headers: ['Kişi', 'ir + a + mastar'], rows: [
    ['yo', 'voy a comer'], ['tú', 'vas a comer'], ['él / ella / usted', 'va a comer'],
    ['nosotros/as', 'vamos a comer'], ['vosotros/as', 'vais a comer'], ['ellos / ellas / ustedes', 'van a comer']
  ] },
  usage: [
    'Plan ve niyet: Esta tarde voy a estudiar.',
    'Görünen bir şeyden tahmin: Va a llover (yağmur yağacak).',
    'Zaman sözcükleriyle: mañana, esta noche, el fin de semana, el año que viene.',
    'Olumsuz: No voy a salir.'
  ],
  examples: [
    { es: 'Mañana voy a visitar a mis abuelos.', tr: 'Yarın dedemlerle ninemi ziyaret edeceğim.' },
    { es: '¿Qué vas a hacer el sábado?', tr: 'Cumartesi ne yapacaksın?' },
    { es: 'Vamos a comer en un restaurante.', tr: 'Bir restoranda yemek yiyeceğiz.' }
  ],
  check: [
    q.fill('Yo ___ a estudiar esta tarde.', ['voy']),
    q.mc('Nosotros ___ a viajar a España.', 'vamos', ['van', 'vais', 'voy']),
    q.fill('¿Qué vas ___ hacer mañana?', ['a'])
  ],
  questions: [
    q.fill('Ellos ___ a cenar en casa.', ['van']),
    q.fill('Vosotros ___ a ver una película.', ['vais']),
    q.fill('Ella va a ___ (llamar) a su madre.', ['llamar'], 'a’dan sonra fiil mastar hâlinde kalır.'),
    q.mc('“Yağmur yağacak.”', 'Va a llover.', ['Va llover.', 'Va a llueve.', 'Es a llover.']),
    q.fix('Voy estudiar mañana.', ['Voy a estudiar mañana.', 'Mañana voy a estudiar.'], 'ir ile mastar arasında a gerekir.'),
    q.fix('Vamos a comemos pizza.', ['Vamos a comer pizza.'], 'a’dan sonra fiil mastar hâlinde.'),
    q.order('El sábado voy a visitar a mis abuelos.'),
    q.trEs('Bu akşam dışarı çıkacağım.', ['Esta noche voy a salir', 'Voy a salir esta noche']),
    q.trEs('Ne yapacaksın?', ['¿Qué vas a hacer?']),
    q.esTr('No vamos a trabajar el domingo.', 'Pazar günü çalışmayacağız.', ['Pazar günü çalışıyoruz.', 'Pazar günü çalışmak istemiyoruz.'])
  ]
};
