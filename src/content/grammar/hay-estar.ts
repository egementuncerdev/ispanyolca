import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('hay-estar');

export const hayEstar: GrammarTopic = {
  id: 'hay-estar', level: 'A1', title: 'Hay mi, estar mı?',
  summary: 'Hay “var” demektir; bir şeyin varlığını söyler ve tekilde de çoğulda da aynıdır. Estar ise bilinen, belirli bir şeyin nerede olduğunu söyler.',
  table: { headers: ['', 'hay', 'estar'], rows: [
    ['Anlam', 'var (varlık)', '-de / -da (konum)'],
    ['Ardından', 'un / una, sayı ya da artikelsiz isim', 'el / la / los / las, mi / tu…'],
    ['Örnek', 'Hay un banco en la calle.', 'El banco está en la calle Mayor.'],
    ['Örnek', 'Hay dos farmacias aquí.', 'Las farmacias están cerca.']
  ] },
  usage: [
    'hay + belirsiz artikel, sayı ya da artikelsiz isim: Hay leche. / Hay tres sillas.',
    'estar + belirli bir şey: La leche está en la nevera.',
    'Soru: ¿Hay un supermercado por aquí? · Olumsuz: No hay pan.'
  ],
  examples: [
    { es: 'Hay un parque cerca de mi casa.', tr: 'Evimin yakınında bir park var.' },
    { es: 'El parque está al lado del museo.', tr: 'Park müzenin yanında.' },
    { es: '¿Hay leche en la nevera?', tr: 'Buzdolabında süt var mı?' }
  ],
  check: [
    q.mc('___ un hospital cerca. (var)', 'Hay', ['Está', 'Es', 'Están']),
    q.mc('El hospital ___ cerca.', 'está', ['hay', 'es', 'están']),
    q.fill('En mi calle ___ dos tiendas.', ['hay'])
  ],
  questions: [
    q.mc('Mis llaves ___ en la mesa.', 'están', ['hay', 'son', 'está']),
    q.mc('___ muchos turistas en Madrid.', 'Hay', ['Están', 'Son', 'Es']),
    q.fill('¿___ una farmacia por aquí?', ['Hay']),
    q.fill('La farmacia ___ al lado del banco.', ['está']),
    q.fill('No ___ leche en la nevera.', ['hay']),
    q.fix('Está un museo en la plaza.', ['Hay un museo en la plaza.'], 'Belirsiz bir şeyin varlığı: hay.'),
    q.fix('Hay el banco en la calle Mayor.', ['El banco está en la calle Mayor.'], 'Belirli bir şeyin konumu: estar.'),
    q.order('Hay un parque cerca de mi casa.'),
    q.trEs('Buralarda süpermarket var mı?', ['¿Hay un supermercado por aquí?']),
    q.esTr('Hay tres sillas en la cocina.', 'Mutfakta üç sandalye var.', ['Sandalyeler mutfakta.', 'Mutfakta sandalye yok.'])
  ]
};
