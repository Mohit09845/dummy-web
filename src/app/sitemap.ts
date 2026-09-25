import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/data/products';
import { SITE_URL } from '@/lib/site';

// Required for output: "export". There's no server to compute this per
// request, so it must resolve to a fixed value at build time.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...PRODUCTS.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
