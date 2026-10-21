import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('verbos-er');

export const verbosEr: GrammarTopic = {
  id: 'verbos-er', level: 'A1', title: '-ER fiilleri',
  summary: '-er ile biten düzenli fiillerde ekler -o, -es, -e, -emos, -éis, -en şeklindedir: comer → como, comes, come…',
  table: { caption: 'comer (yemek)', headers: ['Kişi', 'Ek', 'comer'], rows: [
    ['yo', '-o', 'como'], ['tú', '-es', 'comes'], ['él / ella / usted', '-e', 'come'],
    ['nosotros/as', '-emos', 'comemos'], ['vosotros/as', '-éis', 'coméis'], ['ellos / ellas / ustedes', '-en', 'comen']
  ] },
  usage: [
    '-ar fiillerinden farkı: a yerine e gelir (hablas → comes).',
    'Aynı kalıptaki fiiller: beber, leer, aprender, comprender, correr, vender.'
  ],
  examples: [
    { es: 'Como en casa.', tr: 'Evde yemek yiyorum.' },
    { es: '¿Bebes café?', tr: 'Kahve içer misin?' },
    { es: 'Leemos un libro.', tr: 'Bir kitap okuyoruz.' }
  ],
  check: [
    q.fill('Yo ___ (comer) pasta.', ['como']),
    q.mc('Tú ___ (beber) agua.', 'bebes', ['bebe', 'bebas', 'bebéis'], '-er fiillerinde tú eki -es.'),
    q.fill('Nosotros ___ (leer) mucho.', ['leemos'])
  ],
  questions: [
    q.fill('Mi hermano ___ (aprender) inglés.', ['aprende']),
    q.fill('Vosotros ___ (comer) muy tarde.', ['coméis']),
    q.fill('Ellos ___ (vender) fruta en el mercado.', ['venden']),
    q.fill('¿Usted ___ (comprender) el español?', ['comprende']),
    q.mc('Ella ___ (beber) té.', 'bebe', ['beba', 'bebo', 'bebes']),
    q.fix('Nosotros comamos a las dos.', ['Nosotros comemos a las dos.', 'Comemos a las dos.'], '-er fiillerinde nosotros eki -emos.'),
    q.fix('Yo lee un libro.', ['Yo leo un libro.', 'Leo un libro.']),
    q.order('Los niños comen fruta.'),
    q.trEs('Çok su içiyorum.', ['Bebo mucha agua', 'Yo bebo mucha agua']),
    q.esTr('Aprendemos palabras nuevas.', 'Yeni kelimeler öğreniyoruz.', ['Yeni kelimeler öğreniyorum.', 'Yeni kelimeler öğretiyoruz.'])
  ]
};
