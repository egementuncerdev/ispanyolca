import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('reflexivos');

export const reflexivos: GrammarTopic = {
  id: 'reflexivos', level: 'A1', title: 'Dönüşlü fiiller ve günlük rutin',
  summary: 'Eylem kişinin kendisine dönüyorsa fiil dönüşlüdür; mastarı -se ile biter: levantarse (kalkmak), llamarse (adı … olmak). Çekimde fiilin önüne me, te, se, nos, os, se gelir.',
  table: { caption: 'levantarse (kalkmak)', headers: ['Kişi', 'Zamir', 'levantarse'], rows: [
    ['yo', 'me', 'me levanto'], ['tú', 'te', 'te levantas'], ['él / ella / usted', 'se', 'se levanta'],
    ['nosotros/as', 'nos', 'nos levantamos'], ['vosotros/as', 'os', 'os levantáis'], ['ellos / ellas / ustedes', 'se', 'se levantan']
  ] },
  usage: [
    'Zamir çekimli fiilden önce gelir: Me ducho. Olumsuzda no en başta: No me ducho.',
    'Mastarla birlikte zamir sona eklenebilir: Quiero levantarme temprano.',
    'Bazıları kök değiştirir: despertarse → me despierto, acostarse → me acuesto.',
    'Günlük rutin: despertarse, levantarse, ducharse, vestirse, acostarse.'
  ],
  examples: [
    { es: 'Me levanto a las siete.', tr: 'Saat yedide kalkarım.' },
    { es: '¿Cómo te llamas? —Me llamo Egemen.', tr: 'Adın ne? —Adım Egemen.' },
    { es: 'Nos acostamos tarde.', tr: 'Geç yatarız.' }
  ],
  check: [
    q.fill('Yo ___ levanto a las siete.', ['me']),
    q.mc('¿Cómo ___ llamas?', 'te', ['se', 'me', 'tu']),
    q.fill('Ella ___ ducha por la mañana.', ['se'])
  ],
  questions: [
    q.fill('Nosotros ___ acostamos a las once.', ['nos']),
    q.fill('Vosotros ___ levantáis tarde.', ['os']),
    q.fill('Ellos ___ (llamarse) Ana y Pablo.', ['se llaman']),
    q.fill('Yo ___ (despertarse) a las seis.', ['me despierto'], 'despertarse kök değiştirir: e → ie.'),
    q.mc('Tú ___ (acostarse) tarde.', 'te acuestas', ['te acostas', 'se acuesta', 'te acuesto'], 'acostarse kök değiştirir: o → ue.'),
    q.fix('Yo levanto me a las ocho.', ['Yo me levanto a las ocho.', 'Me levanto a las ocho.'], 'Zamir çekimli fiilden önce gelir.'),
    q.fix('Me llamo es Egemen.', ['Me llamo Egemen.'], 'llamarse zaten “adım …” demek; es eklenmez.'),
    q.order('Me ducho por la mañana.'),
    q.trEs('Adım Ayşe.', ['Me llamo Ayşe']),
    q.trEs('Saat on birde yatıyoruz.', ['Nos acostamos a las once'])
  ]
};
