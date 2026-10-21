import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('plural');

export const plural: GrammarTopic = {
  id: 'plural', level: 'A1', title: 'Çoğul',
  summary: 'Çoğul yapmak kolay: sesliyle biten kelimeye -s, ünsüzle bitene -es eklenir. Artikel de çoğul olur: el → los, la → las.',
  table: { headers: ['Kural', 'Tekil', 'Çoğul'], rows: [
    ['sesli → +s', 'la casa', 'las casas'],
    ['ünsüz → +es', 'la ciudad', 'las ciudades'],
    ['-z → -ces', 'el lápiz', 'los lápices'],
    ['son hecedeki aksan düşer', 'la estación', 'las estaciones'],
    ['vurgusuz -s değişmez', 'el lunes', 'los lunes']
  ] },
  usage: [
    'Sıfat da çoğul olur: las casas grandes.',
    'Karışık grupta eril çoğul: los padres (anne ve baba), los hermanos (kardeşler).',
    'Artikel her zaman isimle uyumlu: los libros, las mesas.'
  ],
  examples: [
    { es: 'Tengo dos libros.', tr: 'İki kitabım var.' },
    { es: 'Las ciudades españolas son bonitas.', tr: 'İspanyol şehirleri güzel.' },
    { es: 'Los lunes trabajo.', tr: 'Pazartesileri çalışırım.' }
  ],
  notes: ['los padres hem “babalar” hem “anne ve baba” demektir; çoğu zaman ikincisi.'],
  check: [
    q.fill('el libro → los ___', ['libros']),
    q.fill('la ciudad → las ___', ['ciudades']),
    q.mc('el lápiz → los ___', 'lápices', ['lápizes', 'lápizs', 'lápiz'])
  ],
  questions: [
    q.fill('la mesa → las ___', ['mesas']),
    q.fill('el tren → los ___', ['trenes']),
    q.fill('la estación → las ___', ['estaciones'], 'Çoğulda aksan düşer.'),
    q.mc('el lunes → los ___', 'lunes', ['luneses', 'lunesos', 'lune']),
    q.fill('___ casas son grandes. (belirli)', ['Las']),
    q.fix('Tengo dos perroes.', ['Tengo dos perros.'], 'Sesliyle biten kelimeye yalnız -s eklenir.'),
    q.fix('Los ciudades son bonitas.', ['Las ciudades son bonitas.'], 'ciudad dişildir: las ciudades.'),
    q.order('Las chicas son simpáticas.'),
    q.trEs('İki kedim var.', ['Tengo dos gatos', 'Yo tengo dos gatos']),
    q.esTr('Mis padres viven en Estambul.', 'Annemle babam İstanbul’da yaşıyor.', ['Babalarım İstanbul’da yaşıyor.', 'Babam İstanbul’da yaşıyor.'])
  ]
};
