/* A1 okuma metinleri. Yalnız presente, ser/estar, tener, hay, gustar, ir a + mastar, dönüşlü fiiller.
   Her paragrafın Türkçesi yanında; sorular metnin anlaşılmasını ölçer. */
import type { Reading } from '@/types/content';
import { questions } from '../grammar/helpers';

const P = (es: string, tr: string) => ({ es, tr });

const q1 = questions('okuma-me-presento');
export const mePresento: Reading = {
  id: 'me-presento', level: 'A1', topic: 'selamlasma', kind: 'text',
  title: '¡Hola, soy Lucía!', titleTr: 'Merhaba, ben Lucía!',
  names: ['Lucía', 'Sevilla', 'Madrid', 'Marta', 'Carmen', 'Estambul'],
  paragraphs: [
    P('¡Hola! Me llamo Lucía y soy de Sevilla. Tengo veinte años y soy estudiante. Estudio en la universidad de Madrid.',
      'Merhaba! Benim adım Lucía, Sevillalıyım. Yirmi yaşındayım ve öğrenciyim. Madrid’de üniversitede okuyorum.'),
    P('Vivo en un piso pequeño con dos amigas, Marta y Carmen. Marta es muy simpática y Carmen es muy divertida.',
      'İki kız arkadaşımla, Marta ve Carmen’le küçük bir dairede yaşıyorum. Marta çok cana yakın, Carmen de çok eğlenceli.'),
    P('Hablo español e inglés. Ahora aprendo turco porque tengo un amigo de Estambul. ¡Encantada!',
      'İspanyolca ve İngilizce konuşuyorum. Şimdi Türkçe öğreniyorum, çünkü İstanbullu bir arkadaşım var. Memnun oldum!')
  ],
  questions: [
    q1.mc('Lucía nereli?', 'Sevilla', ['Madrid', 'İstanbul', 'Valencia']),
    q1.mc('Lucía kaç yaşında?', '20', ['12', '30', '10']),
    q1.mc('Lucía kiminle yaşıyor?', 'İki kız arkadaşıyla', ['Ailesiyle', 'Tek başına', 'Erkek kardeşiyle']),
    q1.fill('Marta es muy ___. (cana yakın)', ['simpática']),
    q1.esTr('Ahora aprendo turco.', 'Şimdi Türkçe öğreniyorum.', ['Şimdi Türkçe konuşuyorum.', 'Türkçe öğretmeniyim.', 'Türkiye’ye gidiyorum.'])
  ]
};

const q2 = questions('okuma-mi-familia');
export const miFamilia: Reading = {
  id: 'mi-familia', level: 'A1', topic: 'aile', kind: 'text',
  title: 'Mi familia', titleTr: 'Ailem',
  names: ['Pablo', 'Ana', 'Luis', 'Elena', 'Valencia'],
  paragraphs: [
    P('Me llamo Pablo y tengo treinta años. Mi familia no es muy grande: mi madre, mi padre, mi hermana Ana y yo.',
      'Benim adım Pablo, otuz yaşındayım. Ailem çok büyük değil: annem, babam, kız kardeşim Ana ve ben.'),
    P('Mi padre se llama Luis. Es médico y trabaja en un hospital. Mi madre se llama Elena y es profesora en una escuela.',
      'Babamın adı Luis. Doktor ve bir hastanede çalışıyor. Annemin adı Elena, bir okulda öğretmen.'),
    P('Ana tiene dieciocho años y es estudiante. Es alta, inteligente y muy simpática.',
      'Ana on sekiz yaşında ve öğrenci. Uzun boylu, zeki ve çok cana yakın.'),
    P('Mis abuelos viven en Valencia, cerca de la playa. Los domingos comemos todos juntos en su casa.',
      'Dedemle ninem Valencia’da, plaja yakın yaşıyor. Pazar günleri hep birlikte onların evinde yemek yiyoruz.')
  ],
  questions: [
    q2.mc('Pablo’nun babası ne iş yapıyor?', 'Doktor', ['Öğretmen', 'Garson', 'Mühendis']),
    q2.mc('Elena nerede çalışıyor?', 'Bir okulda', ['Bir hastanede', 'Bir ofiste', 'Bir restoranda']),
    q2.mc('Ana kaç yaşında?', '18', ['30', '25', '12']),
    q2.mc('Pazar günleri ne yapıyorlar?', 'Dedeyle ninenin evinde yemek yiyorlar', ['Plaja gidiyorlar', 'Sinemaya gidiyorlar', 'Evde ders çalışıyorlar']),
    q2.fill('Mi padre ___ médico. (olmak)', ['es'])
  ]
};

