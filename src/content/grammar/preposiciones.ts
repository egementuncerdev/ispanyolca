import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('preposiciones');

export const preposiciones: GrammarTopic = {
  id: 'preposiciones', level: 'A1', title: 'Temel edatlar',
  summary: 'Türkçedeki -e, -de, -den, ile, için gibi ekler İspanyolcada kelimenin önüne gelen edatlarla söylenir: a Madrid (Madrid’e), en casa (evde), de Turquía (Türkiye’den).',
  table: { headers: ['Edat', 'Anlam', 'Örnek'], rows: [
    ['a', '-e / -a; saatte', 'Voy a Madrid. · a las ocho'],
    ['de', '-in; -den; -li', 'el coche de Ana · Soy de Turquía.'],
    ['en', '-de / -da, içinde; (taşıtla)', 'Estoy en casa. · en autobús'],
    ['con', 'ile', 'café con leche'],
    ['sin', '-sız, olmadan', 'café sin azúcar'],
    ['para', 'için', 'Es para ti.'],
    ['cerca de / lejos de', 'yakınında / uzağında', 'Vivo cerca del centro.'],
    ['al lado de', 'yanında', 'El banco está al lado del hotel.'],
    ['entre', 'arasında', 'entre la farmacia y el bar']
  ] },
  usage: [
    'Kaynaşma: a + el = al, de + el = del → Voy al cine. / cerca del centro.',
    'Taşıtlarla en: en tren, en coche (ama yürüyerek: a pie).',
    'con + mí = conmigo, con + ti = contigo.'
  ],
  examples: [
    { es: 'Voy a la universidad en autobús.', tr: 'Üniversiteye otobüsle gidiyorum.' },
    { es: 'Un café con leche y sin azúcar, por favor.', tr: 'Şekersiz bir sütlü kahve, lütfen.' },
    { es: 'El regalo es para ti.', tr: 'Hediye senin için.' }
  ],
  check: [
    q.mc('Voy ___ Madrid.', 'a', ['en', 'de', 'con']),
    q.mc('Estoy ___ casa.', 'en', ['a', 'de', 'con']),
    q.fill('Un café ___ leche. (ile)', ['con'])
  ],
  questions: [
    q.fill('Soy ___ Estambul.', ['de']),
    q.fill('Voy al trabajo ___ metro.', ['en']),
    q.fill('Un té ___ azúcar, por favor. (-sız)', ['sin']),
    q.fill('Este regalo es ___ ti. (için)', ['para']),
    q.fill('La clase empieza ___ las nueve.', ['a']),
    q.mc('¿Vienes ___? (benimle)', 'conmigo', ['con mí', 'con yo', 'con me']),
    q.fix('Voy a el cine con Ana.', ['Voy al cine con Ana.'], 'a + el = al.'),
    q.fix('El coche del Ana es rojo.', ['El coche de Ana es rojo.'], 'del = de + el; isimde artikel yoksa yalnız de.'),
    q.order('La farmacia está al lado del banco.'),
    q.trEs('İşe otobüsle gidiyorum.', ['Voy al trabajo en autobús', 'Voy a trabajar en autobús'])
  ]
};
