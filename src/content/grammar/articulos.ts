import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('articulos');

export const articulos: GrammarTopic = {
  id: 'articulos', level: 'A1', title: 'Belirli ve belirsiz artikeller',
  summary: 'İsimlerin önünde artikel gelir. Belirli artikel (el, la, los, las) bilinen şeyler için; belirsiz artikel (un, una, unos, unas) “bir, birkaç” anlamında.',
  table: { headers: ['', 'Eril', 'Dişil'], rows: [
    ['Belirli, tekil', 'el libro', 'la casa'],
    ['Belirli, çoğul', 'los libros', 'las casas'],
    ['Belirsiz, tekil', 'un libro', 'una casa'],
    ['Belirsiz, çoğul', 'unos libros', 'unas casas']
  ] },
  usage: [
    'Belirli: ikimiz de neyi kastettiğimizi biliyoruz → El libro está en la mesa.',
    'Genel anlamda da belirli artikel: Me gusta el café (kahveyi severim).',
    'Belirsiz: ilk kez söz edilen → Tengo un perro.',
    'Kaynaşma: a + el = al, de + el = del → Voy al cine. / Vengo del parque.'
  ],
  examples: [
    { es: 'Tengo un perro. El perro se llama Rex.', tr: 'Bir köpeğim var. Köpeğin adı Rex.' },
    { es: 'Hay unas sillas en la cocina.', tr: 'Mutfakta birkaç sandalye var.' },
    { es: 'Voy al supermercado.', tr: 'Süpermarkete gidiyorum.' }
  ],
  notes: ['Vurgulu a ile başlayan dişil isimler tekilde el alır: el agua (ama: las aguas).'],
  check: [
    q.mc('___ casa (belirli)', 'la', ['el', 'los', 'un']),
    q.mc('___ libros (belirli)', 'los', ['las', 'el', 'unos']),
    q.fill('Tengo ___ perro. (bir)', ['un'])
  ],
  questions: [
    q.fill('___ mesa es grande. (belirli)', ['La']),
    q.fill('Quiero ___ café. (bir)', ['un']),
    q.fill('Hay ___ manzana en la mesa. (bir)', ['una']),
    q.mc('___ agua está fría.', 'El', ['La', 'Las', 'Un'], 'agua dişildir ama tekilde el alır.'),
    q.fill('Voy ___ cine. (a + el)', ['al']),
    q.fill('Vengo ___ parque. (de + el)', ['del']),
    q.fix('Voy a el museo.', ['Voy al museo.'], 'a + el = al.'),
    q.fix('La problema es difícil.', ['El problema es difícil.'], 'problema erildir: el problema.'),
    q.order('Los niños juegan en el parque.'),
    q.trEs('Masada bir elma var.', ['Hay una manzana en la mesa']),
    q.esTr('Me gusta el café.', 'Kahveyi severim.', ['Bu kahveyi istiyorum.', 'Bir kahve istiyorum.'], 'Genel anlamda da belirli artikel kullanılır.')
  ]
};
