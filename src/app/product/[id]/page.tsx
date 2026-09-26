import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PRODUCTS, getProductById } from '@/data/products';
import ProductPageClient from '@/components/ProductPageClient';
import JsonLd from '@/components/JsonLd';
import { getProductFaqs } from '@/lib/productFaq';
import { breadcrumbSchema, faqSchema, productSchema } from '@/lib/schema';

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
  const title = `${product.name} (${product.volume})`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      type: 'website',
      url: `/product/${product.id}`,
      title,
      description: product.description,
      images: [{ url: product.packshot, alt: `${product.name} pack` }],
    },
    twitter: { title, description: product.description, images: [product.packshot] },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <>
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: product.shortName, path: `/product/${product.id}` },
          ]),
          faqSchema(getProductFaqs(product)),
        ]}
      />
      <ProductPageClient product={product} />
    </>
  );
}
