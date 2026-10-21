import type { GrammarTopic } from '@/types/content';
import { questions } from './helpers';
const q = questions('adjetivos');

export const adjetivos: GrammarTopic = {
  id: 'adjetivos', level: 'A1', title: 'Sıfatlar ve uyum',
  summary: 'Sıfat, nitelediği ismin cinsiyetine ve sayısına uyar; genelde ismin arkasına gelir: una casa blanca (beyaz bir ev).',
  table: { headers: ['Sıfat türü', 'Tekil', 'Çoğul'], rows: [
    ['-o (eril)', 'el gato negro', 'los gatos negros'],
    ['-o → -a (dişil)', 'la casa blanca', 'las casas blancas'],
    ['-e (değişmez)', 'un chico inteligente / una chica inteligente', 'chicos inteligentes'],
    ['ünsüz (değişmez)', 'un coche azul / una casa azul', 'coches azules']
  ] },
  usage: [
    'Sıfat çoğunlukla isimden sonra gelir: un libro interesante.',
    'bueno ve malo eril tekil ismin önünde kısalır: un buen libro, un mal día.',
    'Renkler de uyum yapar: la casa roja, los coches rojos.'
  ],
  examples: [
    { es: 'Tengo un coche rojo.', tr: 'Kırmızı bir arabam var.' },
    { es: 'Las casas son blancas.', tr: 'Evler beyaz.' },
    { es: 'Es un buen amigo.', tr: 'İyi bir arkadaş.' }
  ],
  check: [
    q.mc('la casa ___ (beyaz)', 'blanca', ['blanco', 'blancas', 'blancos']),
    q.mc('los perros ___ (siyah)', 'negros', ['negro', 'negras', 'negra']),
    q.fill('una chica ___ (zeki)', ['inteligente'])
  ],
  questions: [
    q.fill('Mi habitación es ___. (küçük)', ['pequeña']),
    q.fill('Los tomates son ___. (kırmızı)', ['rojos']),
    q.fill('Tengo dos camisetas ___. (mavi)', ['azules']),
    q.mc('Es un ___ libro.', 'buen', ['bueno', 'buena', 'buenos'], 'bueno, eril tekil ismin önünde buen olur.'),
    q.fix('La casa es blanco.', ['La casa es blanca.'], 'casa dişil → blanca.'),
    q.fix('Tengo un gato negra.', ['Tengo un gato negro.']),
    q.order('Tengo una bicicleta nueva.'),
    q.trEs('Kırmızı bir arabam var.', ['Tengo un coche rojo', 'Tengo un carro rojo']),
    q.esTr('Las chicas son muy simpáticas.', 'Kızlar çok sempatik.', ['Kız çok sempatik.', 'Kızlar sempatik değil.']),
    q.trEs('Ev büyük ve güzel.', ['La casa es grande y bonita'])
  ]
};
