/* Ek sözlük: okuma metinlerinde geçen ama kart olmayan kelimeler.
   Çoğu dilbilgisi kelimesi (artikel, edat, zamir); birkaçı metin için gereken isimler.
   Anahtar metindeki biçimdir (küçük harf). Kartlara eklenmez, popover'da anlamı görünür. */

export interface ExtraEntry { tr: string; kind: string; note?: string }

const e = (kind: string, list: Record<string, string | [string, string]>) =>
  Object.fromEntries(Object.entries(list).map(([k, v]) => [k, Array.isArray(v) ? { kind, tr: v[0], note: v[1] } : { kind, tr: v }]));

export const EXTRA: Record<string, ExtraEntry> = {
  ...e('artikel', {
    el: ['belirli artikel', 'eril tekil: el libro'],
    la: ['belirli artikel', 'dişil tekil: la casa; saatte: a la una'],
    los: ['belirli artikel', 'eril çoğul: los libros; günlerde: los lunes = pazartesileri'],
    las: ['belirli artikel', 'dişil çoğul: las casas; saatte: a las siete'],
    un: ['bir', 'eril: un libro'],
    una: ['bir', 'dişil: una casa; saatte: la una = saat bir'],
    unos: ['birkaç', 'eril çoğul'],
    unas: ['birkaç', 'dişil çoğul']
  }),
  ...e('edat', {
    a: ['-e, -a; saatte -de', 'Voy a Madrid. A las seis.'],
    al: ['-e (a + el)', 'Voy al parque.'],
    de: ['-in; -den; -li', 'la casa de Ana · Soy de Sevilla.'],
    del: ['-in; -den (de + el)', 'la mesa del salón'],
    en: ['-de, içinde; ile (taşıt)', 'en casa · en autobús'],
    con: 'ile',
    para: 'için',
    por: ['boyunca; ile; için', 'por la mañana = sabahleyin · por teléfono = telefonda'],
    desde: '-den; -den beri',
    hasta: '-e kadar',
    cerca: ['yakın', 'cerca de = -in yakınında']
  }),
  ...e('bağlaç', {
    y: 've',
    e: ['ve', 'i- sesiyle başlayan kelimeden önce: español e inglés'],
    o: 'veya, ya da',
    pero: 'ama',
    porque: 'çünkü',
    que: 'ki; -en, -an',
    como: 'gibi; olarak'
  }),
  ...e('soru kelimesi', {
    qué: 'ne',
    dónde: 'nerede',
    cómo: 'nasıl',
    cuándo: 'ne zaman',
    quién: 'kim'
  }),
  ...e('zamir', {
    yo: 'ben', tú: 'sen', él: 'o (erkek)', ella: 'o (kadın)', usted: 'siz (resmî)',
    nosotros: 'biz', vosotros: 'siz', ellos: 'onlar', ellas: 'onlar (kadın)',
    mí: ['ben', 'edattan sonra: para mí = benim için'],
    me: ['bana, beni; kendimi', 'me llamo, me gusta'],
    te: ['sana, seni; kendini', 'te gusta'],
    se: ['kendini (dönüşlü)', 'se llama'],
    nos: 'bize, bizi',
    os: 'size, sizi',
    le: ['ona', 'le gusta'],
    les: ['onlara', 'les gusta'],
    todo: 'her şey; bütün',
    todos: 'herkes; hepsi, bütün',
    toda: 'bütün',
    nada: 'hiçbir şey'
  }),
  ...e('iyelik', {
    mi: 'benim', mis: 'benim (çoğul)',
    tu: 'senin', tus: 'senin (çoğul)',
    su: 'onun; onların; sizin', sus: 'onun; onların (çoğul)',
    nuestro: 'bizim', nuestra: 'bizim'
  }),
  ...e('işaret', {
    este: 'bu', esta: 'bu', estos: 'bunlar', estas: 'bunlar'
  }),
  ...e('zarf', {
    muy: 'çok (sıfattan önce)',
    mucho: 'çok', mucha: 'çok', muchos: 'çok, birçok', muchas: 'çok, birçok',
    poco: ['az', 'un poco = biraz'],
    más: 'daha',
    también: 'de, da; ayrıca',
    aquí: 'burada',
    allí: 'orada',
    después: 'sonra',
    juntos: 'birlikte',
    otra: ['başka', 'otra vez = yine, bir daha'],
    claro: 'tabii, elbette',
    sola: 'yalnız, tek başına'
  }),
  ...e('fiil', {
    hay: ['var', 'haber fiilinden: Hay una mesa.'],
    gusta: ['hoşa gidiyor', 'gustar, tekil: me gusta el café'],
    gustan: ['hoşa gidiyor', 'gustar, çoğul: me gustan los perros'],
    cuesta: ['fiyatı …', 'costar: cuesta veinte euros']
  }),
  ...e('isim', {
    media: ['buçuk', 'las siete y media = yedi buçuk'],
    euros: 'euro',
    gente: 'insanlar',
    español: 'İspanyolca; İspanyol',
    inglés: 'İngilizce',
    turco: 'Türkçe; Türk',
    fútbol: 'futbol',
    camisa: 'gömlek',
    chaqueta: 'ceket',
    final: ['son', 'al final = sonunda'],
    problema: 'sorun',
    mamá: 'anne (hitap)',
    vacaciones: ['tatil', 'de vacaciones = tatilde'],
    palabras: 'kelimeler',
    vez: ['kez', 'otra vez = yine'],
    compañeros: 'iş arkadaşları',
    cumpleaños: 'doğum günü',
    nietos: 'torunlar',
    paella: 'paella (pirinç yemeği)'
  })
};
