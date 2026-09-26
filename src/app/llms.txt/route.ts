// /llms.txt: a plain-text summary of the site for AI answer engines (GEO).
// Built from the same data as the pages, so it can't drift out of sync.
import { PRODUCTS } from '@/data/products';
import { OCCASIONS, occasionPath } from '@/lib/occasions';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const products = PRODUCTS.map((p) => {
    const flavours = p.variants.length ? `\n  Flavours: ${p.variants.map((v) => v.name).join(', ')}` : '';
    return `- [${p.name}](${SITE_URL}/product/${p.id}): ${p.brand} ${p.category.toLowerCase()}, ${p.volume}. ${p.description}${flavours}\n  Highlights: ${p.highlights.join('; ')}`;
  }).join('\n');

  const occasions = OCCASIONS.map(
    (o) => `- [${o.page}](${SITE_URL}${occasionPath(o)}): ${o.question} ${o.answer}`,
  ).join('\n');

  const body = `# ${SITE_NAME}

> Ready-to-drink beverages from ITC Limited's Dark Fantasy, Sunfeast and Aashirvaad brands, sold in India: Belgian chocolate milkshakes, real-fruit smoothies, badam (almond) milk and lassi. All 100% vegetarian, UHT processed in aseptic Tetra Pak with no chemical preservatives.

## Products
${products}

## Occasion guides
${occasions}

## Where to buy
Blinkit, Zepto, Swiggy Instamart, BigBasket, Amazon, Flipkart, JioMart, and select supermarkets in India.

## Pages
- [Home](${SITE_URL}/)
- [All products](${SITE_URL}/products)
- [FAQs](${SITE_URL}/#faq)

## Contact
Consumer care: consumer.care@itc.in
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
