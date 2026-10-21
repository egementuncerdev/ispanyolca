import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('posesivos');

export const posesivos: GrammarTopic = {
  id: 'posesivos', level: 'A1', title: 'İyelik sıfatları',
  summary: 'İyelik sıfatı (benim, senin…) ismin önüne gelir. Sahibine göre değil, sahip olunan şeye göre çoğul olur: mis libros (kitaplarım). nuestro ve vuestro cinsiyete de uyar.',
  table: { headers: ['Kişi', 'Tekil', 'Çoğul'], rows: [
    ['yo (benim)', 'mi casa', 'mis casas'],
    ['tú (senin)', 'tu casa', 'tus casas'],
    ['él / ella / usted', 'su casa', 'sus casas'],
    ['nosotros (bizim)', 'nuestro piso · nuestra casa', 'nuestros pisos · nuestras casas'],
    ['vosotros (sizin)', 'vuestro piso · vuestra casa', 'vuestros pisos · vuestras casas'],
    ['ellos / ustedes', 'su casa', 'sus casas']
  ] },
  usage: [
    'tu (senin) aksansız, tú (sen) aksanlı.',
    'su birkaç anlama gelir: onun, onların, sizin (usted/ustedes). Belirsizse: la casa de Ana.',
    'Sayı sahip olunan şeye göre: Carlos y Ana tienen un perro → su perro.'
  ],
  examples: [
    { es: 'Mi hermano se llama Toprak.', tr: 'Kardeşimin adı Toprak.' },
    { es: '¿Dónde están tus llaves?', tr: 'Anahtarların nerede?' },
    { es: 'Nuestra casa es pequeña.', tr: 'Evimiz küçük.' }
  ],
  check: [
    q.mc('___ casa (benim)', 'mi', ['mí', 'me', 'mis']),
    q.mc('___ amigos (senin)', 'tus', ['tu', 'tú', 'tuyos']),
    q.mc('___ familia (bizim)', 'nuestra', ['nuestro', 'nuestros', 'nosotros'])
  ],
  questions: [
    q.fill('___ padres viven en Estambul. (benim)', ['Mis']),
    q.fill('¿Cómo se llama ___ hermana? (senin)', ['tu']),
    q.fill('Ana y ___ novio. (onun)', ['su']),
    q.fill('___ piso es muy grande. (bizim)', ['Nuestro']),
    q.fill('¿Dónde está ___ casa? (sizin, vosotros)', ['vuestra']),
    q.mc('Carlos y Elena tienen un perro. ___ perro es negro.', 'Su', ['Sus', 'Suyo', 'Nuestro'], 'Sahibi çoğul olsa da perro tekil → su.'),
    q.fix('Mis hermano es alto.', ['Mi hermano es alto.']),
    q.fix('Nuestro casa es pequeña.', ['Nuestra casa es pequeña.'], 'nuestro, casa (dişil) ile uyum yapar.'),
    q.order('Mi madre trabaja en un hospital.'),
    q.trEs('Anahtarlarım nerede?', ['¿Dónde están mis llaves?'])
  ]
};
