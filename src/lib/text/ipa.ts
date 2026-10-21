/* İspanyolca yazımdan geniş (fonemik) IPA — İspanya telaffuzu.
   c(e,i) ve z → θ (distinción), ll ve ünsüz y → ʝ (yeísmo), j / g(e,i) → x.
   Vurgu: yazılı aksan; yoksa sesli harf, n veya s ile bitende sondan bir önceki hece, diğerlerinde son hece.
   Tek heceli sözcüklere vurgu işareti konmaz. Gerekirse kelimede `ipa` elle verilir. */

const VOWELS = 'aeiouáéíóúü';
const STRONG = 'aeoáéóíú'; // vurgulu i/u hiatus yapar, güçlü sayılır
const isVowel = (c?: string) => !!c && VOWELS.includes(c);
const ACCENTED: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };
const INSEPARABLE = ['pl', 'pr', 'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'tr', 'kl', 'kr'];

/** Harfleri ses birimlerine (yazım düzeyinde) ayır: ch, ll, rr, qu, gu+e/i tek birim */
function units(w: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < w.length; i++) {
    const two = w.slice(i, i + 2);
    if (two === 'ch' || two === 'll' || two === 'rr') { out.push(two); i++; continue; }
    if ((two === 'qu' || two === 'gu') && 'eiéí'.includes(w[i + 2] ?? '')) { out.push(two); i++; continue; }
    out.push(w[i]!);
  }
  return out;
}

/** Heceleme: birim dizisini hecelere böl */
function syllables(us: string[]): string[][] {
  const isV = (u?: string) => !!u && u.length === 1 && isVowel(u);
  const sylls: string[][] = [];
  let cur: string[] = [];
  let i = 0;
  while (i < us.length) {
    // ünsüzler
    while (i < us.length && !isV(us[i])) cur.push(us[i++]!);
    // sesli çekirdek (diftong/triftong)
    if (i < us.length) {
      cur.push(us[i++]!);
      while (i < us.length && isV(us[i])) {
        const prev = cur[cur.length - 1]!;
        const next = us[i]!;
        const hiatus = STRONG.includes(prev) && STRONG.includes(next);
        if (hiatus) break;
        cur.push(us[i++]!);
      }
    }
    // sonraki ünsüz kümesini böl
    let j = i;
    while (j < us.length && !isV(us[j])) j++;
    const cons = us.slice(i, j);
    if (j >= us.length) { cur.push(...cons); i = j; sylls.push(cur); cur = []; break; }
    let keep: string[];
    if (cons.length <= 1) keep = [];
    else {
      const last2 = cons.slice(-2).join('');
      const take = INSEPARABLE.includes(last2) ? 2 : 1;
      keep = cons.slice(0, cons.length - take);
    }
    cur.push(...keep);
    i += keep.length;
    sylls.push(cur);
    cur = [];
  }
  if (cur.length) {
    if (sylls.length && !cur.some((u) => isV(u))) sylls[sylls.length - 1]!.push(...cur);
    else sylls.push(cur);
  }
  return sylls.filter((s) => s.length);
}

function stressIndex(w: string, sylls: string[][]): number {
  const acc = sylls.findIndex((s) => s.some((u) => u in ACCENTED));
  if (acc >= 0) return acc;
  if (sylls.length === 1) return 0;
  const last = w[w.length - 1]!;
  return isVowel(last) || last === 'n' || last === 's' ? sylls.length - 2 : sylls.length - 1;
}

/** Tek bir birimin sesi (bağlama göre) */
function sound(u: string, prev: string | undefined, next: string | undefined, wordStart: boolean, sylNucleus: string[]): string {
  const nextV = next ?? '';
  switch (u) {
    case 'ch': return 'tʃ';
    case 'll': return 'ʝ';
    case 'rr': return 'r';
    case 'qu': return 'k';
    case 'gu': return 'g';
    case 'ñ': return 'ɲ';
    case 'h': return '';
    case 'j': return 'x';
    case 'v': return 'b';
    case 'z': return 'θ';
    case 'x': return 'ks';
    case 'w': return 'w';
    case 'c': return 'eiéí'.includes(nextV[0] ?? '') ? 'θ' : 'k';
    case 'g': return 'eiéí'.includes(nextV[0] ?? '') ? 'x' : 'g';
    case 'r': return wordStart || prev === 'n' || prev === 'l' || prev === 's' ? 'r' : 'ɾ';
    case 'y': return isVowel(nextV[0]) ? 'ʝ' : 'i';
    case 'ü': return 'w';
    default: break;
  }
  if (u in ACCENTED) return ACCENTED[u]!;
  if (u === 'i' || u === 'u') {
    // diftongda zayıf sesli kayma sesi olur
    const vowelsHere = sylNucleus.filter((x) => x.length === 1 && isVowel(x));
    if (vowelsHere.length > 1) {
      const strongHere = vowelsHere.some((x) => STRONG.includes(x));
      const idx = sylNucleus.indexOf(u);
      const isGlide = strongHere || (vowelsHere.length === 2 && idx === sylNucleus.findIndex((x) => isVowel(x)));
      if (isGlide) return u === 'i' ? 'j' : 'w';
    }
    return u;
  }
  return u;
}

function wordIpa(raw: string, mark = true): string {
  const w = raw.toLocaleLowerCase('es');
  const us = units(w);
  const sylls = syllables(us);
  const stress = stressIndex(w, sylls);
  let flat = 0;
  const parts = sylls.map((syl, si) => {
    let s = syl.map((u, k) => {
      const gi = flat + k;
      return sound(u, us[gi - 1], us[gi + 1], gi === 0, syl);
    }).join('');
    flat += syl.length;
    // kelime sonu "y": diftongun kayma sesi (hoy → oj, muy → mwi)
    if (si === sylls.length - 1 && w.endsWith('y') && syl.length > 1 && isVowel(syl[syl.length - 2])) {
      s = w.endsWith('uy') ? s.replace(/ui$/, 'wi') : s.replace(/i$/, 'j');
    }
    return s;
  });
  // sesliler arasındaki x: k önceki heceye (examen → ek.sa.men)
  for (let i = 1; i < parts.length; i++) {
    if (parts[i]!.startsWith('ks') && /[aeiou]$/.test(parts[i - 1]!)) { parts[i - 1] += 'k'; parts[i] = parts[i]!.slice(1); }
  }
  return parts.map((p, si) => (mark && parts.length > 1 && si === stress ? 'ˈ' : '') + p).join('');
}

/** Kelime ya da ifade için IPA ("buenos días" → ˈbwenos ˈdias) */
export function toIpa(text: string): string {
  return text
    .replace(/[¿?¡!.,;:]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => wordIpa(w))
    .join(' ');
}