const q3 = questions('okuma-mi-piso');
export const miPiso: Reading = {
  id: 'mi-piso', level: 'A1', topic: 'ev', kind: 'text',
  title: 'Mi piso', titleTr: 'Dairem',
  names: ['Madrid'],
  glossary: { cocina: 'cocina' },
  paragraphs: [
    P('Vivo en un piso en un barrio bonito de Madrid. El piso no es grande, pero es nuevo y muy limpio.',
      'Madrid’in güzel bir semtinde, bir dairede yaşıyorum. Daire büyük değil ama yeni ve çok temiz.'),
    P('Tiene un salón, una cocina, un baño y dos dormitorios. En el salón hay un sofá azul, una mesa y cuatro sillas.',
      'Bir oturma odası, bir mutfak, bir banyo ve iki yatak odası var. Oturma odasında mavi bir kanepe, bir masa ve dört sandalye var.'),
    P('Mi dormitorio es pequeño. Tiene una cama, un armario y una ventana grande. Desde la ventana veo el parque.',
      'Yatak odam küçük. Bir yatak, bir dolap ve büyük bir pencere var. Pencereden parkı görüyorum.'),
    P('Me gusta mucho la cocina porque es grande y tiene una nevera nueva. Allí cocino con mi novio el fin de semana.',
      'Mutfağı çok seviyorum, çünkü büyük ve yeni bir buzdolabı var. Hafta sonu orada sevgilimle yemek yapıyorum.')
  ],
  questions: [
    q3.mc('Daire nasıl?', 'Yeni ve çok temiz', ['Büyük ve eski', 'Küçük ve kirli', 'Pahalı ve büyük']),
    q3.mc('Oturma odasında kaç sandalye var?', '4', ['2', '6', '1']),
    q3.mc('Kanepe ne renk?', 'Mavi', ['Kırmızı', 'Yeşil', 'Siyah']),
    q3.mc('Pencereden ne görünüyor?', 'Park', ['Plaj', 'Meydan', 'Müze']),
    q3.fill('En el salón ___ un sofá azul. (var)', ['hay'])
  ]
};

const q4 = questions('okuma-en-el-bar');
export const enElBar: Reading = {
  id: 'en-el-bar', level: 'A1', topic: 'yemek', kind: 'text',
  title: 'En el bar', titleTr: 'Barda',
  names: ['Javier', 'Marta'],
  glossary: { mañana: 'manana-sabah', naranja: 'naranja-meyve' },
  paragraphs: [
    P('Es sábado por la mañana. Javier y Marta están en un bar pequeño cerca de la plaza.',
      'Cumartesi sabahı. Javier ve Marta meydana yakın küçük bir barda.'),
    P('—Buenos días. ¿Qué queréis tomar? —dice el camarero.',
      '“Günaydın. Ne alırsınız?” diyor garson.'),
    P('—Para mí, un café con leche y pan con tomate, por favor —dice Marta.',
      '“Bana sütlü bir kahve ve domatesli ekmek, lütfen” diyor Marta.'),
    P('—Yo quiero un zumo de naranja y una tortilla —dice Javier.',
      '“Ben bir portakal suyu ve bir İspanyol omleti istiyorum” diyor Javier.'),
    P('Todo está delicioso. Después, Javier pide la cuenta. Son nueve euros.',
      'Her şey çok lezzetli. Sonra Javier hesabı istiyor. Dokuz euro tutuyor.')
  ],
  questions: [
    q4.mc('Hangi gün?', 'Cumartesi', ['Pazar', 'Cuma', 'Pazartesi']),
    q4.mc('Marta ne içiyor?', 'Sütlü kahve', ['Portakal suyu', 'Çay', 'Su']),
    q4.mc('Javier ne yiyor?', 'İspanyol omleti', ['Domatesli ekmek', 'Jambon', 'Salata']),
    q4.mc('Hesap ne kadar?', '9 euro', ['19 euro', '5 euro', '90 euro']),
    q4.trEs('Hesap, lütfen.', ['La cuenta, por favor.'])
  ]
};

