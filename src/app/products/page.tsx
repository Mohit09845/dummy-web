import type { Metadata } from 'next';
import ProductsListingClient from '@/components/ProductsListingClient';
import JsonLd from '@/components/JsonLd';
import { FLAVOURS } from '@/lib/flavours';
import { breadcrumbSchema, itemListSchema } from '@/lib/schema';

const TITLE = 'Our Beverages: Milkshakes, Smoothies, Badam Milk & Lassi';
const DESCRIPTION =
  'All 7 flavours: Dark Fantasy Belgian chocolate and vanilla milkshakes, Sunfeast mango, berry and breakfast smoothies, and Aashirvaad badam milk and lassi.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/products' },
  openGraph: { url: '/products', title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
          ]),
          itemListSchema(
            'Sunfeast Dark Fantasy beverages',
            FLAVOURS.map(({ product, variant }) => ({
              name: variant?.name || product.name,
              path: variant ? `/product/${product.id}?variant=${variant.id}` : `/product/${product.id}`,
              image: variant?.image || product.packshot,
            })),
          ),
        ]}
      />
      <ProductsListingClient />
    </>
  );
}
