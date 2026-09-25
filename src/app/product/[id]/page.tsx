import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PRODUCTS, getProductById } from '@/data/products';
import ProductPageClient from '@/components/ProductPageClient';
import { SITE_URL } from '@/lib/site';
import { getProductFaqs } from '@/lib/productFaq';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} | Dark Fantasy Beverages`,
    description: product.longDescription,
    alternates: {
      canonical: `/product/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | Dark Fantasy Beverages`,
      description: product.description,
      url: `/product/${product.id}`,
      images: [{ url: product.packshot }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  // Only fields with real, visible-on-page values. No price/availability
  // is shown anywhere on the site, so `offers` is intentionally omitted
  // rather than filled with placeholder data.
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.longDescription,
    image: `${SITE_URL}${product.packshot}`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getProductFaqs(product).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
