// JSON-LD builders. Only facts that are already visible on the site go in
// here (see AGENTS.md "No fabrication"): no prices, ratings, stock, or
// claims that aren't in src/data or on-page copy.
import type { Product } from '@/data/products';
import type { FaqItem } from '@/components/FaqSection';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`);

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// Social profiles linked from the footer.
export const SAME_AS = [
  'https://www.instagram.com/darkfantasycreations',
  'https://www.facebook.com/darkfantasy',
  'https://x.com/darkfantasycreations',
  'https://darkfantasycreations.com/',
];

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: abs('/assets/logos/df-logo.webp'),
    parentOrganization: { '@type': 'Organization', name: 'ITC Limited' },
    brand: ['Dark Fantasy', 'Sunfeast', 'Aashirvaad'].map((name) => ({ '@type': 'Brand', name })),
    sameAs: SAME_AS,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'consumer.care@itc.in',
      areaServed: 'IN',
      availableLanguage: ['en'],
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function itemListSchema(name: string, items: { name: string; path: string; image?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: abs(item.path),
      ...(item.image ? { image: abs(item.image) } : {}),
    })),
  };
}

// No `offers`: the site shows no price or availability, so none is claimed.
export function productSchema(product: Product) {
  const url = abs(`/product/${product.id}`);
  const base = {
    brand: { '@type': 'Brand', name: product.brand },
    manufacturer: { '@id': ORG_ID },
    category: product.category,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Net quantity', value: product.volume },
      { '@type': 'PropertyValue', name: 'Packaging', value: 'Aseptic Tetra Pak' },
      { '@type': 'PropertyValue', name: 'Diet', value: '100% vegetarian' },
      { '@type': 'PropertyValue', name: 'Ingredients', value: product.ingredients.join(', ') },
    ],
  };

  if (product.variants.length > 1) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProductGroup',
      '@id': `${url}#group`,
      name: product.name,
      description: product.longDescription,
      url,
      image: [abs(product.packshot), abs(product.backshotImage)],
      productGroupID: product.id,
      variesBy: 'https://schema.org/flavor',
      ...base,
      hasVariant: product.variants.map((v) => ({
        '@type': 'Product',
        name: v.name,
        description: v.tagline,
        url: `${url}?variant=${v.id}`,
        image: [abs(v.image), abs(v.backImage)],
        ...base,
      })),
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.longDescription,
    url,
    image: [abs(product.packshot), abs(product.backshotImage)],
    ...base,
  };
}
