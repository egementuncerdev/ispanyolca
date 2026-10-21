import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('verbos-ir');

export const verbosIr: GrammarTopic = {
  id: 'verbos-ir', level: 'A1', title: '-IR fiilleri',
  summary: '-ir fiillerinin ekleri -er fiilleriyle neredeyse aynıdır; yalnız nosotros (-imos) ve vosotros (-ís) farklıdır: vivir → vivimos, vivís.',
  table: { caption: 'vivir (yaşamak)', headers: ['Kişi', 'Ek', 'vivir'], rows: [
    ['yo', '-o', 'vivo'], ['tú', '-es', 'vives'], ['él / ella / usted', '-e', 'vive'],
    ['nosotros/as', '-imos', 'vivimos'], ['vosotros/as', '-ís', 'vivís'], ['ellos / ellas / ustedes', '-en', 'viven']
  ] },
  usage: [
    'comer → comemos ama vivir → vivimos.',
    'Aynı kalıptaki fiiller: escribir, abrir, recibir, compartir, subir.'
  ],
  examples: [
    { es: 'Vivo en Estambul.', tr: 'İstanbul’da yaşıyorum.' },
    { es: '¿Dónde vives?', tr: 'Nerede yaşıyorsun?' },
    { es: 'Escribimos un correo.', tr: 'Bir e-posta yazıyoruz.' }
  ],
  check: [
    q.fill('Yo ___ (vivir) en Estambul.', ['vivo']),
    q.mc('Nosotros ___ (vivir) cerca.', 'vivimos', ['vivemos', 'viven', 'vivís']),
    q.fill('Vosotros ___ (escribir) mucho.', ['escribís'])
  ],
  questions: [
    q.fill('Ella ___ (abrir) la ventana.', ['abre']),
    q.fill('¿Tú ___ (escribir) a tu abuela?', ['escribes']),
    q.fill('Ellos ___ (recibir) muchos mensajes.', ['reciben']),
    q.fill('Nosotros ___ (compartir) un piso.', ['compartimos']),
    q.mc('comer → comemos, vivir → ___', 'vivimos', ['vivemos', 'vivamos', 'vivís']),
    q.fix('Nosotros vivemos en Madrid.', ['Nosotros vivimos en Madrid.', 'Vivimos en Madrid.']),
    q.fix('Vosotros escribéis bien.', ['Vosotros escribís bien.', 'Escribís bien.']),
    q.order('Mis abuelos viven en un pueblo.'),
    q.trEs('Nerede yaşıyorsun?', ['¿Dónde vives?', '¿Dónde vives tú?']),
    q.esTr('La tienda abre a las diez.', 'Dükkân saat onda açılıyor.', ['Dükkân saat onda kapanıyor.', 'Dükkân on dakika açık.'])
  ]
};
