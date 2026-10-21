import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('hora');

export const hora: GrammarTopic = {
  id: 'hora', level: 'A1', title: 'Saat',
  summary: 'Saat ser ile söylenir: Es la una (saat bir), Son las dos (saat iki). Çeyrek için cuarto, buçuk için media; yarımdan sonra bir sonraki saatten menos ile geri sayılır.',
  table: { headers: ['Saat', 'İspanyolca'], rows: [
    ['1:00', 'Es la una.'],
    ['3:00', 'Son las tres.'],
    ['3:10', 'Son las tres y diez.'],
    ['3:15', 'Son las tres y cuarto.'],
    ['3:30', 'Son las tres y media.'],
    ['3:45', 'Son las cuatro menos cuarto.'],
    ['3:50', 'Son las cuatro menos diez.'],
    ['20:00', 'Son las ocho de la tarde.']
  ] },
  usage: [
    'Saat 1 tekil (Es la una), diğerleri çoğul (Son las…).',
    '“Kaçta?” = ¿A qué hora…? → A las nueve.',
    'Günlük konuşmada 12 saat + de la mañana / de la tarde / de la noche.'
  ],
  examples: [
    { es: '¿Qué hora es? —Son las diez y media.', tr: 'Saat kaç? —On buçuk.' },
    { es: 'La clase es a las nueve.', tr: 'Ders saat dokuzda.' },
    { es: 'Me acuesto a las once de la noche.', tr: 'Gece on birde yatarım.' }
  ],
  check: [
    q.mc('1:00', 'Es la una.', ['Son la una.', 'Es las una.', 'Son las uno.']),
    q.mc('5:30', 'Son las cinco y media.', ['Son las cinco y cuarto.', 'Son las seis menos media.', 'Es la cinco y media.']),
    q.fill('¿A qué hora? —___ las ocho.', ['A'])
  ],
  questions: [
    q.mc('7:15', 'Son las siete y cuarto.', ['Son las siete y media.', 'Son las siete menos cuarto.', 'Son las ocho menos cuarto.']),
    q.mc('8:45', 'Son las nueve menos cuarto.', ['Son las ocho menos cuarto.', 'Son las ocho y cuarto.', 'Son las nueve y cuarto.']),
    q.mc('10:50', 'Son las once menos diez.', ['Son las diez menos diez.', 'Es la once menos diez.', 'Son las once y diez.']),
    q.fill('2:20 → Son las dos y ___.', ['veinte']),
    q.fill('12:30 → Son las doce y ___.', ['media']),
    q.fix('Son la una y media.', ['Es la una y media.'], 'Saat 1 tekildir: es la una.'),
    q.fix('Es las cuatro.', ['Son las cuatro.']),
    q.order('La película empieza a las nueve.'),
    q.trEs('Saat yedide kalkıyorum.', ['Me levanto a las siete', 'Yo me levanto a las siete']),
    q.esTr('Son las seis menos cuarto.', 'Saat altıya çeyrek var.', ['Saat altıyı çeyrek geçiyor.', 'Saat altı buçuk.'])
  ]
};
