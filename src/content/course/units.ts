/* A1 kursu: 8 ünite. Burada yalnız id'ler var; kelime, grammar ve okumalar kendi dosyalarında.
   Sıra: Ders → Kelimeler → Alıştırma → Quiz → Okuma → Ünite testi. */
import type { Unit } from '@/types/content';

export const UNITS: Unit[] = [
  {
    id: 'u1', order: 1, title: '¡Hola!', titleTr: 'Merhaba!',
    goal: 'Selamlaşır, kendini tanıtır, nereli olduğunu ve ne iş yaptığını söylersin.',
    wordIds: ['hola', 'adios', 'buenos-dias', 'buenas-tardes', 'buenas-noches', 'hasta-luego', 'hasta-manana', 'por-favor', 'gracias', 'de-nada', 'perdon', 'si', 'no', 'que-tal', 'bien', 'mal', 'encantado', 'senor', 'senora', 'amigo', 'amiga', 'estudiante', 'ser', 'llamarse'],
    grammarIds: ['pronombres', 'ser'],
    readingIds: ['me-presento', 'un-cafe-en-madrid'],
    unitTestQuestionIds: ['pronombres-1', 'pronombres-2', 'pronombres-6', 'pronombres-10', 'ser-1', 'ser-2', 'ser-5', 'ser-8', 'okuma-me-presento-1', 'okuma-un-cafe-en-madrid-3']
  },
  {
    id: 'u2', order: 2, title: 'Mi familia', titleTr: 'Ailem',
    goal: 'Aileni anlatır, yaşını söyler ve ona kadar sayarsın.',
    wordIds: ['familia', 'padre', 'madre', 'hermano', 'hermana', 'hijo', 'hija', 'abuelo', 'abuela', 'tio', 'tia', 'marido', 'novio', 'novia', 'tener', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'veinte', 'treinta'],
    grammarIds: ['tener', 'articulos', 'genero', 'numeros'],
    readingIds: ['mi-familia', 'el-cumpleanos'],
    unitTestQuestionIds: ['tener-1', 'tener-3', 'tener-7', 'articulos-1', 'articulos-3', 'genero-1', 'genero-2', 'numeros-1', 'numeros-3', 'okuma-mi-familia-1', 'okuma-el-cumpleanos-1']
  },
  {
    id: 'u3', order: 3, title: 'Mi casa', titleTr: 'Evim',
    goal: 'Evini anlatır, bir şeyin nerede olduğunu ve ne olduğunu söylersin.',
    wordIds: ['casa', 'piso', 'habitacion', 'dormitorio', 'cocina', 'bano', 'salon', 'puerta', 'ventana', 'mesa', 'silla', 'cama', 'sofa', 'armario', 'llave', 'nevera', 'ordenador', 'movil', 'estar', 'vivir', 'grande', 'pequeno'],
    grammarIds: ['estar', 'hay-estar', 'preposiciones', 'plural'],
    readingIds: ['mi-piso', 'la-llave'],
    unitTestQuestionIds: ['estar-1', 'estar-2', 'estar-8', 'hay-estar-1', 'hay-estar-2', 'preposiciones-1', 'preposiciones-3', 'plural-1', 'plural-3', 'okuma-mi-piso-2', 'okuma-la-llave-4']
  },
  {
    id: 'u4', order: 4, title: '¡A comer!', titleTr: 'Yemek zamanı',
    goal: 'Barda ve restoranda sipariş verir, neyi sevdiğini söylersin.',
    wordIds: ['comida', 'desayuno', 'cena', 'agua', 'cafe', 'te-cay', 'leche', 'zumo', 'cerveza', 'vino', 'pan', 'queso', 'jamon', 'huevo', 'pollo', 'pescado', 'ensalada', 'fruta', 'naranja-meyve', 'tortilla', 'cuenta', 'comer', 'beber', 'tomar', 'querer', 'delicioso'],
    grammarIds: ['verbos-ar', 'verbos-er', 'gustar'],
    readingIds: ['en-el-bar'],
    unitTestQuestionIds: ['verbos-ar-1', 'verbos-ar-2', 'verbos-ar-8', 'verbos-er-1', 'verbos-er-2', 'verbos-er-9', 'gustar-1', 'gustar-2', 'gustar-3', 'okuma-en-el-bar-2', 'okuma-en-el-bar-4']
  },
  {
    id: 'u5', order: 5, title: 'La ciudad', titleTr: 'Şehir',
    goal: 'Semtini anlatır, yer sorar ve nereye nasıl gittiğini söylersin.',
    wordIds: ['ciudad', 'calle', 'plaza', 'parque', 'museo', 'tienda', 'supermercado', 'mercado', 'banco', 'hospital', 'farmacia', 'estacion', 'restaurante', 'bar', 'oficina', 'playa', 'barrio', 'coche', 'autobus', 'metro', 'tren', 'bicicleta', 'ir'],
    grammarIds: ['verbos-ir', 'ser-estar', 'preguntas'],
    readingIds: ['mi-barrio'],
    unitTestQuestionIds: ['verbos-ir-1', 'verbos-ir-2', 'verbos-ir-9', 'ser-estar-1', 'ser-estar-2', 'ser-estar-3', 'preguntas-1', 'preguntas-2', 'preguntas-3', 'okuma-mi-barrio-3', 'okuma-mi-barrio-4']
  },
  {
    id: 'u6', order: 6, title: 'Mi día', titleTr: 'Günüm',
    goal: 'Günlük rutinini, saatleri ve haftanın günlerini anlatırsın.',
    wordIds: ['despertarse', 'levantarse', 'ducharse', 'acostarse', 'dormir', 'volver', 'empezar', 'trabajar', 'hora', 'manana-sabah', 'tarde-ogleden-sonra', 'noche', 'hoy', 'ahora', 'siempre', 'temprano', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo', 'fin-de-semana'],
    grammarIds: ['reflexivos', 'hora', 'fechas'],
    readingIds: ['un-dia-normal', 'la-semana-de-diego'],
    unitTestQuestionIds: ['reflexivos-1', 'reflexivos-2', 'reflexivos-3', 'hora-1', 'hora-2', 'hora-3', 'fechas-1', 'fechas-2', 'fechas-3', 'okuma-un-dia-normal-2', 'okuma-la-semana-de-diego-1']
  },
  {
    id: 'u7', order: 7, title: 'El trabajo', titleTr: 'İş',
    goal: 'Mesleğini ve işini anlatır, soru sorar, olumsuz cümle kurarsın.',
    wordIds: ['trabajo', 'empresa', 'medico', 'enfermero', 'profesor', 'camarero', 'cocinero', 'abogado', 'ingeniero', 'policia', 'programador', 'arquitecto', 'periodista', 'llegar', 'necesitar', 'aprender', 'hablar', 'estudiar', 'ocupado', 'cansado'],
    grammarIds: ['negacion', 'posesivos'],
    readingIds: ['el-nuevo-trabajo'],
    unitTestQuestionIds: ['negacion-1', 'negacion-2', 'negacion-3', 'negacion-4', 'posesivos-1', 'posesivos-2', 'posesivos-3', 'posesivos-10', 'okuma-el-nuevo-trabajo-1', 'okuma-el-nuevo-trabajo-3']
  },
  {
    id: 'u8', order: 8, title: '¿Cómo es?', titleTr: 'Nasıl biri?',
    goal: 'İnsanları ve eşyaları tarif eder, yakın planlarını anlatırsın.',
    wordIds: ['color', 'rojo', 'azul', 'verde', 'blanco', 'negro', 'gris', 'bonito', 'guapo', 'alto', 'bajo', 'joven', 'simpatico', 'divertido', 'inteligente', 'contento', 'caro', 'barato', 'nuevo', 'viejo', 'comprar', 'preferir', 'viajar'],
    grammarIds: ['adjetivos', 'ir-a'],
    readingIds: ['en-la-tienda', 'mis-amigos'],
    unitTestQuestionIds: ['adjetivos-1', 'adjetivos-2', 'adjetivos-3', 'adjetivos-8', 'ir-a-1', 'ir-a-2', 'ir-a-3', 'ir-a-8', 'okuma-en-la-tienda-2', 'okuma-mis-amigos-2']
  }
];

export const UNIT_BY_ID: Record<string, Unit> = Object.fromEntries(UNITS.map((u) => [u.id, u]));
