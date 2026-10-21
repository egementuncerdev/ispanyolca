/* A1 mini hikâyeler: biraz daha uzun, diyaloglu. Kurallar metinlerle aynı. */
import type { Reading } from '@/types/content';
import { questions } from '../grammar/helpers';

const P = (es: string, tr: string) => ({ es, tr });

const s1 = questions('okuma-la-llave');
export const laLlave: Reading = {
  id: 'la-llave', level: 'A1', topic: 'ev', kind: 'story',
  title: '¿Dónde está la llave?', titleTr: 'Anahtar nerede?',
  names: ['Pablo'],
  glossary: { mañana: 'manana-sabah', cocina: 'cocina' },
  paragraphs: [
    P('Son las ocho de la mañana. Pablo necesita salir de casa ahora, porque empieza a trabajar a las nueve.',
      'Sabahın sekizi. Pablo’nun hemen evden çıkması gerekiyor, çünkü saat dokuzda işe başlıyor.'),
    P('Pero hay un problema: no encuentra la llave.',
      'Ama bir sorun var: anahtarı bulamıyor.'),
    P('Mira en la mesa del salón: no está. Mira en la cocina y en el baño: no está.',
      'Oturma odasındaki masaya bakıyor: yok. Mutfağa ve banyoya bakıyor: yok.'),
    P('Mira en el dormitorio, en la cama y en el armario. ¡Nada!',
      'Yatak odasına, yatağa ve dolaba bakıyor. Hiçbir şey!'),
    P('Pablo habla por teléfono con su madre: —Mamá, no encuentro la llave de casa.',
      'Pablo annesiyle telefonda konuşuyor: “Anne, evin anahtarını bulamıyorum.”'),
    P('—¿Y tu chaqueta? —dice su madre—. Siempre pones la llave en la chaqueta.',
      '“Ya ceketin?” diyor annesi. “Anahtarı hep ceketine koyuyorsun.”'),
    P('Pablo mira en la chaqueta… ¡y allí está la llave! —Gracias, mamá. ¡Hasta luego!',
      'Pablo cekete bakıyor… ve anahtar orada! “Teşekkürler anne. Görüşürüz!”')
  ],
  questions: [
    s1.mc('Pablo kaçta işe başlıyor?', '9:00', ['8:00', '10:00', '8:30']),
    s1.mc('Pablo neyi bulamıyor?', 'Anahtarını', ['Telefonunu', 'Ceketini', 'Kitabını']),
    s1.mc('Pablo kiminle konuşuyor?', 'Annesiyle', ['Babasıyla', 'Kız kardeşiyle', 'Bir arkadaşıyla']),
    s1.mc('Anahtar nerede?', 'Ceketinde', ['Mutfakta', 'Yatağın üstünde', 'Banyoda']),
    s1.fill('No ___ la llave. (bulmak, yo)', ['encuentro'])
  ]
};

