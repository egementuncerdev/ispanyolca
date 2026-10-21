import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('pronombres');

export const pronombres: GrammarTopic = {
  id: 'pronombres', level: 'A1', title: 'Kişi zamirleri',
  summary: 'İspanyolcada özne zamirleri yo, tú, él, ella, usted, nosotros, vosotros, ellos, ellas ve ustedes. Fiilin çekimi kişiyi zaten gösterdiği için zamir çoğu zaman söylenmez.',
  table: { headers: ['Kişi', 'Zamir', 'Türkçe'], rows: [
    ['1. tekil', 'yo', 'ben'],
    ['2. tekil', 'tú', 'sen'],
    ['3. tekil', 'él / ella / usted', 'o (erkek) / o (kadın) / siz (resmî)'],
    ['1. çoğul', 'nosotros / nosotras', 'biz'],
    ['2. çoğul', 'vosotros / vosotras', 'siz (samimi, İspanya)'],
    ['3. çoğul', 'ellos / ellas / ustedes', 'onlar / siz (resmî, çoğul)']
  ] },
  usage: [
    'tú: arkadaş, aile, yaşıt. usted: resmî “siz”; fiil 3. tekil gibi çekilir (usted es).',
    'vosotros: İspanya’da bir gruba samimi “siz”. ustedes: resmî çoğul “siz”.',
    'Grupta en az bir erkek varsa eril çoğul kullanılır: Ana y Pablo → ellos.',
    'Zamir genelde düşer: Hablo español. Vurgu ya da karışıklığı önlemek için söylenir: Yo soy Egemen, ¿y tú?'
  ],
  examples: [
    { es: 'Yo soy Egemen.', tr: 'Ben Egemen’im.' },
    { es: '¿Usted es la señora García?', tr: 'Siz García Hanım mısınız?' },
    { es: 'Nosotras somos amigas.', tr: 'Biz arkadaşız. (kadınlar)' }
  ],
  notes: ['Latin Amerika’da vosotros kullanılmaz; samimi çoğul için de ustedes denir.', 'tú (sen) aksanlıdır; tu (senin) aksansızdır.'],
  check: [
    q.mc('“Sen” hangisi?', 'tú', ['tu', 'usted', 'vosotros'], 'tu aksansız yazılınca “senin” demektir.'),
    q.mc('İspanya’da bir grup arkadaşa “siz” derken:', 'vosotros', ['ustedes', 'ellos', 'nosotros']),
    q.mc('Ana y María → ?', 'ellas', ['ellos', 'nosotras', 'ustedes'])
  ],
  questions: [
    q.mc('Resmî “siz” (tek kişi):', 'usted', ['tú', 'vosotros', 'él']),
    q.mc('Carlos y Ana → ?', 'ellos', ['ellas', 'nosotros', 'vosotras'], 'Grupta bir erkek varsa eril çoğul kullanılır.'),
    q.fill('___ soy estudiante. (ben)', ['Yo']),
    q.fill('___ eres mi amigo. (sen)', ['Tú'], 'Zamir olan tú aksanlıdır.'),
    q.fill('___ somos de Turquía. (biz, erkekler)', ['Nosotros']),
    q.trEs('Onlar (kadınlar) öğrenci.', ['Ellas son estudiantes']),
    q.esTr('Usted es muy amable.', 'Siz çok naziksiniz.', ['Sen çok naziksin.', 'Onlar çok nazik.'], 'usted resmî “siz”dir; fiil 3. tekil çekilir.'),
    q.order('Vosotros sois mis amigos.'),
    q.fix('Tu eres español.', ['Tú eres español.'], 'Özne zamiri tú aksanlıdır.', true)
  ]
};
