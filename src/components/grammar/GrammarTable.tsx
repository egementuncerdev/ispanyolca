import type { GrammarTopic } from '@/types/content';

/** İspanyolca kısımları ayırt etmek için: tablo hücreleri ve örnekler İspanyolca */
export function GrammarTable({ t }: { t: GrammarTopic }) {
  if (!t.table) return null;
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left text-[15px] ${t.table.headers.length > 2 ? 'min-w-[30rem]' : ''}`}>
        {t.table.caption && <caption className="eyebrow mb-2 text-left" lang="es">{t.table.caption}</caption>}
        <thead><tr className="border-b border-line-2">{t.table.headers.map((h, i) => <th key={i} scope="col" className="py-2 pr-4 font-semibold text-muted">{h || <span className="sr-only">{i === 0 ? 'Biçim' : 'Örnek'}</span>}</th>)}</tr></thead>
        <tbody>
          {t.table.rows.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="py-2.5 pr-4 font-normal text-muted">{c}</th> : <td key={j} className="py-2.5 pr-4 font-medium">{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

