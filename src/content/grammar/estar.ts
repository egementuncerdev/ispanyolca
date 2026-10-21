import type { GrammarTopic } from '@/types/content';
import { persons, questions } from './helpers';
const q = questions('estar');

export const estar: GrammarTopic = {
  id: 'estar', level: 'A1', title: 'Estar',
  summary: 'Estar da “olmak” demektir ama geçici durumlar, duygular ve yer/konum için kullanılır. Düzensiz bir fiildir; çoğu biçimi aksanlıdır.',
  table: { caption: 'Estar — presente', headers: ['Kişi', 'estar'], rows: persons(['estoy', 'estás', 'está', 'estamos', 'estáis', 'están']) },
  usage: [
    'Yer ve konum: Estoy en casa. / Madrid está en España.',
    'Geçici durum: Estoy cansado. / La puerta está abierta.',
    'Duygu: Estamos contentos.',
    'Hal hatır: ¿Cómo estás? —Estoy bien.'
  ],
  examples: [
    { es: 'Estoy en casa.', tr: 'Evdeyim.' },
    { es: '¿Cómo estás? —Bien, gracias.', tr: 'Nasılsın? —İyiyim, teşekkürler.' },
    { es: 'La tienda está cerrada.', tr: 'Dükkân kapalı.' }
  ],
  notes: ['Aksan anlamı değiştirir: esta (bu) ≠ está (o … -de / … durumda).'],
  check: [
    q.fill('Yo ___ en casa.', ['estoy']),
    q.mc('¿Cómo ___ tú?', 'estás', ['eres', 'está', 'estáis']),
    q.fill('Madrid ___ en España.', ['está'])
  ],
  questions: [
    q.fill('Nosotros ___ cansados.', ['estamos']),
    q.fill('¿Dónde ___ mis llaves?', ['están']),
    q.fill('Vosotros ___ en la playa.', ['estáis']),
    q.mc('Kahve soğumuş: “El café ___ frío.”', 'está', ['es', 'esta', 'hay']),
    q.fix('Yo soy en la oficina.', ['Yo estoy en la oficina.', 'Estoy en la oficina.'], 'Yer bildirirken estar kullanılır.'),
    q.fix('Ella esta triste.', ['Ella está triste.'], 'Fiil olan está aksanlıdır.', true),
    q.order('Mis padres están en Madrid.'),
    q.trEs('Evdeyim.', ['Estoy en casa', 'Yo estoy en casa']),
    q.esTr('La farmacia está cerrada.', 'Eczane kapalı.', ['Eczane kapanıyor.', 'Eczane uzakta.']),
    q.trEs('Bugün mutluyum.', ['Hoy estoy contento', 'Hoy estoy contenta', 'Estoy contento hoy', 'Estoy contenta hoy'])
  ]
};
