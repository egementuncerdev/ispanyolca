/* İçerik kontrol listesini üretir: REVIEW=1 npx vitest run src/content/__tests__/review-list.test.ts */
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { TOPICS, WORDS, isVerb } from '../vocabulary';
import { withArticle } from '../vocabulary/helpers';
import { PERSONS } from '../verbs/conjugate';
import { GRAMMAR } from '../grammar';

it.runIf(process.env.REVIEW)('içerik listesi', () => {
  const out = ['# İçerik kontrol listesi', '', `${WORDS.length} kelime. Yanlış ya da doğal olmayan bir şey görürsen not et.`, ''];
  for (const t of TOPICS) {
    const ws = WORDS.filter((w) => w.tags[0] === t.id);
    if (!ws.length) continue;
    out.push(`## ${t.label} (${ws.length})`, '', '| İspanyolca | Türkçe | IPA | Örnek | Çeviri |', '|---|---|---|---|---|');
    for (const w of ws) out.push(`| ${withArticle(w)}${w.feminine && w.feminine !== w.es ? ` / ${w.feminine}` : ''}${w.plural ? ` (çoğ. ${w.plural})` : ''} | ${w.tr} | /${w.ipa}/ | ${w.exampleEs} | ${w.exampleTr} |`);
    out.push('');
  }
  out.push('## Fiil çekimleri (presente)', '', '| Fiil | yo | tú | él | nosotros | vosotros | ellos |', '|---|---|---|---|---|---|---|');
  for (const w of WORDS) if (isVerb(w)) out.push(`| ${w.es}${w.regular ? '' : ' *'} | ${PERSONS.map((p) => w.conjugations.presente[p]).join(' | ')} |`);
  out.push('', '\\* düzensiz ya da kök değişimli', '', '# Grammar', '');
  for (const t of GRAMMAR) {
    out.push(`## ${t.title}`, '', t.summary, '');
    for (const e of t.examples) out.push(`- ${e.es} — ${e.tr}`);
    out.push('', '| Tip | Soru | Doğru cevap |', '|---|---|---|');
    for (const q of [...t.check, ...t.questions]) out.push(`| ${q.type} | ${q.type === 'word_order' ? '(sıralama)' : q.prompt.replace(/\|/g, '/')} | ${q.answers.join(' · ')}${q.options ? ` (şıklar: ${q.options.slice(1).join(', ')})` : ''} |`);
    out.push('');
  }
  writeFileSync('CONTENT_REVIEW.md', out.join('\n') + '\n');
});