const s2 = questions('okuma-un-cafe-en-madrid');
export const unCafeEnMadrid: Reading = {
  id: 'un-cafe-en-madrid', level: 'A1', topic: 'selamlasma', kind: 'story',
  title: 'Un café en Madrid', titleTr: 'Madrid’de bir kahve',
  names: ['Emre', 'Estambul', 'Madrid', 'Elena'],
  glossary: { tarde: 'tarde-ogleden-sonra', mañana: 'manana-yarin' },
  paragraphs: [
    P('Emre es de Estambul. Ahora está en Madrid de vacaciones y quiere aprender español.',
      'Emre İstanbullu. Şimdi tatil için Madrid’de ve İspanyolca öğrenmek istiyor.'),
    P('Una tarde, Emre está en un bar cerca de un museo. Hay mucha gente y no hay mesas libres.',
      'Bir öğleden sonra Emre bir müzenin yakınındaki bir barda. Çok kalabalık ve boş masa yok.'),
    P('Una mujer joven está en una mesa con un libro. Emre dice: —Perdón, ¿está libre esta silla?',
      'Genç bir kadın elinde kitabıyla bir masada oturuyor. Emre soruyor: “Affedersiniz, bu sandalye boş mu?”'),
    P('—Sí, claro —dice ella—. Me llamo Elena. ¿Y tú? —Me llamo Emre. Soy turco.',
      '“Evet, tabii” diyor kadın. “Benim adım Elena. Ya senin?” “Benim adım Emre. Türk’üm.”'),
    P('—¡Encantada! ¿Hablas español? —Un poco. Estudio todos los días.',
      '“Memnun oldum! İspanyolca konuşuyor musun?” “Biraz. Her gün çalışıyorum.”'),
    P('Elena es profesora de español. Hablan una hora y Emre aprende muchas palabras nuevas.',
      'Elena İspanyolca öğretmeni. Bir saat konuşuyorlar ve Emre birçok yeni kelime öğreniyor.'),
    P('Al final, Elena dice: —Mañana estoy aquí otra vez. ¿Un café a las cinco? —¡Sí, hasta mañana!',
      'Sonunda Elena diyor ki: “Yarın yine buradayım. Saat beşte bir kahve?” “Evet, yarın görüşürüz!”')
  ],
  questions: [
    s2.mc('Emre nereli?', 'İstanbul', ['Madrid', 'Sevilla', 'Ankara']),
    s2.mc('Emre neden Madrid’de?', 'Tatil için', ['İş için', 'Üniversitede okuyor', 'Ailesini görmeye geldi']),
    s2.mc('Elena ne iş yapıyor?', 'İspanyolca öğretmeni', ['Garson', 'Doktor', 'Öğrenci']),
    s2.mc('Ertesi gün kaçta buluşuyorlar?', '5:00', ['1:00', '9:00', '7:00']),
    s2.trEs('Bu sandalye boş mu?', ['¿Está libre esta silla?', '¿Esta silla está libre?'])
  ]
};

const s3 = questions('okuma-el-cumpleanos');
export const elCumpleanos: Reading = {
  id: 'el-cumpleanos', level: 'A1', topic: 'aile', kind: 'story',
  title: 'El cumpleaños de la abuela', titleTr: 'Ninenin doğum günü',
  names: ['Carmen', 'Isabel', 'Luis'],
  glossary: { cocina: 'cocinar' },
  paragraphs: [
    P('Hoy es domingo y es el cumpleaños de la abuela Carmen. Tiene ochenta años.',
      'Bugün pazar ve Carmen ninenin doğum günü. Seksen yaşında.'),
    P('Toda la familia va a su casa: sus hijos, sus nietos y sus amigos.',
      'Bütün aile onun evine gidiyor: çocukları, torunları ve arkadaşları.'),
    P('La tía Isabel cocina una paella grande. El tío Luis trae vino y pan.',
      'Isabel teyze büyük bir paella pişiriyor. Luis amca şarap ve ekmek getiriyor.'),
    P('Los nietos compran un helado de chocolate y fresa.',
      'Torunlar çikolatalı ve çilekli bir dondurma alıyor.'),
    P('A las dos, la abuela abre la puerta. —¡Feliz cumpleaños! —dicen todos.',
      'Saat ikide nine kapıyı açıyor. “İyi ki doğdun!” diyor herkes.'),
    P('La abuela está muy contenta. Comen, beben y hablan mucho. Es un día muy bonito.',
      'Nine çok mutlu. Yiyorlar, içiyorlar ve bol bol konuşuyorlar. Çok güzel bir gün.'),
    P('Por la noche, la abuela dice: —Estoy cansada, pero muy feliz. ¡Gracias a todos!',
      'Akşam nine diyor ki: “Yorgunum ama çok mutluyum. Hepinize teşekkürler!”')
  ],
  questions: [
    s3.mc('Nine kaç yaşında?', '80', ['70', '18', '90']),
    s3.mc('Isabel teyze ne pişiriyor?', 'Paella', ['Çorba', 'İspanyol omleti', 'Tavuk']),
    s3.mc('Luis amca ne getiriyor?', 'Şarap ve ekmek', ['Dondurma', 'Bira ve peynir', 'Meyve suyu']),
    s3.mc('Torunlar ne alıyor?', 'Dondurma', ['Çikolata', 'Çilek', 'Şarap']),
    s3.fill('La abuela ___ muy contenta. (olmak, durum)', ['está'], 'Geçici durum → estar.')
  ]
};

export const STORIES: Reading[] = [laLlave, unCafeEnMadrid, elCumpleanos];
