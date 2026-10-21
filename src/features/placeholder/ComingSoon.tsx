import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { ButtonLink } from '@/components/Button';

/** Henüz yapılmamış bölümler için düzgün bir boş durum */
export function ComingSoon({ title, emoji, text }: { title: string; emoji: string; text: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState emoji={emoji} title="Bu bölüm hazırlanıyor" text={text} action={<ButtonLink to="/" variant="secondary">Ana sayfaya dön</ButtonLink>} />
    </>
  );
}

export const comingSoon = (title: string, emoji: string, text: string) => () => <ComingSoon title={title} emoji={emoji} text={text} />;
