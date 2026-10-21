import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('gustar');

export const gustar: GrammarTopic = {
  id: 'gustar', level: 'A1', title: 'Gustar',
  summary: 'Gustar “sevmek, hoşa gitmek” demektir ama yapı terstir: “bana hoş geliyor” gibi. Sevilen şey öznedir: tekilse gusta, çoğulsa gustan.',
  table: { headers: ['Kime', 'Zamir', 'Örnek'], rows: [
    ['yo', 'me', 'Me gusta el café.'],
    ['tú', 'te', '¿Te gustan los perros?'],
    ['él / ella / usted', 'le', 'Le gusta bailar.'],
    ['nosotros/as', 'nos', 'Nos gusta la playa.'],
    ['vosotros/as', 'os', '¿Os gusta Madrid?'],
    ['ellos / ellas / ustedes', 'les', 'Les gustan las películas.']
  ] },
  usage: [
    'Tekil isim ya da fiil (mastar) → gusta: Me gusta leer.',
    'Çoğul isim → gustan: Me gustan las fresas.',
    'Olumsuz: No me gusta. Kimin sevdiğini açıkça söylemek için: A Ana le gusta el té.',
    'encantar (çok sevmek) aynı yapıdadır: Me encanta el chocolate.'
  ],
  examples: [
    { es: 'Me gusta mucho el chocolate.', tr: 'Çikolatayı çok severim.' },
    { es: '¿Te gusta viajar?', tr: 'Seyahat etmeyi sever misin?' },
    { es: 'A mi madre le gustan las flores.', tr: 'Annem çiçekleri sever.' }
  ],
  check: [
    q.mc('Me ___ el café.', 'gusta', ['gustan', 'gusto', 'gustas']),
    q.mc('Me ___ las fresas.', 'gustan', ['gusta', 'gustas', 'gusto']),
    q.fill('¿___ gusta bailar? (sana)', ['Te'])
  ],
  questions: [
    q.fill('A mi padre ___ gusta el fútbol.', ['le']),
    q.fill('Nos ___ los perros.', ['gustan']),
    q.fill('No me ___ cocinar.', ['gusta'], 'Mastar tekil sayılır: gusta.'),
    q.fill('¿___ gusta Madrid? (size, vosotros)', ['Os']),
    q.mc('A Ana y a Luis ___ gusta viajar.', 'les', ['le', 'se', 'los']),
    q.fix('Yo gusto el chocolate.', ['Me gusta el chocolate.', 'A mí me gusta el chocolate.'], 'Sevilen şey öznedir: me gusta.'),
    q.fix('Me gustan el té.', ['Me gusta el té.'], 'té tekil → gusta.'),
    q.order('A mi hermana le gustan los gatos.'),
    q.trEs('Kitap okumayı severim.', ['Me gusta leer', 'Me gusta leer libros', 'A mí me gusta leer']),
    q.esTr('¿Te gustan las películas españolas?', 'İspanyol filmlerini sever misin?', ['İspanyol filmleri izliyor musun?', 'İspanyol filmlerini seviyor muyum?'])
  ]
};
