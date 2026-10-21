import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('verbos-ar');

export const verbosAr: GrammarTopic = {
  id: 'verbos-ar', level: 'A1', title: '-AR fiilleri',
  summary: 'Mastarı -ar ile biten düzenli fiillerde -ar düşer, kişiye göre ek gelir: hablar → hablo, hablas, habla…',
  table: { caption: 'hablar (konuşmak)', headers: ['Kişi', 'Ek', 'hablar'], rows: [
    ['yo', '-o', 'hablo'], ['tú', '-as', 'hablas'], ['él / ella / usted', '-a', 'habla'],
    ['nosotros/as', '-amos', 'hablamos'], ['vosotros/as', '-áis', 'habláis'], ['ellos / ellas / ustedes', '-an', 'hablan']
  ] },
  usage: [
    'Presente hem şimdiki zamanı hem geniş zamanı karşılar: Hablo español = İspanyolca konuşuyorum / konuşurum.',
    'Yakın gelecek için de kullanılır: Mañana trabajo (yarın çalışıyorum).',
    'Aynı kalıptaki fiiller: trabajar, estudiar, escuchar, comprar, cocinar, viajar, llegar.'
  ],
  examples: [
    { es: 'Trabajo en una oficina.', tr: 'Bir ofiste çalışıyorum.' },
    { es: '¿Hablas inglés?', tr: 'İngilizce konuşuyor musun?' },
    { es: 'Estudiamos español.', tr: 'İspanyolca çalışıyoruz.' }
  ],
  check: [
    q.fill('Yo ___ (hablar) español.', ['hablo']),
    q.mc('Tú ___ (trabajar) mucho.', 'trabajas', ['trabaja', 'trabajo', 'trabajáis']),
    q.fill('Nosotros ___ (estudiar) juntos.', ['estudiamos'])
  ],
  questions: [
    q.fill('Ella ___ (cocinar) muy bien.', ['cocina']),
    q.fill('Vosotros ___ (escuchar) música.', ['escucháis']),
    q.fill('Ellos ___ (comprar) fruta.', ['compran']),
    q.fill('¿Usted ___ (hablar) inglés?', ['habla'], 'usted, 3. tekil gibi çekilir.'),
    q.fix('Yo trabaja en un banco.', ['Yo trabajo en un banco.', 'Trabajo en un banco.']),
    q.fix('Nosotros hablan español.', ['Nosotros hablamos español.', 'Hablamos español.']),
    q.order('Mis padres viajan mucho.'),
    q.trEs('İspanyolca çalışıyorum.', ['Estudio español', 'Yo estudio español']),
    q.trEs('Bir restoranda çalışıyoruz.', ['Trabajamos en un restaurante', 'Nosotros trabajamos en un restaurante']),
    q.esTr('¿Escuchas la radio?', 'Radyo dinliyor musun?', ['Radyoyu açıyor musun?', 'Radyo dinliyor muyuz?'])
  ]
};
