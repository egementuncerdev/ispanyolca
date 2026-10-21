/* Renkler, meslekler, sıfatlar */
import { topic } from './helpers';

const r = topic('renkler');
export const COLORS = [
  r.n('color', 'renk', 'm', ['¿Cuál es tu color favorito?', 'En sevdiğin renk ne?']),
  r.adj('rojo', 'kırmızı', ['El tomate es rojo.', 'Domates kırmızıdır.'], { emoji: '🔴' }),
  r.adj('azul', 'mavi', ['El cielo es azul.', 'Gökyüzü mavi.'], { emoji: '🔵' }),
  r.adj('verde', 'yeşil', ['La hierba es verde.', 'Çimen yeşil.'], { emoji: '🟢' }),
  r.adj('amarillo', 'sarı', ['El plátano es amarillo.', 'Muz sarıdır.'], { emoji: '🟡' }),
  r.adj('blanco', 'beyaz', ['La leche es blanca.', 'Süt beyazdır.'], { blank: 'blanca', emoji: '⚪', antonyms: ['negro'] }),
  r.adj('negro', 'siyah', ['Mi gato es negro.', 'Kedim siyah.'], { emoji: '⚫', antonyms: ['blanco'] }),
  r.adj('gris', 'gri', ['Hoy el cielo está gris.', 'Bugün gökyüzü gri.']),
  r.adj('naranja', 'turuncu', ['Tengo una camiseta naranja.', 'Turuncu bir tişörtüm var.'], { id: 'naranja-renk', emoji: '🟠' }),
  r.adj('rosa', 'pembe', ['Mi prima tiene una bicicleta rosa.', 'Kuzenimin pembe bir bisikleti var.']),
  r.adj('marrón', 'kahverengi', ['Mis ojos son marrones.', 'Gözlerim kahverengi.'], { blank: 'marrones', emoji: '🟤' }),
  r.adj('morado', 'mor', ['La berenjena es morada.', 'Patlıcan mordur.'], { blank: 'morada', emoji: '🟣' })
];

const m = topic('meslekler');
export const JOBS = [
  m.n('trabajo', 'iş', 'm', ['Me gusta mi trabajo.', 'İşimi seviyorum.']),
  m.n('empresa', 'şirket', 'f', ['Trabajo en una empresa pequeña.', 'Küçük bir şirkette çalışıyorum.']),
  m.n('médico', 'doktor', 'm', ['El médico trabaja en el hospital.', 'Doktor hastanede çalışıyor.'], { feminine: 'médica', synonyms: ['doctor'] }),
  m.n('enfermero', 'hemşire', 'm', ['Mi tía es enfermera.', 'Teyzem hemşire.'], { feminine: 'enfermera', blank: 'enfermera' }),
  m.n('profesor', 'öğretmen', 'm', ['El profesor explica la lección.', 'Öğretmen dersi anlatıyor.'], { feminine: 'profesora' }),
  m.n('estudiante', 'öğrenci', 'm', ['Soy estudiante de español.', 'İspanyolca öğrencisiyim.'], { feminine: 'estudiante' }),
  m.n('camarero', 'garson', 'm', ['El camarero trae la cuenta.', 'Garson hesabı getiriyor.'], { feminine: 'camarera', latamNote: 'Latin Amerika’da genelde “mesero”.' }),
  m.n('cocinero', 'aşçı', 'm', ['El cocinero prepara la paella.', 'Aşçı paellayı hazırlıyor.'], { feminine: 'cocinera' }),
  m.n('abogado', 'avukat', 'm', ['Mi hermana es abogada.', 'Kız kardeşim avukat.'], { feminine: 'abogada', blank: 'abogada' }),
  m.n('ingeniero', 'mühendis', 'm', ['Mi padre es ingeniero.', 'Babam mühendis.'], { feminine: 'ingeniera' }),
  m.n('policía', 'polis (kişi)', 'm', ['El policía está en la calle.', 'Polis sokakta.'], { feminine: 'policía', latamNote: '“La policía” hem kadın polis hem de polis teşkilatı anlamına gelir.' }),
  m.n('dependiente', 'tezgâhtar, satış görevlisi', 'm', ['La dependienta es muy amable.', 'Satış görevlisi çok nazik.'], { feminine: 'dependienta', blank: 'dependienta' }),
  m.n('conductor', 'şoför', 'm', ['El conductor del autobús es simpático.', 'Otobüs şoförü sempatik.'], { feminine: 'conductora' }),
  m.n('periodista', 'gazeteci', 'm', ['La periodista escribe un artículo.', 'Gazeteci bir makale yazıyor.'], { feminine: 'periodista' }),
  m.n('arquitecto', 'mimar', 'm', ['El arquitecto diseña casas.', 'Mimar evler tasarlıyor.'], { feminine: 'arquitecta' }),
  m.n('programador', 'yazılımcı', 'm', ['Soy programador.', 'Yazılımcıyım.'], { feminine: 'programadora' }),
  m.n('actor', 'oyuncu (erkek)', 'm', ['El actor es muy famoso.', 'Oyuncu çok ünlü.'], { feminine: 'actriz' }),
  m.n('cantante', 'şarkıcı', 'm', ['Mi cantante favorita es Rosalía.', 'En sevdiğim şarkıcı Rosalía.'], { feminine: 'cantante', blank: 'cantante' })
];

