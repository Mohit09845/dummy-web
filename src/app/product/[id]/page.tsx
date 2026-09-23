import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PRODUCTS, getProductById } from '@/data/products';
import ProductPageClient from '@/components/ProductPageClient';

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
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
