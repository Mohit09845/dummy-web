import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import OccasionPage, { OccasionJsonLd, occasionMetadata } from '@/components/OccasionPage';
import { OCCASIONS, getOccasionBySlug } from '@/lib/occasions';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return OCCASIONS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const occ = getOccasionBySlug((await params).slug);
  return occ ? occasionMetadata(occ) : {};
}

export default async function OccasionRoute({ params }: PageProps) {
  const occ = getOccasionBySlug((await params).slug);
  if (!occ) notFound();
  return (
    <>
      <OccasionJsonLd occ={occ} />
      <OccasionPage occasion={occ} />
    </>
  );
}
