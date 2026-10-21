import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('ser-estar');

export const serEstar: GrammarTopic = {
  id: 'ser-estar', level: 'A1', title: 'Ser mi, estar mı?',
  summary: 'İkisi de “olmak”. Kabaca: ser bir şeyin NE olduğunu, estar NASIL ya da NEREDE olduğunu söyler.',
  table: { headers: ['', 'ser', 'estar'], rows: [
    ['Ne için', 'kimlik, meslek, köken, karakter, saat', 'yer, geçici durum, duygu, sağlık'],
    ['Örnek', 'Soy alto. (uzun boyluyum)', 'Estoy cansado. (yorgunum)'],
    ['Örnek', 'Es de Madrid. (Madridli)', 'Está en Madrid. (Madrid’de)'],
    ['Örnek', 'Es aburrido. (sıkıcı biri)', 'Está aburrido. (sıkılmış)']
  ] },
  usage: [
    'Kalıcı ya da tanımlayıcı → ser; geçici ya da bir değişimin sonucu → estar.',
    'Bir yerde olmak her zaman estar: Estoy en clase.',
    'Bazı sıfatlar anlam değiştirir: ser aburrido (sıkıcı) / estar aburrido (sıkılmış); ser listo (zeki) / estar listo (hazır).'
  ],
  examples: [
    { es: 'Es profesor, pero hoy está enfermo.', tr: 'Öğretmen ama bugün hasta.' },
    { es: 'La sopa está caliente.', tr: 'Çorba sıcak.' },
    { es: 'Mi casa es grande y está cerca.', tr: 'Evim büyük ve yakında.' }
  ],
  check: [
    q.mc('Yo ___ de Turquía.', 'soy', ['estoy', 'es', 'estás']),
    q.mc('Ahora ___ en el trabajo.', 'estoy', ['soy', 'es', 'hay']),
    q.mc('María ___ muy simpática.', 'es', ['está', 'son', 'estás'])
  ],
  questions: [
    q.mc('La película ___ aburrida. (film sıkıcı)', 'es', ['está', 'son', 'estamos'], 'Bir şeyin özelliği: ser.'),
    q.mc('Hoy ___ aburrido en casa. (sıkıldım)', 'estoy', ['soy', 'es', 'está'], 'Şu anki his: estar.'),
    q.fill('El museo ___ en el centro.', ['está']),
    q.fill('Mi hermano ___ médico.', ['es']),
    q.fill('Nosotros ___ muy cansados hoy.', ['estamos']),
    q.fill('___ las cinco de la tarde.', ['Son']),
    q.fix('Estoy de Estambul.', ['Soy de Estambul.'], 'Köken: ser de.'),
    q.fix('La sopa es caliente hoy.', ['La sopa está caliente hoy.'], 'Şu anki durum: estar.'),
    q.mc('“La cena ___ lista.” (yemek hazır)', 'está', ['es', 'son', 'hay'], 'estar listo = hazır olmak; ser listo = zeki olmak.'),
    q.trEs('Ana yorgun.', ['Ana está cansada']),
    q.esTr('Mi casa es grande y está cerca.', 'Evim büyük ve yakında.', ['Evim büyük ve uzakta.', 'Evim büyük olacak.'])
  ]
};
