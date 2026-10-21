import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('numeros');

export const numeros: GrammarTopic = {
  id: 'numeros', level: 'A1', title: 'Sayılar (0–100)',
  summary: '0–15 ezberlenir; 16–29 tek kelimedir (dieciséis, veintiuno); 31’den sonra onlar + y + birler yazılır (treinta y uno).',
  table: { headers: ['Aralık', 'İspanyolca'], rows: [
    ['0–10', 'cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez'],
    ['11–15', 'once, doce, trece, catorce, quince'],
    ['16–19', 'dieciséis, diecisiete, dieciocho, diecinueve'],
    ['20–29', 'veinte, veintiuno, veintidós, veintitrés … veintinueve'],
    ['30–90', 'treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa'],
    ['31, 45 …', 'treinta y uno, cuarenta y cinco'],
    ['100', 'cien (101: ciento uno)']
  ] },
  usage: [
    'uno, eril isimden önce un olur: un libro, veintiún años; dişil isimden önce una: veintiuna personas.',
    'cien tam yüzdür; 101’den itibaren ciento: ciento veinte.',
    'Yaş tener ile: Tengo treinta años.'
  ],
  examples: [
    { es: 'Tengo veintiún años.', tr: 'Yirmi bir yaşındayım.' },
    { es: 'Mi abuelo tiene setenta y dos años.', tr: 'Dedem yetmiş iki yaşında.' },
    { es: 'Son cuarenta euros.', tr: 'Kırk avro.' }
  ],
  check: [
    q.mc('17', 'diecisiete', ['diezsiete', 'dieciséte', 'setenta']),
    q.mc('35', 'treinta y cinco', ['treintaicinco', 'treinta cinco', 'trescinco']),
    q.fill('22 = ___', ['veintidós'])
  ],
  questions: [
    q.fill('14 = ___', ['catorce']),
    q.fill('50 = ___', ['cincuenta']),
    q.mc('100 kişi: ___ personas', 'cien', ['ciento', 'cientos', 'cienta']),
    q.mc('21 yaşındayım: Tengo ___ años.', 'veintiún', ['veintiuno', 'veinte y uno', 'veintiuna'], 'uno, eril isimden önce un olur.'),
    q.fill('48 = cuarenta y ___', ['ocho']),
    q.fill('16 = ___', ['dieciséis']),
    q.fix('Tengo veinte y tres años.', ['Tengo veintitrés años.'], '21–29 tek kelimeyle yazılır.'),
    q.order('Mi padre tiene cuarenta y cinco años.'),
    q.trEs('On beş avro.', ['Quince euros', 'Son quince euros']),
    q.esTr('Hay setenta estudiantes.', '70 öğrenci var.', ['17 öğrenci var.', '60 öğrenci var.'])
  ]
};
