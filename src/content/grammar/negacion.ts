import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('negacion');

export const negacion: GrammarTopic = {
  id: 'negacion', level: 'A1', title: 'Olumsuz cümle',
  summary: 'Olumsuz yapmak için fiilin önüne no koymak yeter: No hablo francés. İspanyolcada çift olumsuz normaldir: No tengo nada (hiçbir şeyim yok).',
  table: { headers: ['Olumlu', 'Olumsuz'], rows: [
    ['Hablo inglés.', 'No hablo inglés.'],
    ['Es caro.', 'No es caro.'],
    ['Me levanto temprano.', 'No me levanto temprano.'],
    ['Tengo algo.', 'No tengo nada.'],
    ['Viene alguien.', 'No viene nadie.']
  ] },
  usage: [
    'no fiilden ve me, te, se gibi zamirlerden önce gelir: No me gusta.',
    'nada (hiçbir şey), nadie (hiç kimse), nunca (asla) fiilden sonra gelirse önde no gerekir: No como nunca carne.',
    'nunca fiilden önce gelirse no kullanılmaz: Nunca como carne.'
  ],
  examples: [
    { es: 'No soy de Madrid.', tr: 'Madridli değilim.' },
    { es: 'No me gusta el café.', tr: 'Kahveyi sevmem.' },
    { es: 'No hay nadie en casa.', tr: 'Evde kimse yok.' }
  ],
  check: [
    q.mc('“İngilizce konuşmuyorum.”', 'No hablo inglés.', ['Hablo no inglés.', 'No inglés hablo.', 'Hablo inglés no.']),
    q.fill('___ tengo hambre. (değil)', ['No']),
    q.mc('“Hiçbir şey yemiyorum.”', 'No como nada.', ['Como nada.', 'No como algo.', 'Nada no como.'])
  ],
  questions: [
    q.fix('Yo hablo no francés.', ['Yo no hablo francés.', 'No hablo francés.'], 'no fiilden önce gelir.'),
    q.fix('Me no gusta el té.', ['No me gusta el té.'], 'no, me/te/se zamirlerinden de önce gelir.'),
    q.fill('No hay ___ en la oficina. (hiç kimse)', ['nadie']),
    q.fill('No como carne ___. (asla)', ['nunca']),
    q.mc('Doğru cümle hangisi?', 'Nunca bebo café.', ['No nunca bebo café.', 'Bebo nunca café.', 'Nunca no bebo café.']),
    q.order('No vivo en el centro.'),
    q.order('Mi hermano no tiene coche.'),
    q.trEs('Madridli değilim.', ['No soy de Madrid', 'Yo no soy de Madrid']),
    q.trEs('Evde kimse yok.', ['No hay nadie en casa']),
    q.esTr('No tengo nada.', 'Hiçbir şeyim yok.', ['Her şeyim var.', 'Bir şeyim var mı?'])
  ]
};
