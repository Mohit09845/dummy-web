import type { Metadata } from 'next';
import OccasionPage, { OccasionJsonLd, occasionMetadata } from '@/components/OccasionPage';
import { OCCASIONS } from '@/lib/occasions';

// /occasions shows the first occasion. Its canonical is that occasion's own
// URL (/occasions/beat-the-heat) so the two never compete in search.
const first = OCCASIONS[0];

export const metadata: Metadata = occasionMetadata(first);

export default function OccasionsIndex() {
  return (
    <>
      <OccasionJsonLd occ={first} />
      <OccasionPage occasion={first} />
    </>
  );
}
