import { Link, useParams } from 'react-router';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ConjugationTable, display, Example, FavoriteButton, Ipa, POS_LABEL, StatusBadge } from '@/components/WordBits';
import { WORD_BY_ID, TOPIC_LABEL, isVerb } from '@/content/vocabulary';
import { addWord } from '@/lib/srs/study';
import { repos } from '@/lib/storage';
import { useSettings } from '@/app/settings';
import { untilText } from '@/lib/srs/humanize';
import { useWordData } from './useWordData';

function Row({ k, v }: { k: string; v?: React.ReactNode }) {
  if (!v) return null;
  return (
    <div className="flex justify-between gap-4 border-t border-line py-2.5 first:border-t-0">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

const WordLinks = ({ ids }: { ids?: string[] }) => (ids?.length ? (
  <span className="flex flex-wrap justify-end gap-x-3">{ids.map((id) => WORD_BY_ID[id] && <Link key={id} to={`/kelimeler/${id}`} lang="es" className="text-accent-ink underline decoration-line-2 underline-offset-4 hover:decoration-accent">{display(WORD_BY_ID[id]!)}</Link>)}</span>
) : null);

export default function WordDetailPage() {
  const { id = '' } = useParams();
  const w = WORD_BY_ID[id];
  const { settings } = useSettings();
  const data = useWordData();
  const [added, setAdded] = useState(false);

  if (!w) return <EmptyState title="Kelime bulunamadı" action={<Link to="/kelimeler" className="text-accent-ink underline">Kelimelere dön</Link>} />;
  const status = data.status.get(w.id) ?? 'new';
  const due = data.nextDue.get(w.id);
  const inDeck = (data.byWord.get(w.id)?.length ?? 0) > 0;

  return (
    <>
      <Link to="/kelimeler" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="size-4" strokeWidth={1.75} /> Kelimeler</Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="eyebrow mb-3">{POS_LABEL[w.partOfSpeech]} · {w.level} · {w.tags.map((t) => TOPIC_LABEL[t]).join(', ')}</p>
          <h1 lang="es" className="display text-[3rem] leading-none sm:text-[4rem]">{display(w)}</h1>
          <p className="mt-3 text-lg"><Ipa w={w} /></p>
          <p className="mt-4 text-2xl text-ink-2">{w.tr}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <FavoriteButton wordId={w.id} active={data.favorites.has(w.id)} />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-5">
          <Card className="sm:p-7">
            <p className="eyebrow mb-3">Örnek</p>
            <Example w={w} />
            <p className="mt-2 text-ink-2">{w.exampleTr}</p>
          </Card>
          {isVerb(w) && <Card className="sm:p-7"><ConjugationTable verb={w} /></Card>}
          {w.latamNote && (
            <Card className="border-dashed sm:p-7">
              <p className="eyebrow mb-2">Latin Amerika notu</p>
              <p className="text-ink-2">{w.latamNote}</p>
            </Card>
          )}
        </div>

        <div className="grid content-start gap-5">
          <Card className="sm:p-7">
            <dl className="text-[15px]">
              <Row k="Artikel" v={w.article ?? undefined} />
              <Row k="Cinsiyet" v={w.gender === 'm' ? 'eril' : w.gender === 'f' ? 'dişil' : undefined} />
              <Row k="Dişil biçim" v={w.feminine && w.feminine !== w.es ? <span lang="es">{w.feminine}</span> : undefined} />
              <Row k="Çoğul" v={w.plural ? <span lang="es">{w.article ? `${w.article === 'el' ? 'los' : 'las'} ` : ''}{w.plural}</span> : undefined} />
              <Row k="Eş anlamlı" v={w.synonyms?.length ? <span lang="es">{w.synonyms.join(', ')}</span> : undefined} />
              <Row k="Zıt anlamlı" v={w.antonyms?.length ? <WordLinks ids={w.antonyms} /> : undefined} />
              <Row k="İlişkili" v={w.related?.length ? <WordLinks ids={w.related} /> : undefined} />
            </dl>
          </Card>
          <Card className="sm:p-7">
            <p className="eyebrow mb-3">Tekrar</p>
            {inDeck ? (
              <p className="text-ink-2">Kartlarında. Sonraki tekrar: <strong className="font-semibold text-ink">{due ? untilText(new Date(due), new Date(), settings.timezone, settings.dayStartsAt) : '—'}</strong></p>
            ) : (
              <>
                <p className="mb-4 text-ink-2">Bu kelime henüz kartlarında değil.</p>
                <Button variant="secondary" icon={added ? <Check className="size-4" /> : <Plus className="size-4" />} disabled={added}
                  onClick={async () => { await addWord(repos, settings, w); setAdded(true); }}>
                  {added ? 'Eklendi' : 'Kartlarıma ekle'}
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
