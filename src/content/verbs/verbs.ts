/* En sık A1 fiilleri — presente. Düzensizler tam tablo (full), kök değişenler stem,
   yalnız "yo" biçimi düzensiz olanlar yo ile verilir. Çekimler testlerde kontrol edilir. */
import type { Verb } from '@/types/content';
import { toIpa } from '@/lib/text/ipa';
import { conjugate, isRegularSpec, type ConjSpec } from './conjugate';
import { slug } from '../vocabulary/helpers';

interface VerbDef { es: string; tr: string; ex: [string, string]; blank: string; spec?: ConjSpec; tags?: string[]; related?: string[]; latamNote?: string }

const v = (es: string, tr: string, ex: [string, string], blank: string, spec: ConjSpec = {}, extra: Partial<VerbDef> = {}): VerbDef => ({ es, tr, ex, blank, spec, ...extra });

const DEFS: VerbDef[] = [
  // Tamamen düzensiz
  v('ser', 'olmak (kalıcı özellik, kimlik)', ['Yo soy estudiante.', 'Ben öğrenciyim.'], 'soy', { full: ['soy', 'eres', 'es', 'somos', 'sois', 'son'] }, { related: ['estar'] }),
  v('estar', 'olmak (durum, yer)', ['Estoy muy cansado hoy.', 'Bugün çok yorgunum.'], 'Estoy', { full: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'] }, { related: ['ser'] }),
  v('tener', 'sahip olmak, -si olmak', ['Tengo dos hermanos.', 'İki kardeşim var.'], 'Tengo', { full: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'] }),
  v('ir', 'gitmek', ['Vamos al cine el sábado.', 'Cumartesi sinemaya gidiyoruz.'], 'Vamos', { full: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'] }, { related: ['venir'] }),
  v('hacer', 'yapmak, etmek', ['¿Qué haces esta tarde?', 'Bu öğleden sonra ne yapıyorsun?'], 'haces', { yo: 'hago' }),
  v('poder', '-ebilmek', ['¿Puedes ayudarme?', 'Bana yardım edebilir misin?'], 'Puedes', { stem: 'o>ue' }),
  v('querer', 'istemek; sevmek', ['Quiero un café, por favor.', 'Bir kahve istiyorum, lütfen.'], 'Quiero', { stem: 'e>ie' }),
  v('venir', 'gelmek', ['¿Vienes a la fiesta?', 'Partiye geliyor musun?'], 'Vienes', { full: ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen'] }, { related: ['ir'] }),
  v('decir', 'söylemek, demek', ['¿Qué dice el profesor?', 'Öğretmen ne diyor?'], 'dice', { full: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'] }),
  v('salir', 'çıkmak', ['Salgo de casa a las ocho.', 'Saat sekizde evden çıkıyorum.'], 'Salgo', { yo: 'salgo' }),
  v('poner', 'koymak', ['Pongo las llaves en la mesa.', 'Anahtarları masaya koyuyorum.'], 'Pongo', { yo: 'pongo' }),
  v('saber', 'bilmek (bilgi, beceri)', ['No sé la respuesta.', 'Cevabı bilmiyorum.'], 'sé', { full: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'] }, { related: ['conocer'] }),
  v('conocer', 'tanımak, bilmek (kişi, yer)', ['Conozco bien Madrid.', 'Madrid’i iyi tanırım.'], 'Conozco', { yo: 'conozco' }, { related: ['saber'] }),
  v('dar', 'vermek', ['Te doy mi número.', 'Sana numaramı veriyorum.'], 'doy', { full: ['doy', 'das', 'da', 'damos', 'dais', 'dan'] }),
  v('ver', 'görmek; izlemek', ['Vemos una película en casa.', 'Evde bir film izliyoruz.'], 'Vemos', { full: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'] }),
  v('oír', 'duymak', ['No oigo nada.', 'Hiçbir şey duymuyorum.'], 'oigo', { full: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'] }),
  v('traer', 'getirmek', ['Traigo pan para la cena.', 'Akşam yemeği için ekmek getiriyorum.'], 'Traigo', { yo: 'traigo' }),
  // Kök değişimi
  v('pensar', 'düşünmek', ['Pienso mucho en mi familia.', 'Ailemi çok düşünüyorum.'], 'Pienso', { stem: 'e>ie' }),
  v('empezar', 'başlamak', ['La clase empieza a las nueve.', 'Ders saat dokuzda başlıyor.'], 'empieza', { stem: 'e>ie' }),
  v('cerrar', 'kapatmak', ['Cierra la ventana, por favor.', 'Pencereyi kapat, lütfen.'], 'Cierra', { stem: 'e>ie' }),
  v('preferir', 'tercih etmek', ['Prefiero el té.', 'Çayı tercih ederim.'], 'Prefiero', { stem: 'e>ie' }),
  v('dormir', 'uyumak', ['Duermo ocho horas.', 'Sekiz saat uyuyorum.'], 'Duermo', { stem: 'o>ue' }),
  v('volver', 'dönmek', ['Vuelvo a casa a las seis.', 'Saat altıda eve dönüyorum.'], 'Vuelvo', { stem: 'o>ue' }),
  v('encontrar', 'bulmak', ['No encuentro mis llaves.', 'Anahtarlarımı bulamıyorum.'], 'encuentro', { stem: 'o>ue' }),
  v('jugar', 'oynamak', ['Los niños juegan en el parque.', 'Çocuklar parkta oynuyor.'], 'juegan', { stem: 'u>ue' }),
  v('pedir', 'istemek, sipariş etmek', ['Pido una pizza.', 'Bir pizza sipariş ediyorum.'], 'Pido', { stem: 'e>i' }),
  v('repetir', 'tekrar etmek', ['¿Puedes repetir, por favor?', 'Tekrar eder misin, lütfen?'], 'repetir', { stem: 'e>i' }),
  // Düzenli -ar
  v('hablar', 'konuşmak', ['Hablo un poco de español.', 'Biraz İspanyolca konuşuyorum.'], 'Hablo'),
  v('trabajar', 'çalışmak (iş)', ['Mi madre trabaja en un hospital.', 'Annem bir hastanede çalışıyor.'], 'trabaja'),
  v('estudiar', 'ders çalışmak, okumak', ['Estudio español todos los días.', 'Her gün İspanyolca çalışıyorum.'], 'Estudio'),
  v('escuchar', 'dinlemek', ['Escucho música en el metro.', 'Metroda müzik dinliyorum.'], 'Escucho'),
  v('mirar', 'bakmak', ['Mira, ¡qué bonito!', 'Bak, ne güzel!'], 'Mira'),
  v('comprar', 'satın almak', ['Compro fruta en el mercado.', 'Pazardan meyve alıyorum.'], 'Compro'),
  v('tomar', 'almak; içmek', ['¿Tomamos un café?', 'Bir kahve içelim mi?'], 'Tomamos'),
  v('llegar', 'varmak, gelmek', ['El tren llega a las diez.', 'Tren saat onda varıyor.'], 'llega'),
  v('necesitar', 'ihtiyaç duymak', ['Necesito ayuda.', 'Yardıma ihtiyacım var.'], 'Necesito'),
  v('cocinar', 'yemek pişirmek', ['Mi padre cocina muy bien.', 'Babam çok iyi yemek yapar.'], 'cocina'),
  v('viajar', 'seyahat etmek', ['Viajamos a España en verano.', 'Yazın İspanya’ya gidiyoruz.'], 'Viajamos'),
  v('esperar', 'beklemek; ummak', ['Te espero en la plaza.', 'Seni meydanda bekliyorum.'], 'espero'),
  v('ayudar', 'yardım etmek', ['Ayudo a mi hermana con los deberes.', 'Kız kardeşime ödevlerinde yardım ediyorum.'], 'Ayudo'),
  // Düzenli -er / -ir
  v('comer', 'yemek', ['Comemos a las dos.', 'Saat ikide yemek yiyoruz.'], 'Comemos'),
  v('beber', 'içmek', ['Bebo mucha agua.', 'Çok su içiyorum.'], 'Bebo'),
  v('leer', 'okumak', ['Leo un libro antes de dormir.', 'Uyumadan önce kitap okuyorum.'], 'Leo'),
  v('aprender', 'öğrenmek', ['Aprendo palabras nuevas cada día.', 'Her gün yeni kelimeler öğreniyorum.'], 'Aprendo'),
  v('vivir', 'yaşamak', ['Vivo en Estambul.', 'İstanbul’da yaşıyorum.'], 'Vivo'),
  v('escribir', 'yazmak', ['Escribo un mensaje a mi amigo.', 'Arkadaşıma mesaj yazıyorum.'], 'Escribo'),
  v('abrir', 'açmak', ['La tienda abre a las diez.', 'Dükkân saat onda açılıyor.'], 'abre'),
  // Dönüşlü — günlük rutin
  v('llamarse', 'adı … olmak', ['Me llamo Egemen.', 'Benim adım Egemen.'], 'llamo', {}, { tags: ['fiiller', 'rutin'] }),
  v('levantarse', 'kalkmak (yataktan)', ['Me levanto a las siete.', 'Saat yedide kalkıyorum.'], 'levanto', {}, { tags: ['fiiller', 'rutin'] }),
  v('ducharse', 'duş almak', ['Me ducho por la mañana.', 'Sabahları duş alıyorum.'], 'ducho', {}, { tags: ['fiiller', 'rutin'] }),
  v('despertarse', 'uyanmak', ['Me despierto muy temprano.', 'Çok erken uyanıyorum.'], 'despierto', { stem: 'e>ie' }, { tags: ['fiiller', 'rutin'] }),
  v('acostarse', 'yatmak (uyumak için)', ['Me acuesto a las once.', 'Saat on birde yatıyorum.'], 'acuesto', { stem: 'o>ue' }, { tags: ['fiiller', 'rutin'] })
];

export const VERBS: Verb[] = DEFS.map((d) => ({
  id: slug(d.es),
  es: d.es,
  tr: d.tr,
  ipa: toIpa(d.es),
  partOfSpeech: 'verb',
  gender: null,
  article: null,
  exampleEs: d.ex[0],
  exampleTr: d.ex[1],
  blank: d.blank,
  level: 'A1',
  tags: d.tags ?? ['fiiller'],
  ...(d.related ? { related: d.related } : {}),
  ...(d.latamNote ? { latamNote: d.latamNote } : {}),
  conjugations: { presente: conjugate(d.es, d.spec) },
  regular: isRegularSpec(d.spec ?? {})
}));

export const VERB_SPECS = Object.fromEntries(DEFS.map((d) => [slug(d.es), d.spec ?? {}]));
