'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Layers,
  Activity,
} from 'lucide-react';
import { Product } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Never present on initial paint (only mounts after a click) and has no
// SEO value, so it's excluded from the route's initial JS entirely.
const BuyNowModal = dynamic(() => import('@/components/BuyNowModal'), { ssr: false });

interface ProductPageClientProps {
  product: Product;
}

interface GalleryImage {
  id: string;
  name: string;
  shortName: string;
  label: string;
  image: string;
  color: string;
}

// The packshot files referenced by product data are sized for the small
// card contexts (ProductCard, ProductsListingClient, DrinkQuiz) where most
// of them are used. This carousel is the one place that shows them much
// larger, so it asks for the "-detail" variant generated alongside each one.
function toDetail(src: string): string {
  return src.replace(/\.webp$/, '-detail.webp');
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // Compile all available product & variant images (front and back packshots)
  const galleryImages = useMemo<GalleryImage[]>(() => {
    const images: GalleryImage[] = [];
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v) => {
        if (v.image) {
          images.push({
            id: `${v.id}-front`,
            name: v.name,
            shortName: v.shortName,
            label: 'Front Pack',
            image: toDetail(v.image),
            color: v.color,
          });
        }
        if (v.backImage) {
          images.push({
            id: `${v.id}-back`,
            name: v.name,
            shortName: v.shortName,
            label: 'Back of Pack',
            image: toDetail(v.backImage),
            color: v.color,
          });
        }
      });
    } else {
      if (product.packshot) {
        images.push({
          id: `${product.id}-front`,
          name: product.shortName,
          shortName: product.shortName,
          label: 'Front Pack',
          image: toDetail(product.packshot),
          color: product.accentColor,
        });
      }
      if (product.backshotImage) {
        images.push({
          id: `${product.id}-back`,
          name: product.shortName,
          shortName: product.shortName,
          label: 'Back of Pack',
          image: toDetail(product.backshotImage),
          color: product.accentColor,
        });
      }
    }
    return images;
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Open on the variant the visitor was previewing (e.g. hovered on the
  // listing page) instead of always defaulting to the first flavour.
  // Deferred to an effect (not a lazy useState initializer) because this
  // route is statically exported: the prerendered HTML can't know about
  // `?variant=`, so reading it during render would mismatch on hydration.
  useEffect(() => {
    const variantId = new URLSearchParams(window.location.search).get('variant');
    if (!variantId) return;
    const idx = galleryImages.findIndex((img) => img.id === `${variantId}-front`);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing initial UI state from the URL once on mount, not reacting to external changes
    if (idx >= 0) setActiveImageIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const currentItem = galleryImages[activeImageIndex] || galleryImages[0];
  const activeColor = currentItem?.color || product.accentColor;

  return (
    <>
      {/* ── Top Navigation Bar (Consistent site header, no back button) ──── */}
      <Header />

      <main className="min-h-screen pt-16 bg-[#090503]">
        {/* ── Hero Gradient Showcase Section ───────────────────── */}
        <div
          className="relative pt-12 pb-16 sm:pb-24 overflow-hidden"
          style={{
            background: `linear-gradient(160deg, ${activeColor}20 0%, #090503 65%)`,
          }}
        >
          {/* Ambient radial glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${activeColor}25 0%, transparent 65%)`,
              filter: 'blur(55px)',
            }}
          />

          <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* ── Left Column: Interactive Product Image Carousel ───────────────── */}
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-4 w-full"
              >
                {/* Rounded Packshot Stage with Left & Right Arrow Buttons */}
                <div
                  className="relative w-full max-w-md mx-auto h-[420px] sm:h-[500px] rounded-[2.5rem] overflow-hidden flex items-end justify-center group transition-all duration-500 select-none"
                  style={{
                    background: `linear-gradient(160deg, ${activeColor}20 0%, #140A06 100%)`,
                    border: `1px solid ${activeColor}40`,
                    boxShadow: `0 35px 90px -20px ${activeColor}35, 0 12px 45px -10px rgba(0,0,0,0.85)`,
                  }}
                >
                  {/* Spotlight Behind Packshot */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-700"
                    style={{
                      background: `radial-gradient(ellipse at 50% 80%, ${activeColor}30 0%, transparent 68%)`,
                    }}
                  />

                  {/* Active Image Tag Overlay */}
                  <div className="absolute top-5 left-5 right-20 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-[var(--border)] text-[11px] font-bold uppercase tracking-wider text-[#FAF3E0] shadow-md backdrop-blur-md overflow-hidden">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                      style={{ background: activeColor, color: activeColor }}
                    />
                    <span className="truncate">
                      {currentItem.name} <span className="opacity-50">•</span>{' '}
                      <span className="text-[var(--gold-light)]">{currentItem.label}</span>
                    </span>
                  </div>

                  {/* Counter badge top right */}
                  <div className="absolute top-5 right-5 z-20 px-2.5 py-1 rounded-full glass border border-[var(--border)] text-[10px] font-bold text-[var(--gold-light)] shadow-md">
                    {activeImageIndex + 1} / {galleryImages.length}
                  </div>

                  {/* Left Arrow Button */}
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous product image"
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center glass border border-[var(--border)] hover:border-[var(--gold)] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md text-[var(--gold-light)] bg-[#140A06]/90"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  {/* Right Arrow Button */}
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next product image"
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center glass border border-[var(--border)] hover:border-[var(--gold)] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md text-[var(--gold-light)] bg-[#140A06]/90"
                  >
                    <ChevronRight size={22} />
                  </button>

                  {/* Packshot Image with Smooth Swap & Hover Zoom */}
                  <div className="relative z-10 h-[340px] sm:h-[420px] w-[260px] flex items-end justify-center pb-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentItem.id}
                        initial={{ opacity: 0, scale: 0.93 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.93 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.05 }}
                        className="relative w-full h-full flex items-end justify-center cursor-pointer transition-transform duration-300"
                      >
                        <Image
                          src={currentItem.image}
                          alt={`${product.name} - ${currentItem.name} (${currentItem.label})`}
                          fill
                          className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 90vw, 420px"
                          priority
                          unoptimized
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── Image Selector Dots Underneath ── */}
                <div className="flex items-center justify-center gap-2 p-1.5 rounded-full glass border border-[var(--border)] bg-black/40">
                  {galleryImages.map((item, idx) => {
                    const isSelected = activeImageIndex === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        title={`${item.name} (${item.label})`}
                        aria-label={`View ${item.name} ${item.label}`}
                        className={`relative p-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'scale-125 ring-2 ring-[var(--gold)] ring-offset-1 ring-offset-[#090503]'
                            : 'hover:scale-115 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <span
                          className="block w-3 h-3 rounded-full"
                          style={{
                            background: item.color,
                            boxShadow: isSelected ? `0 0 10px ${item.color}` : 'none',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── Right Column: Product Information & Purchase ───────────────── */}
              <motion.div
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="space-y-6"
              >
                {/* Aashirvaad carries its own brand mark alongside Sunfeast/Dark Fantasy */}
                {product.brand === 'Aashirvaad' && (
                  <div className="relative w-32 h-11">
                    <Image
                      src="/assets/logos/aashirvaad-logo.webp"
                      alt="Aashirvaad"
                      fill
                      className="object-contain object-left"
                      unoptimized
                    />
                  </div>
                )}

                {/* Brand & Category badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: `${activeColor}25`,
                      color: product.accentLight,
                      border: `1px solid ${activeColor}50`,
                    }}
                  >
                    {product.brand}
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider glass text-[#CBB89D]">
                    {product.category}
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-[rgba(34,197,94,0.15)] text-[#4ade80] border border-[rgba(34,197,94,0.3)]">
                    100% Vegetarian
                  </span>
                </div>

                {/* Main Product Title & Tagline */}
                <div>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-[#FAF3E0]">
                    {product.name}
                  </h1>
                  <p className="mt-2.5 text-lg sm:text-xl font-medium italic text-[var(--gold-light)]">
                    &ldquo;{product.tagline}&rdquo;
                  </p>
                </div>

                {/* Pack Specifications Block (No Price) */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass border border-[var(--border)] bg-[#140A06]/80">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] block">
                      Net Quantity
                    </span>
                    <span className="text-sm font-bold text-[#FAF3E0] px-3.5 py-1 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[var(--border)] inline-block">
                      {product.volume}
                    </span>
                  </div>

                  <div className="h-9 w-[1px] bg-[rgba(212,175,55,0.2)] mx-1 hidden sm:block" />

                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] block">
                      Packaging
                    </span>
                    <span className="text-xs font-semibold text-[#CBB89D]">
                      Aseptic Tetra Pak
                    </span>
                  </div>

                  <div className="h-9 w-[1px] bg-[rgba(212,175,55,0.2)] mx-1 hidden sm:block" />

                  <div className="space-y-0.5 text-right">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] block">
                      Serving Note
                    </span>
                    <span className="text-xs font-semibold text-[var(--gold-light)]">
                      Serve Chilled • Shake Well
                    </span>
                  </div>
                </div>

                {/* Long Description */}
                <p className="text-sm sm:text-base leading-relaxed text-[#CBB89D]">
                  {product.longDescription}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5 pt-1">
                  {product.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#FAF3E0]">
                      <CheckCircle2
                        size={17}
                        className="shrink-0"
                        style={{ color: activeColor }}
                      />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* ── Buy Section ── */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="btn-gold w-full py-4 px-8 rounded-2xl text-base font-bold tracking-wide flex items-center justify-center gap-2.5 shadow-2xl hover:scale-102 active:scale-98 transition-all cursor-pointer group"
                  >
                    <ShoppingBag size={18} />
                    <span>Buy Now</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Ingredients & Nutrition Details Section ───────────────────── */}
        <section className="py-16 sm:py-20 bg-[#0E0805] border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--gold-light)]">
                <span>Crafted For Excellence</span>
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FAF3E0]">
                Ingredients &amp; <span className="text-gold-gradient italic">Nutrition</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2">
                Complete transparency in every sip — authentic ingredients and verified nutritional profile.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Key Ingredients */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
                  <Layers size={18} className="text-[var(--gold)]" />
                  <h3 className="font-display text-xl font-bold text-[#FAF3E0]">
                    Key Ingredients &amp; Recipe
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {product.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="px-4 py-3.5 rounded-xl glass border border-[var(--border)] flex items-center gap-3 text-sm text-[#CBB89D] hover:border-[var(--border-strong)] transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl glass border border-[var(--border)] bg-[#140A06]/60 text-xs text-[var(--text-muted)] leading-relaxed">
                  <p className="font-semibold text-[#FAF3E0] mb-1">Zero Chemical Preservatives</p>
                  Sterilised via Ultra-High Temperature (UHT) thermal processing and aseptically packaged in multi-layer protective cartons to lock in freshness naturally.
                </div>
              </div>

              {/* Right Column: Nutrition Information Table */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
                  <Activity size={18} className="text-[var(--gold)]" />
                  <h3 className="font-display text-xl font-bold text-[#FAF3E0]">
                    Nutritional Facts
                  </h3>
                  <span className="text-xs text-[var(--text-muted)] ml-auto">
                    Per 100 ml / {product.volume}
                  </span>
                </div>

                <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden shadow-xl bg-[#140A06]/80">
                  <div className="grid grid-cols-3 p-3.5 bg-[#1A0F09] border-b border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--gold-light)]">
                    <span>Nutrient</span>
                    <span className="text-center">Per 100 ml</span>
                    <span className="text-right">Per Serve ({product.volume})</span>
                  </div>

                  <div className="divide-y divide-[rgba(212,175,55,0.08)]">
                    {product.nutrition.map((item, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-3 p-3.5 text-xs sm:text-sm hover:bg-[rgba(212,175,55,0.05)] transition-colors"
                      >
                        <span className="font-medium text-[#FAF3E0]">{item.label}</span>
                        <span className="text-center text-[#CBB89D]">{item.value}</span>
                        <span className="text-right font-semibold text-[var(--gold-light)]">
                          {item.perServing || '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {/* Buy Now Modal */}
      {modalOpen && (
        <BuyNowModal
          onClose={() => setModalOpen(false)}
          productName={product.shortName}
          platforms={product.platforms}
        />
      )}
    </>
  );
}
