import type { Metadata } from 'next';
import ProductsListingClient from '@/components/ProductsListingClient';

export const metadata: Metadata = {
  title: 'Explore Our Products | Sunfeast & Dark Fantasy Beverages',
  description:
    'Browse our complete beverage collection — rich Belgian chocolate milkshakes, thick fruit smoothies with real Alphonso mango and berries, and authentic dairy drinks.',
  openGraph: {
    title: 'Explore Our Products | Sunfeast & Dark Fantasy Beverages',
    description:
      'Browse our complete beverage collection — rich Belgian chocolate milkshakes, thick fruit smoothies, and authentic dairy drinks.',
  },
};

export default function ProductsPage() {
  return <ProductsListingClient />;
}
