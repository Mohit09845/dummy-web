import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/data/products';
import { OCCASIONS, occasionPath } from '@/lib/occasions';
import { SITE_URL } from '@/lib/site';
import { abs } from '@/lib/schema';

// Required for output: "export". There's no server to compute this per
// request, so it must resolve to a fixed value at build time.
export const dynamic = 'force-static';

// Only canonical URLs belong here (not /occasions, whose canonical is
// /occasions/beat-the-heat, and not ?variant= URLs).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      images: [abs('/assets/kvs/og-image.jpg')],
    },
    {
      url: `${SITE_URL}/products`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...PRODUCTS.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [
        ...(product.variants.length ? product.variants.map((v) => v.image) : [product.packshot]),
      ].map(abs),
    })),
    ...OCCASIONS.map((occ) => ({
      url: `${SITE_URL}${occasionPath(occ)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      images: [abs(occ.bannerImage)],
    })),
  ];
}
