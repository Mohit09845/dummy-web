'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Check, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant } from '@/data/products';
import { FLAVOURS } from '@/lib/flavours';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { flavourToProductCard } from '@/components/ProductCard';
import FaqSection from '@/components/FaqSection';
import Reveal from '@/components/Reveal';
import { getProductFaqs } from '@/lib/productFaq';

// Only needed after a click, so it stays out of the route's initial JS.
const BuyNowModal = dynamic(() => import('@/components/BuyNowModal'), { ssr: false });

interface ProductPageClientProps {
  product: Product;
}

interface GalleryImage {
  id: string;
  name: string;
  label: string;
  image: string;
}

// The packshot files referenced by product data are sized for the small
// card contexts (ProductCard, DrinkQuiz) where most of them are used. This
// stage is the one place that shows them much larger,
// so it asks for the "-detail" variant generated alongside each one.
function toDetail(src: string): string {
  return src.replace(/\.webp$/, '-detail.webp');
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const hasVariants = Boolean(product.variants && product.variants.length > 1);
  const productFaqs = useMemo(() => getProductFaqs(product), [product]);
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyRequested, setBuyRequested] = useState(false);
  const closeBuy = useCallback(() => setBuyOpen(false), []);
  const openBuy = () => {
    setBuyRequested(true);
    setBuyOpen(true);
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  // Open on the variant the visitor was previewing (e.g. hovered on the
  // listing page) instead of always defaulting to the first flavour.
  // Deferred to an effect (not a lazy useState initializer) because this
  // route is statically exported: the prerendered HTML can't know about
  // `?variant=`, so reading it during render would mismatch on hydration.
  useEffect(() => {
    const variantId = new URLSearchParams(window.location.search).get('variant');
    if (!variantId || !product.variants) return;
    const variant = product.variants.find((v) => v.id === variantId);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing initial UI state from the URL once on mount, not reacting to external changes
    if (variant) setSelectedVariant(variant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const galleryImages = useMemo<GalleryImage[]>(() => {
    const front = selectedVariant?.image || product.packshot;
    const back = selectedVariant?.backImage || product.backshotImage;
    const images: GalleryImage[] = [];
    if (front) images.push({ id: 'front', name: selectedVariant?.name || product.name, label: 'Front of pack', image: toDetail(front) });
    if (back) images.push({ id: 'back', name: selectedVariant?.name || product.name, label: 'Back of pack', image: toDetail(back) });
    return images;
  }, [product, selectedVariant]);

  const [viewIndex, setViewIndex] = useState(0);
  const [swapped, setSwapped] = useState(false);

  // Reset to the front pack whenever the visitor switches flavour. Adjusted
  // during render (React's recommended pattern) rather than in an effect,
  // since it's deriving state from a prop-like change, not syncing with an
  // external system.
  const [lastVariantId, setLastVariantId] = useState(selectedVariant?.id);
  if (selectedVariant?.id !== lastVariantId) {
    setLastVariantId(selectedVariant?.id);
    setViewIndex(0);
  }

  const currentView = galleryImages[viewIndex] || galleryImages[0];
  const tint = `color-mix(in srgb, ${selectedVariant?.color || product.accentColor} 24%, #F2E8D5)`;

  const related = useMemo(() => FLAVOURS.filter((f) => f.product.id !== product.id).slice(0, 4), [product.id]);

  return (
    <>
      <Header />

      <main style={{ background: 'var(--bg-light)', color: 'var(--text-on-light)' }} className="pt-16 sm:pt-[76px] lg:pt-[84px]">
        {/* ── Product hero ── */}
        <section className="pt-8 pb-8 sm:pb-10 px-5 sm:px-10 lg:px-20">
          <div className="max-w-[1280px] mx-auto">
            <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm" style={{ color: 'var(--text-on-light-muted)' }}>
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/products">Products</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" style={{ color: 'var(--text-on-light)' }}>{product.shortName}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8 items-start">
              {/* ── Gallery ── */}
              <div className="flex flex-col gap-3">
                <div
                  className="relative h-[320px] sm:h-[440px] lg:h-[560px] rounded flex items-center justify-center overflow-hidden"
                  style={{ background: tint }}
                >
                  <span
                    className="absolute top-4 left-4 text-[12px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: 'var(--text-on-light)' }}
                  >
                    {currentView?.label}
                  </span>
                  <span className="absolute top-4 right-4 text-[13px] tracking-[0.1em]" style={{ color: 'var(--text-on-light-muted)' }}>
                    {viewIndex + 1} / {galleryImages.length}
                  </span>
                  {currentView && (
                    // Only animate swaps the visitor triggers; animating the
                    // first paint would delay LCP (this image is the LCP element).
                    <div key={currentView.image} className={`relative h-[86%] w-[70%] ${swapped ? 'image-swap' : ''}`}>
                      <Image
                        src={currentView.image}
                        alt={`${currentView.name}, ${currentView.label}`}
                        fill
                        priority
                        unoptimized
                        sizes="(max-width: 1024px) 80vw, 560px"
                        className="object-contain drop-shadow-[0_24px_24px_rgba(9,5,3,0.25)]"
                      />
                    </div>
                  )}
                </div>

                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    {galleryImages.map((img, i) => {
                      const selected = i === viewIndex;
                      return (
                        <button
                          key={img.id}
                          type="button"
                          aria-pressed={selected}
                          aria-label={`View ${img.label}`}
                          onClick={() => { setSwapped(true); setViewIndex(i); }}
                          className="flex items-center justify-center h-[88px] rounded cursor-pointer border"
                          style={{ background: selected ? tint : 'transparent', borderColor: selected ? 'var(--text-on-light)' : 'var(--border-on-light)' }}
                        >
                          <div className="relative h-[68px] w-[52px]">
                            <Image src={img.image} alt="" fill unoptimized sizes="52px" className="object-contain" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Details ── */}
              <div className="panel-in [animation-delay:120ms]">
                {product.brand === 'Aashirvaad' && (
                  <div className="relative w-32 h-9 mb-5">
                    <Image src="/assets/logos/aashirvaad-logo.webp" alt="Aashirvaad" fill className="object-contain object-left" unoptimized />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase" style={{ background: 'var(--text-on-light)', color: 'var(--bg-light)' }}>
                    {product.brand}
                  </span>
                  <span className="px-3 py-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase border" style={{ borderColor: 'var(--border-on-light-strong)' }}>
                    {product.category}
                  </span>
                  <span className="px-3 py-1.5 text-[12px] font-semibold tracking-[0.12em] uppercase border" style={{ borderColor: '#2F7A3E', color: '#1F5A2B' }}>
                    100% Vegetarian
                  </span>
                </div>

                <h1 className="mt-6 text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.03] font-medium tracking-[-0.025em] text-balance" style={{ color: 'var(--text-on-light)' }}>
                  {selectedVariant ? selectedVariant.name : product.name}
                </h1>
                <p className="mt-3.5 text-lg italic" style={{ color: 'var(--accent-on-light)' }}>
                  &ldquo;{selectedVariant?.tagline || product.tagline}&rdquo;
                </p>

                {hasVariants && product.variants && (
                  <div className="mt-8">
                    <p className="mb-3 text-[13px] font-semibold tracking-[0.16em] uppercase" style={{ color: 'var(--text-on-light-muted)' }}>
                      Flavour
                    </p>
                    <div role="radiogroup" aria-label="Flavour" className="flex flex-wrap gap-2">
                      {product.variants.map((v) => {
                        const selected = selectedVariant?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => { setSwapped(true); setSelectedVariant(v); }}
                            className="flex items-center gap-2.5 h-11 pl-3 pr-4.5 rounded-full text-[15px] font-medium cursor-pointer border"
                            style={{
                              background: selected ? 'var(--text-on-light)' : 'transparent',
                              color: selected ? 'var(--bg-light)' : 'var(--text-on-light)',
                              borderColor: selected ? 'var(--text-on-light)' : 'var(--border-on-light-strong)',
                            }}
                          >
                            <span className="w-3.5 h-3.5 rounded-full" style={{ background: v.color, border: '1px solid rgba(250,243,224,0.5)' }} />
                            {v.shortName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p className="mt-8 text-[13px] font-semibold tracking-[0.16em] uppercase" style={{ color: 'var(--text-on-light-muted)' }}>
                  Why you&apos;ll love it
                </p>
                <ul className="mt-3 list-none">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex gap-3.5 border-t py-3 text-base leading-snug" style={{ borderColor: 'var(--border-on-light)' }}>
                      <Check size={17} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-on-light)' }} aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>

                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-6" style={{ background: 'var(--border-on-light)', border: '1px solid var(--border-on-light)' }}>
                  <div className="p-3.5" style={{ background: 'var(--bg-light)' }}>
                    <dt className="text-[12px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--text-on-light-muted)' }}>Net quantity</dt>
                    <dd className="mt-1 text-[17px] font-medium">{product.volume}</dd>
                  </div>
                  <div className="p-3.5" style={{ background: 'var(--bg-light)' }}>
                    <dt className="text-[12px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--text-on-light-muted)' }}>Packaging</dt>
                    <dd className="mt-1 text-[17px] font-medium">Aseptic Tetra Pak</dd>
                  </div>
                  <div className="p-3.5" style={{ background: 'var(--bg-light)' }}>
                    <dt className="text-[12px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--text-on-light-muted)' }}>Serving note</dt>
                    <dd className="mt-1 text-[17px] font-medium">Serve chilled · Shake well</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={openBuy}
                  aria-haspopup="dialog"
                  className="btn-dark group mt-8 w-full sm:w-auto sm:min-w-[280px] flex items-center justify-center gap-2.5 h-[56px] px-9 rounded-full text-sm font-semibold tracking-[0.1em] uppercase"
                >
                  <ShoppingBag size={17} aria-hidden />
                  Buy now
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
                <p className="mt-3 text-sm" style={{ color: 'var(--text-on-light-muted)' }}>
                  Available on Blinkit, Zepto, Swiggy Instamart, Amazon &amp; more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ingredients & nutrition ── */}
        <section className="py-14 sm:py-20 px-5 sm:px-10 lg:px-20">
          <div className="max-w-[1280px] mx-auto">
            <Reveal>
              <p className="mb-4 text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-on-light)' }}>
                Complete transparency
              </p>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] leading-[1.02] font-medium tracking-[-0.02em]" style={{ color: 'var(--text-on-light)' }}>
                Ingredients &amp; nutrition
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 mt-8 sm:mt-10 items-start">
              <Reveal delay={80}>
                <h3 className="mb-2 text-xl font-medium" style={{ color: 'var(--text-on-light)' }}>Key ingredients</h3>
                <ol className="list-none m-0 p-0">
                  {product.ingredients.map((ing, i) => (
                    <li key={ing} className="flex gap-4 border-t py-3.5 text-base leading-snug" style={{ borderColor: 'var(--border-on-light)' }}>
                      <span className="text-[13px] font-semibold min-w-[22px]" style={{ color: 'var(--accent-on-light)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {ing}
                    </li>
                  ))}
                </ol>
                <div className="mt-4 p-5 rounded" style={{ background: 'var(--surface-light)' }}>
                  <p className="mb-1 text-[15px] font-semibold">Zero chemical preservatives</p>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-on-light-muted)' }}>
                    Sterilised via Ultra-High Temperature (UHT) thermal processing and aseptically packaged in multi-layer protective cartons to lock in freshness naturally.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <h3 className="mb-2 text-xl font-medium" style={{ color: 'var(--text-on-light)' }}>Nutritional facts</h3>
                <div role="table" aria-label="Nutritional facts">
                  <div role="row" className="grid grid-cols-3 gap-3 border-b pb-3 text-[12px] font-semibold tracking-[0.14em] uppercase" style={{ borderColor: 'var(--text-on-light)' }}>
                    <span role="columnheader">Nutrient</span>
                    <span role="columnheader" className="text-right">Per 100 ml</span>
                    <span role="columnheader" className="text-right">Per serve ({product.volume})</span>
                  </div>
                  {product.nutrition.map((item) => (
                    <div key={item.label} role="row" className="grid grid-cols-3 gap-3 border-b py-3.5" style={{ borderColor: 'var(--border-on-light)' }}>
                      <span role="rowheader" className="font-medium">{item.label}</span>
                      <span role="cell" className="text-right" style={{ color: 'var(--text-on-light-muted)' }}>{item.value}</span>
                      <span role="cell" className="text-right font-medium">{item.perServing || '-'}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FAQ (same UI as the homepage) ── */}
        <FaqSection
          id="product-faq"
          eyebrow="Got questions?"
          title={`${product.shortName} FAQs`}
          items={productFaqs}
        />

        {/* ── You may also like ── */}
        <section className="pt-4 sm:pt-8 pb-16 sm:pb-24 px-5 sm:px-10 lg:px-20">
          <div className="max-w-[1280px] mx-auto">
            <Reveal className="flex justify-between items-end gap-4 mb-8">
              <h2 className="text-2xl sm:text-3xl font-medium" style={{ color: 'var(--text-on-light)' }}>
                You may also like
              </h2>
              <Link href="/products" className="pb-1 border-b text-sm font-semibold tracking-[0.08em] uppercase" style={{ borderColor: 'var(--text-on-light)', color: 'var(--text-on-light)' }}>
                All products →
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
              {related.map((flavour, i) => (
                <Reveal key={flavour.key} delay={i * 90}>
                  <ProductCard card={flavourToProductCard(flavour)} fluid />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      {buyRequested && (
        <BuyNowModal
          open={buyOpen}
          onClose={closeBuy}
          productName={selectedVariant?.name || product.name}
          platforms={product.platforms}
        />
      )}

      <Footer />
    </>
  );
}