const q5 = questions('okuma-un-dia-normal');
export const unDiaNormal: Reading = {
  id: 'un-dia-normal', level: 'A1', topic: 'rutin', kind: 'text',
  title: 'Un día normal', titleTr: 'Sıradan bir gün',
  names: ['Carmen', 'Valencia'],
  glossary: { trabajo: 'trabajar', mañana: 'manana-sabah', como: 'comer', tarde: 'tarde-ogleden-sonra' },
  paragraphs: [
    P('Me llamo Carmen y soy enfermera. Trabajo en un hospital grande de Valencia.',
      'Benim adım Carmen, hemşireyim. Valencia’da büyük bir hastanede çalışıyorum.'),
    P('Me despierto a las seis de la mañana. Me levanto y me ducho. Mi desayuno es un café y una fruta.',
      'Sabah altıda uyanıyorum. Kalkıyorum ve duş alıyorum. Kahvaltım bir kahve ve bir meyve.'),
    P('Voy al hospital en autobús. Empiezo a trabajar a las siete y media.',
      'Hastaneye otobüsle gidiyorum. Yedi buçukta çalışmaya başlıyorum.'),
    P('A las tres vuelvo a casa. Como con mi marido y después dormimos un poco.',
      'Saat üçte eve dönüyorum. Kocamla yemek yiyorum, sonra biraz uyuyoruz.'),
    P('Por la tarde leo un libro o miro el móvil. La cena es a las nueve y me acuesto temprano, a las once.',
      'Öğleden sonra kitap okuyorum ya da telefonuma bakıyorum. Akşam yemeği saat dokuzda; erken, on birde yatıyorum.')
  ],
  questions: [
    q5.mc('Carmen ne iş yapıyor?', 'Hemşire', ['Doktor', 'Öğretmen', 'Garson']),
    q5.mc('Carmen kaçta uyanıyor?', '6:00', ['7:30', '3:00', '11:00']),
    q5.mc('Hastaneye nasıl gidiyor?', 'Otobüsle', ['Arabayla', 'Metroyla', 'Bisikletle']),
    q5.fill('Me ___ temprano. (yatmak)', ['acuesto']),
    q5.order('Empiezo a trabajar a las siete.')
  ]
};

const q6 = questions('okuma-mi-barrio');
export const miBarrio: Reading = {
  id: 'mi-barrio', level: 'A1', topic: 'sehir', kind: 'text',
  title: 'Mi barrio', titleTr: 'Semtim',
  names: ['Triana', 'Sevilla'],
  glossary: { tarde: 'tarde-ogleden-sonra' },
  paragraphs: [
    P('Vivo en el barrio de Triana, en Sevilla. Es un barrio viejo y muy bonito.',
      'Sevilla’da, Triana semtinde yaşıyorum. Eski ve çok güzel bir semt.'),
    P('En mi calle hay una farmacia, un supermercado y dos bares. Los bares están abiertos hasta la una.',
      'Sokağımda bir eczane, bir süpermarket ve iki bar var. Barlar gece saat bire kadar açık.'),
    P('Cerca de mi casa hay una plaza grande con una iglesia. Los niños juegan en la plaza por la tarde.',
      'Evimin yakınında, kilisesi olan büyük bir meydan var. Çocuklar öğleden sonraları meydanda oynuyor.'),
    P('No tengo coche. Voy a la oficina en metro o en bicicleta. La estación de metro está muy cerca.',
      'Arabam yok. Ofise metroyla ya da bisikletle gidiyorum. Metro istasyonu çok yakın.'),
    P('Me gusta mucho mi barrio porque la gente es muy amable.',
      'Semtimi çok seviyorum, çünkü insanlar çok nazik.')
  ],
  questions: [
    q6.mc('Triana hangi şehirde?', 'Sevilla', ['Madrid', 'Valencia', 'Barselona']),
    q6.mc('Sokakta kaç bar var?', '2', ['1', '3', '5']),
    q6.mc('Çocuklar nerede oynuyor?', 'Meydanda', ['Parkta', 'Plajda', 'Okulda']),
    q6.mc('Ofise nasıl gidiyor?', 'Metroyla ya da bisikletle', ['Arabayla', 'Taksiyle', 'Otobüsle']),
    q6.fill('En mi calle ___ una farmacia. (var)', ['hay'])
  ]
};

