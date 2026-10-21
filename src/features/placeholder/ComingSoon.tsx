import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { ButtonLink } from '@/components/Button';

/** Henüz yapılmamış bölümler için boş durum */
export function ComingSoon({ title, icon: Icon, text }: { title: string; icon: LucideIcon; text: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState icon={<Icon className="size-5" strokeWidth={1.75} />} title="Bu bölüm hazırlanıyor" text={text} action={<ButtonLink to="/" variant="secondary">Ana sayfaya dön</ButtonLink>} />
    </>
  );
}
