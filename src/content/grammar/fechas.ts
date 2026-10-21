import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('fechas');

export const fechas: GrammarTopic = {
  id: 'fechas', level: 'A1', title: 'Günler, aylar ve tarihler',
  summary: 'Gün ve ay adları küçük harfle yazılır. Tarih “el + gün + de + ay” kalıbıyla söylenir: el veintiuno de octubre.',
  table: { headers: ['Günler', 'Aylar'], rows: [
    ['lunes (pazartesi)', 'enero · febrero · marzo'],
    ['martes (salı)', 'abril · mayo · junio'],
    ['miércoles (çarşamba)', 'julio · agosto · septiembre'],
    ['jueves (perşembe)', 'octubre · noviembre · diciembre'],
    ['viernes (cuma)', ''],
    ['sábado (cumartesi)', ''],
    ['domingo (pazar)', '']
  ] },
  usage: [
    'Tarih: el 21 de octubre (de 2026).',
    'Gün adının önünde el = o gün: El lunes tengo clase. los = her: Los lunes voy al gimnasio.',
    'Günlerden önce en kullanılmaz: ✗ en lunes → ✓ el lunes. Aylarda ise en: en marzo.',
    'Sorular: ¿Qué día es hoy? (Bugün günlerden ne?) · ¿Qué fecha es hoy? (Bugün ayın kaçı?)'
  ],
  examples: [
    { es: 'Hoy es miércoles.', tr: 'Bugün çarşamba.' },
    { es: 'Mi cumpleaños es el doce de marzo.', tr: 'Doğum günüm 12 Mart’ta.' },
    { es: 'Los sábados no trabajo.', tr: 'Cumartesileri çalışmam.' }
  ],
  notes: ['Latin Amerika’da ayın ilk günü için çoğu zaman “el primero de mayo” denir; İspanya’da “el uno de mayo” da çok yaygın.'],
  check: [
    q.mc('Pazartesi', 'lunes', ['martes', 'domingo', 'jueves']),
    q.mc('“21 Ekim”', 'el veintiuno de octubre', ['el octubre veintiuno', 'veintiuno octubre', 'el veintiuno en octubre']),
    q.fill('Los ___ voy al gimnasio. (cumartesi)', ['sábados'])
  ],
  questions: [
    q.fill('Hoy es ___. (cuma)', ['viernes']),
    q.fill('Mi cumpleaños es en ___. (temmuz)', ['julio']),
    q.mc('“Pazar günü ailemle yemek yerim.”', 'El domingo como con mi familia.', ['En domingo como con mi familia.', 'Los domingo como con mi familia.', 'En el domingo como con mi familia.']),
    q.fill('El 14 ___ febrero.', ['de']),
    q.fix('Mi cumpleaños es en el 5 de mayo.', ['Mi cumpleaños es el 5 de mayo.', 'Mi cumpleaños es el cinco de mayo.'], 'Tarihten önce en kullanılmaz.'),
    q.fix('Trabajo en lunes.', ['Trabajo el lunes.', 'Trabajo los lunes.'], 'Günlerden önce en değil el / los gelir.'),
    q.order('Hoy es el veintiuno de octubre.'),
    q.trEs('Bugün günlerden ne?', ['¿Qué día es hoy?']),
    q.trEs('Doğum günüm martta.', ['Mi cumpleaños es en marzo']),
    q.esTr('Los domingos no trabajo.', 'Pazarları çalışmam.', ['Bu pazar çalışmıyorum.', 'Pazar günü çalıştım.'])
  ]
};