const q7 = questions('okuma-la-semana-de-diego');
export const laSemanaDeDiego: Reading = {
  id: 'la-semana-de-diego', level: 'A1', topic: 'zaman', kind: 'text',
  title: 'La semana de Diego', titleTr: 'Diego’nun haftası',
  names: ['Diego'],
  glossary: { tarde: 'tarde-ogleden-sonra', cocina: 'cocinar' },
  paragraphs: [
    P('Diego es programador y trabaja en una empresa pequeña. Tiene una semana muy ocupada.',
      'Diego yazılımcı ve küçük bir şirkette çalışıyor. Çok yoğun bir haftası var.'),
    P('Los lunes y los miércoles trabaja en la oficina. Los martes y los jueves trabaja en casa, con su ordenador.',
      'Pazartesi ve çarşamba günleri ofiste çalışıyor. Salı ve perşembe günleri evde, bilgisayarıyla çalışıyor.'),
    P('Los viernes por la tarde juega al fútbol con sus amigos.',
      'Cuma öğleden sonraları arkadaşlarıyla futbol oynuyor.'),
    P('El fin de semana no trabaja. El sábado va al mercado y cocina para su familia. El domingo duerme mucho y lee.',
      'Hafta sonu çalışmıyor. Cumartesi pazara gidip ailesi için yemek yapıyor. Pazar günü bol bol uyuyor ve okuyor.'),
    P('En agosto Diego no trabaja: va a la playa con su novia.',
      'Ağustosta Diego çalışmıyor: kız arkadaşıyla plaja gidiyor.')
  ],
  questions: [
    q7.mc('Diego salı günleri nerede çalışıyor?', 'Evde', ['Ofiste', 'Bir barda', 'Kütüphanede']),
    q7.mc('Cuma öğleden sonraları ne yapıyor?', 'Futbol oynuyor', ['Pazara gidiyor', 'Yemek yapıyor', 'Uyuyor']),
    q7.mc('Ağustosta nereye gidiyor?', 'Plaja', ['Ofise', 'Pazara', 'Müzeye']),
    q7.fill('El domingo Diego ___ mucho. (uyumak)', ['duerme']),
    q7.esTr('El fin de semana no trabaja.', 'Hafta sonu çalışmıyor.', ['Hafta sonu çok çalışıyor.', 'Her gün çalışıyor.', 'Pazartesi çalışmıyor.'])
  ]
};

const q8 = questions('okuma-en-la-tienda');
export const enLaTienda: Reading = {
  id: 'en-la-tienda', level: 'A1', topic: 'renkler', kind: 'text',
  title: 'En la tienda de ropa', titleTr: 'Giyim mağazasında',
  names: ['Lucía'],
  glossary: { trabajo: 'trabajo' },
  paragraphs: [
    P('Lucía necesita ropa nueva para el trabajo. Hoy va a una tienda de ropa con su hermana.',
      'Lucía’nın iş için yeni kıyafetlere ihtiyacı var. Bugün kız kardeşiyle bir giyim mağazasına gidiyor.'),
    P('—¿Te gusta esta camisa azul? —No, prefiero la blanca.',
      '“Bu mavi gömleği beğendin mi?” “Hayır, beyazı tercih ederim.”'),
    P('La camisa blanca es bonita y no es cara: cuesta veinte euros.',
      'Beyaz gömlek güzel ve pahalı değil: yirmi euro.'),
    P('También necesita una chaqueta. Hay una chaqueta negra muy bonita, pero es muy cara: cuesta cien euros.',
      'Bir de ceket lazım. Çok güzel siyah bir ceket var ama çok pahalı: yüz euro.'),
    P('Al final, Lucía compra la camisa blanca y una chaqueta gris más barata. Está muy contenta.',
      'Sonunda Lucía beyaz gömleği ve daha ucuz, gri bir ceket alıyor. Çok memnun.')
  ],
  questions: [
    q8.mc('Lucía neden mağazaya gidiyor?', 'İş için yeni kıyafet lazım', ['Kız kardeşine hediye alacak', 'Mağazada çalışıyor', 'Ceketini geri verecek']),
    q8.mc('Hangi gömleği tercih ediyor?', 'Beyaz', ['Mavi', 'Siyah', 'Gri']),
    q8.mc('Siyah ceket ne kadar?', '100 euro', ['20 euro', '10 euro', '60 euro']),
    q8.mc('Sonunda hangi ceketi alıyor?', 'Gri', ['Siyah', 'Mavi', 'Beyaz']),
    q8.fill('La chaqueta negra es muy ___. (pahalı)', ['cara'])
  ]
};

