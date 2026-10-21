import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('genero');

export const genero: GrammarTopic = {
  id: 'genero', level: 'A1', title: 'Eril ve dişil',
  summary: 'Her isim ya eril ya dişildir. -o ile bitenler genelde eril, -a ile bitenler genelde dişil; ama istisnalar var. En güvenlisi kelimeyi artikeliyle öğrenmek: la casa, el día.',
  table: { headers: ['Kural', 'Örnek', 'Cinsiyet'], rows: [
    ['-o', 'el libro, el perro', 'eril'],
    ['-a', 'la casa, la mesa', 'dişil'],
    ['-ción, -dad, -tad', 'la estación, la ciudad', 'dişil'],
    ['-or, -aje', 'el color, el viaje', 'eril'],
    ['-e ya da ünsüz', 'el coche / la calle · el pan / la sal', 'ikisi de olabilir'],
    ['İstisnalar', 'el día, el mapa, el problema · la mano, la foto', '—']
  ] },
  usage: [
    'İnsanlarda cinsiyete göre: el profesor / la profesora, el amigo / la amiga.',
    '-e ile biten bazı isimler değişmez, yalnız artikel değişir: el estudiante / la estudiante.',
    '-e ya da ünsüzle bitenleri artikeliyle ezberle: la noche, el tren.'
  ],
  examples: [
    { es: 'El día es largo.', tr: 'Gün uzun.' },
    { es: 'La ciudad es bonita.', tr: 'Şehir güzel.' },
    { es: 'La profesora es simpática.', tr: 'Öğretmen (kadın) sempatik.' }
  ],
  check: [
    q.mc('___ libro', 'el', ['la']),
    q.mc('___ ciudad', 'la', ['el'], '-dad ile bitenler dişildir.'),
    q.mc('___ día', 'el', ['la'], 'día -a ile bitse de erildir.')
  ],
  questions: [
    q.mc('___ estación', 'la', ['el'], '-ción ile bitenler dişildir.'),
    q.mc('___ problema', 'el', ['la'], 'problema bir istisnadır: eril.'),
    q.mc('___ mano', 'la', ['el'], 'mano bir istisnadır: dişil.'),
    q.mc('___ color', 'el', ['la'], '-or ile bitenler genelde erildir.'),
    q.fill('Mi tío es médico y mi tía es ___. (doktor)', ['médica']),
    q.fill('El profesor y ___ profesora.', ['la']),
    q.fix('La mapa está en la mesa.', ['El mapa está en la mesa.']),
    q.fix('El foto es bonita.', ['La foto es bonita.'], 'foto (fotografía’nın kısası) dişildir.'),
    q.order('La ciudad es muy bonita.'),
    q.trEs('Gün uzun.', ['El día es largo'])
  ]
};