const s = topic('sifatlar');
export const ADJECTIVES = [
  s.adj('grande', 'büyük', ['Madrid es una ciudad grande.', 'Madrid büyük bir şehir.'], { antonyms: ['pequeno'] }),
  s.adj('pequeño', 'küçük', ['Mi habitación es pequeña.', 'Odam küçük.'], { blank: 'pequeña', antonyms: ['grande'] }),
  s.adj('alto', 'uzun boylu; yüksek', ['Mi hermano es muy alto.', 'Kardeşim çok uzun boylu.'], { antonyms: ['bajo'] }),
  s.adj('bajo', 'kısa boylu; alçak', ['Mi abuela es baja.', 'Ninem kısa boylu.'], { blank: 'baja', antonyms: ['alto'] }),
  s.adj('guapo', 'yakışıklı, güzel', ['Tu novio es muy guapo.', 'Sevgilin çok yakışıklı.'], { antonyms: ['feo'] }),
  s.adj('feo', 'çirkin', ['Este cuadro es feo.', 'Bu tablo çirkin.'], { antonyms: ['guapo', 'bonito'] }),
  s.adj('bonito', 'güzel, hoş', ['¡Qué casa tan bonita!', 'Ne güzel bir ev!'], { blank: 'bonita', synonyms: ['guapo'], antonyms: ['feo'] }),
  s.adj('joven', 'genç', ['Mi profesora es joven.', 'Öğretmenim genç.'], { plural: 'jóvenes', antonyms: ['mayor', 'viejo'] }),
  s.adj('mayor', 'yaşlı; büyük (yaşça)', ['Mi abuelo es mayor.', 'Dedem yaşlı.'], { antonyms: ['joven'] }),
  s.adj('viejo', 'eski; yaşlı', ['Mi coche es viejo.', 'Arabam eski.'], { antonyms: ['nuevo', 'joven'] }),
  s.adj('nuevo', 'yeni', ['Tengo un móvil nuevo.', 'Yeni bir telefonum var.'], { antonyms: ['viejo'] }),
  s.adj('bueno', 'iyi', ['Es un buen libro.', 'İyi bir kitap.'], { blank: 'buen', antonyms: ['malo'] }),
  s.adj('malo', 'kötü', ['Hoy hace mal tiempo.', 'Bugün hava kötü.'], { blank: 'mal', antonyms: ['bueno'], id: 'malo' }),
  s.adj('simpático', 'sempatik, cana yakın', ['Mi vecino es muy simpático.', 'Komşum çok cana yakın.'], { antonyms: ['antipatico'] }),
  s.adj('antipático', 'antipatik, sevimsiz', ['El camarero es un poco antipático.', 'Garson biraz sevimsiz.'], { antonyms: ['simpatico'] }),
  s.adj('amable', 'nazik', ['Eres muy amable.', 'Çok naziksin.']),
  s.adj('inteligente', 'zeki', ['Mi hermana es muy inteligente.', 'Kız kardeşim çok zeki.']),
  s.adj('divertido', 'eğlenceli', ['La película es muy divertida.', 'Film çok eğlenceli.'], { blank: 'divertida', antonyms: ['aburrido'] }),
  s.adj('aburrido', 'sıkıcı; sıkılmış', ['La clase es aburrida.', 'Ders sıkıcı.'], { blank: 'aburrida', antonyms: ['divertido'] }),
  s.adj('contento', 'memnun, mutlu', ['Estoy muy contento hoy.', 'Bugün çok mutluyum.'], { synonyms: ['feliz'], antonyms: ['triste'] }),
  s.adj('feliz', 'mutlu', ['Soy feliz en esta ciudad.', 'Bu şehirde mutluyum.'], { plural: 'felices', synonyms: ['contento'], antonyms: ['triste'] }),
  s.adj('triste', 'üzgün, hüzünlü', ['¿Por qué estás triste?', 'Neden üzgünsün?'], { antonyms: ['contento', 'feliz'] }),
  s.adj('cansado', 'yorgun', ['Estoy cansado después del trabajo.', 'İşten sonra yorgunum.']),
  s.adj('enfermo', 'hasta', ['Hoy no voy a clase, estoy enfermo.', 'Bugün derse gitmiyorum, hastayım.']),
  s.adj('ocupado', 'meşgul', ['Lo siento, estoy muy ocupado.', 'Kusura bakma, çok meşgulüm.'], { antonyms: ['libre'] }),
  s.adj('libre', 'boş; özgür', ['¿Estás libre el sábado?', 'Cumartesi boş musun?'], { antonyms: ['ocupado'] }),
  s.adj('caro', 'pahalı', ['Este restaurante es caro.', 'Bu restoran pahalı.'], { antonyms: ['barato'] }),
  s.adj('barato', 'ucuz', ['La fruta es barata en el mercado.', 'Pazarda meyve ucuz.'], { blank: 'barata', antonyms: ['caro'] }),
  s.adj('fácil', 'kolay', ['El español es fácil.', 'İspanyolca kolay.'], { antonyms: ['dificil'] }),
  s.adj('difícil', 'zor', ['El examen es difícil.', 'Sınav zor.'], { antonyms: ['facil'] }),
  s.adj('rápido', 'hızlı', ['El tren es muy rápido.', 'Tren çok hızlı.'], { antonyms: ['lento'] }),
  s.adj('lento', 'yavaş', ['El autobús es lento.', 'Otobüs yavaş.'], { antonyms: ['rapido'] }),
  s.adj('caliente', 'sıcak (nesne)', ['El café está caliente.', 'Kahve sıcak.'], { antonyms: ['frio'] }),
  s.adj('frío', 'soğuk', ['El agua está fría.', 'Su soğuk.'], { blank: 'fría', antonyms: ['caliente'] }),
  s.adj('largo', 'uzun (boyut)', ['El pelo de Sude es largo.', 'Sude’nin saçı uzun.'], { antonyms: ['corto'] }),
  s.adj('corto', 'kısa (boyut)', ['La película es corta.', 'Film kısa.'], { blank: 'corta', antonyms: ['largo'] }),
  s.adj('limpio', 'temiz', ['La cocina está limpia.', 'Mutfak temiz.'], { blank: 'limpia', antonyms: ['sucio'] }),
  s.adj('sucio', 'kirli', ['Los platos están sucios.', 'Tabaklar kirli.'], { blank: 'sucios', antonyms: ['limpio'] }),
  s.adj('abierto', 'açık', ['El museo está abierto.', 'Müze açık.'], { antonyms: ['cerrado'] }),
  s.adj('cerrado', 'kapalı', ['La farmacia está cerrada.', 'Eczane kapalı.'], { blank: 'cerrada', antonyms: ['abierto'] }),
  s.adj('delicioso', 'lezzetli', ['La paella está deliciosa.', 'Paella çok lezzetli.'], { blank: 'deliciosa' })
];
