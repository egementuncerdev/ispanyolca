import type { GrammarTopic } from '@/types/content';
import { persons, questions } from './helpers';
const q = questions('ser');

export const ser: GrammarTopic = {
  id: 'ser', level: 'A1', title: 'Ser',
  summary: 'Ser “olmak” demektir ve kalıcı ya da tanımlayıcı özellikler için kullanılır: kimlik, meslek, milliyet, köken, karakter, saat ve tarih. Düzensiz bir fiildir.',
  table: { caption: 'Ser — presente', headers: ['Kişi', 'ser'], rows: persons(['soy', 'eres', 'es', 'somos', 'sois', 'son']) },
  usage: [
    'Kimlik ve isim: Soy Egemen.',
    'Meslek: Mi madre es profesora.',
    'Milliyet ve köken: Somos turcos. / Soy de Estambul.',
    'Karakter ve görünüş: Eres muy simpático. / Es alto.',
    'Saat ve tarih: Son las tres. / Hoy es lunes.'
  ],
  examples: [
    { es: 'Soy de Estambul.', tr: 'İstanbulluyum.' },
    { es: 'Mi madre es profesora.', tr: 'Annem öğretmen.' },
    { es: 'Son las tres.', tr: 'Saat üç.' }
  ],
  notes: ['Meslek söylerken artikel kullanılmaz: Soy estudiante (✗ Soy un estudiante).'],
  check: [
    q.fill('Yo ___ estudiante.', ['soy']),
    q.mc('Nosotros ___ de Turquía.', 'somos', ['son', 'sois', 'estamos']),
    q.fill('¿De dónde ___ tú?', ['eres'])
  ],
  questions: [
    q.fill('Ellos ___ mis primos.', ['son']),
    q.fill('Vosotros ___ muy simpáticos.', ['sois']),
    q.fill('Mi padre ___ ingeniero.', ['es']),
    q.mc('Saat üç: “___ las tres.”', 'Son', ['Es', 'Están', 'Hay'], 'Saat 1 için “Es la una”, diğerleri için “Son las…”.'),
    q.fix('Yo es profesor.', ['Yo soy profesor.', 'Soy profesor.']),
    q.fix('Soy un estudiante.', ['Soy estudiante.'], 'Meslek ve statüde artikel kullanılmaz.'),
    q.order('Mi hermana es muy inteligente.'),
    q.trEs('Ben Türküm.', ['Soy turco', 'Soy turca', 'Yo soy turco', 'Yo soy turca']),
    q.esTr('Somos de Madrid.', 'Madrid’liyiz.', ['Madrid’deyiz.', 'Madrid’e gidiyoruz.'], '“Ser de” köken bildirir; bir yerde olmak için estar kullanılır.'),
    q.trEs('Sen çok sempatiksin.', ['Eres muy simpático', 'Eres muy simpática', 'Tú eres muy simpático', 'Tú eres muy simpática'])
  ]
};
