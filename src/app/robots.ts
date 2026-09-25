import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Required for output: "export". There's no server to compute this per
// request, so it must resolve to a fixed value at build time.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