const q9 = questions('okuma-el-nuevo-trabajo');
export const elNuevoTrabajo: Reading = {
  id: 'el-nuevo-trabajo', level: 'A1', topic: 'meslekler', kind: 'text',
  title: 'El nuevo trabajo', titleTr: 'Yeni iş',
  names: ['Javier', 'Ana', 'Pedro'],
  glossary: { trabajo: 'trabajo', tarde: 'tarde-ogleden-sonra', buen: 'bueno' },
  paragraphs: [
    P('Javier es ingeniero y hoy empieza en un trabajo nuevo. Está muy contento.',
      'Javier mühendis ve bugün yeni bir işe başlıyor. Çok mutlu.'),
    P('La oficina está cerca de la estación de tren. Javier llega temprano, a las ocho y media.',
      'Ofis tren istasyonuna yakın. Javier erken, sekiz buçukta varıyor.'),
    P('Sus compañeros son muy simpáticos. Ana es arquitecta y Pedro es programador.',
      'İş arkadaşları çok cana yakın. Ana mimar, Pedro yazılımcı.'),
    P('A las dos comen juntos en un restaurante barato. Javier pide pescado con ensalada y agua.',
      'Saat ikide birlikte ucuz bir restoranda yemek yiyorlar. Javier salatalı balık ve su istiyor.'),
    P('Por la tarde aprende mucho. A las seis vuelve a casa en tren. ¡Es un buen día!',
      'Öğleden sonra çok şey öğreniyor. Saat altıda trenle eve dönüyor. Güzel bir gün!')
  ],
  questions: [
    q9.mc('Javier ne iş yapıyor?', 'Mühendis', ['Mimar', 'Yazılımcı', 'Garson']),
    q9.mc('Ofis nerede?', 'Tren istasyonunun yakınında', ['Plajın yakınında', 'Havalimanında', 'Meydanda']),
    q9.mc('Ana ne iş yapıyor?', 'Mimar', ['Mühendis', 'Doktor', 'Öğretmen']),
    q9.mc('Öğle yemeğinde Javier ne istiyor?', 'Salatalı balık', ['Tavuklu pilav', 'Çorba', 'Makarna']),
    q9.fill('Javier ___ temprano, a las ocho y media. (varmak)', ['llega'])
  ]
};

const q10 = questions('okuma-mis-amigos');
export const misAmigos: Reading = {
  id: 'mis-amigos', level: 'A1', topic: 'fiiller', kind: 'text',
  title: 'Mis amigos', titleTr: 'Arkadaşlarım',
  names: ['Marta', 'Diego', 'Carmen', 'Italia'],
  paragraphs: [
    P('Tengo tres amigos: Marta, Diego y Carmen. Somos amigos desde la escuela.',
      'Üç arkadaşım var: Marta, Diego ve Carmen. Okuldan beri arkadaşız.'),
    P('A Marta le gusta leer. Siempre lee en el metro y en la cama.',
      'Marta okumayı sever. Metroda da yatakta da hep okur.'),
    P('A Diego le gusta viajar. Este año va a viajar a Italia.',
      'Diego seyahat etmeyi sever. Bu yıl İtalya’ya gidecek.'),
    P('A Carmen le gustan mucho los perros: tiene dos perros y un gato.',
      'Carmen köpekleri çok sever: iki köpeği ve bir kedisi var.'),
    P('¿Y a mí? A mí me gusta cocinar. Los sábados cocino para mis amigos y comemos juntos en mi casa.',
      'Ya ben? Ben yemek yapmayı severim. Cumartesileri arkadaşlarıma yemek yapıyorum, evimde birlikte yiyoruz.')
  ],
  questions: [
    q10.mc('Marta neyi sever?', 'Okumayı', ['Seyahat etmeyi', 'Yemek yapmayı', 'Futbolu']),
    q10.mc('Diego bu yıl nereye gidecek?', 'İtalya', ['Sevilla', 'İstanbul', 'Madrid']),
    q10.mc('Carmen’in kaç köpeği var?', '2', ['1', '3', 'Hiç yok']),
    q10.fill('A Carmen le ___ mucho los perros.', ['gustan'], 'Sevilen şey çoğul (los perros) → gustan.'),
    q10.mc('Yazar cumartesileri ne yapıyor?', 'Arkadaşlarına yemek yapıyor', ['İtalya’ya gidiyor', 'Metroda okuyor', 'Köpekleri gezdiriyor'])
  ]
};

export const TEXTS: Reading[] = [mePresento, miFamilia, miPiso, enElBar, unDiaNormal, miBarrio, laSemanaDeDiego, enLaTienda, elNuevoTrabajo, misAmigos];
