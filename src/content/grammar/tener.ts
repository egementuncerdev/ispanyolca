import type { GrammarTopic } from '@/types/content';
import { persons, questions } from './helpers';
const q = questions('tener');

export const tener: GrammarTopic = {
  id: 'tener', level: 'A1', title: 'Tener ve yaş',
  summary: 'Tener “sahip olmak” demektir; Türkçedeki “…-im var” yapısının karşılığı. Yaş da tener ile söylenir: Tengo veinte años (yirmi yaşındayım).',
  table: { caption: 'Tener — presente', headers: ['Kişi', 'tener'], rows: persons(['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen']) },
  usage: [
    'Sahiplik: Tengo un perro.',
    'Aile: Tengo dos hermanos.',
    'Yaş: ¿Cuántos años tienes? —Tengo veinticinco años.',
    'Kalıplar: tener hambre (aç olmak), tener sed (susamak), tener frío / calor (üşümek / sıcaklamak), tener sueño (uykusu gelmek).',
    'Zorunluluk: tener que + mastar → Tengo que estudiar (ders çalışmam lazım).'
  ],
  examples: [
    { es: 'Tengo un gato negro.', tr: 'Siyah bir kedim var.' },
    { es: '¿Cuántos años tienes? —Tengo veinticinco años.', tr: 'Kaç yaşındasın? —Yirmi beş yaşındayım.' },
    { es: 'Tengo que estudiar.', tr: 'Ders çalışmam lazım.' }
  ],
  notes: ['Yaş için ser kullanılmaz: ✗ Soy 25 años → ✓ Tengo 25 años.'],
  check: [
    q.fill('Yo ___ dos hermanos.', ['tengo']),
    q.mc('¿Cuántos años ___ tú?', 'tienes', ['eres', 'tenes', 'tiene']),
    q.mc('Mi abuela ___ ochenta años.', 'tiene', ['es', 'está', 'tienen'])
  ],
  questions: [
    q.fill('Nosotros ___ un perro.', ['tenemos']),
    q.fill('Vosotros ___ mucha suerte.', ['tenéis']),
    q.fill('Ellos ___ una casa en la playa.', ['tienen']),
    q.fix('Soy veinte años.', ['Tengo veinte años.'], 'Yaş tener ile söylenir.'),
    q.mc('Acıktım:', 'Tengo hambre.', ['Soy hambre.', 'Estoy hambre.', 'Hay hambre.']),
    q.mc('Üşüyorum:', 'Tengo frío.', ['Soy frío.', 'Hace frío.', 'Estoy frío.'], '“Hace frío” havanın soğuk olduğunu söyler; üşümek tener frío.'),
    q.fill('Tengo ___ trabajar mañana. (-mek zorundayım)', ['que']),
    q.order('¿Cuántos años tiene tu hermana?'),
    q.trEs('Bir kedim var.', ['Tengo un gato', 'Yo tengo un gato']),
    q.trEs('On sekiz yaşındayım.', ['Tengo dieciocho años', 'Tengo 18 años', 'Yo tengo dieciocho años']),
    q.esTr('Tenemos que estudiar.', 'Ders çalışmamız lazım.', ['Ders çalışıyoruz.', 'Ders çalışmak istiyoruz.'])
  ]
};
