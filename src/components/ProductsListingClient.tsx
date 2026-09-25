'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS, Product, ProductVariant } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DrinkQuiz = dynamic(() => import('@/components/DrinkQuiz'));

const CATEGORY_PLURAL_NAMES: Record<string, string> = {
  Milkshake: 'Milkshakes',
  Smoothie: 'Smoothies',
  'Flavoured Milk': 'Flavoured Milk',
  Lassi: 'Traditional Lassi',
};

// Human-friendly category descriptions
const CATEGORY_TAGLINES: Record<string, string> = {
  Milkshake: 'Velvety Belgian cocoa and rich milkshakes crafted for liquid decadence.',
  Smoothie: 'Thick, chunky fruit smoothies packed with real mango and berry fruit pieces.',
  'Flavoured Milk': 'Royal Indian dairy recipes infused with real California almonds and saffron.',
  Lassi: 'Homestyle probiotic curd churned with authentic cultured goodness.',
};

// ── 60fps Stagger & Reveal Animation Variants (transform/opacity only) ───────
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06, // ~60ms delay per card for staggered cascade
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ProductsListingClient() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Derive categories dynamically from product data
  const categoryList = Array.from(new Set(PRODUCTS.map((p) => p.category)));
  const filterTabs = ['All', ...categoryList];

  // Filtered products list based on active category
  const displayedProducts =
    activeCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  // Recompute which arrows make sense to show: neither if everything already
  // fits on screen (e.g. a single-product category), and each side hides
  // once scrolled to its end.
  const updateScrollState = useCallback(() => {
    const rail = scrollContainerRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setCanScrollLeft(rail.scrollLeft > 4);
    setCanScrollRight(rail.scrollLeft < maxScroll - 4);
  }, []);

  // AnimatePresence (mode="wait") remounts the rail as a fresh DOM node on
  // every category switch, so a callback ref (fired exactly at that mount)
  // is used instead of an effect keyed on activeCategory, which could run
  // before the animated remount actually happens.
  const setRailRef = useCallback(
    (node: HTMLDivElement | null) => {
      scrollContainerRef.current = node;
      if (node) requestAnimationFrame(updateScrollState);
    },
    [updateScrollState]
  );

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  // Smooth scroll handler for the single row rail
  const scrollSingleRow = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 pb-24 bg-[#090503] relative overflow-hidden">
        {/* Background ambient lighting */}
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.12) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 relative z-10">
          {/* ── Page Title Header ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-14"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#FAF3E0] tracking-tight leading-[1.08]">
              Explore Our <span className="text-gold-gradient italic">Products</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#CBB89D] leading-relaxed">
              Discover our complete collection of indulgent milkshakes, real fruit smoothies,
              and authentic dairy refreshments. Crafted with zero chemical preservatives.
            </p>
          </motion.div>

          {/* ── Find Your Perfect Drink Quiz Section ─────────────── */}
          <DrinkQuiz />

          {/* ── Category Filter Tabs / Pills ────────────────────── */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 max-w-full scroll-rail px-2">
              {filterTabs.map((cat) => {
                const isSelected = activeCategory === cat;
                const count =
                  cat === 'All'
                    ? PRODUCTS.length
                    : PRODUCTS.filter((p) => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2 select-none ${
                      isSelected
                        ? 'btn-gold shadow-lg scale-105'
                        : 'glass text-[var(--text-secondary)] hover:text-[#FAF3E0] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold transition-colors ${
                        isSelected
                          ? 'bg-[#120701] text-[var(--gold-light)]'
                          : 'bg-white/10 text-[var(--text-muted)]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Single-Row Product Display (No Multiple Rows) ─────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.section
                variants={sectionRevealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="space-y-5"
              >
                {/* Section Header with Left/Right Row Scroll Controls */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-[rgba(212,175,55,0.2)]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--gold)]" />
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF3E0]">
                        {activeCategory === 'All'
                          ? 'All Beverages'
                          : CATEGORY_PLURAL_NAMES[activeCategory] || `${activeCategory}s`}
                      </h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full glass border border-[var(--border)] text-[var(--gold-light)] font-bold">
                        {displayedProducts.length}{' '}
                        {displayedProducts.length === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                      {activeCategory === 'All'
                        ? 'All products presented in a single scrollable row.'
                        : CATEGORY_TAGLINES[activeCategory] || `Premium ${activeCategory} beverages.`}
                    </p>
                  </div>

                  {/* Left / Right Chevron Navigation for Single Row */}
                  {(canScrollLeft || canScrollRight) && (
                    <div className="flex items-center gap-2 shrink-0">
                      {canScrollLeft && (
                        <button
                          type="button"
                          onClick={() => scrollSingleRow('left')}
                          aria-label="Scroll products row left"
                          className="w-9 h-9 rounded-full glass border border-[var(--border)] hover:border-[var(--gold)] flex items-center justify-center text-[var(--gold-light)] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                        >
                          <ChevronLeft size={16} />
                        </button>
                      )}
                      {canScrollRight && (
                        <button
                          type="button"
                          onClick={() => scrollSingleRow('right')}
                          aria-label="Scroll products row right"
                          className="w-9 h-9 rounded-full glass border border-[var(--border)] hover:border-[var(--gold)] flex items-center justify-center text-[var(--gold-light)] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                        >
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Strictly Single Row with Horizontal Scroll Rail ── */}
                <motion.div
                  ref={setRailRef}
                  onScroll={updateScrollState}
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-nowrap overflow-x-auto gap-6 pb-6 pt-2 scroll-rail snap-x"
                >
                  {displayedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="w-[285px] sm:w-[320px] shrink-0 snap-start"
                    >
                      <ProductListingCard product={product} />
                    </div>
                  ))}
                </motion.div>
              </motion.section>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ── Product Listing Card Component with Hover Lift, Image Zoom, Variant Dots & Button Slide ──
function ProductListingCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const activeColor = selectedVariant?.color || product.accentColor;
  const activeImage = selectedVariant?.image || product.packshot;
  const productHref =
    selectedVariant && product.variants.length > 1
      ? `/product/${product.id}?variant=${selectedVariant.id}`
      : `/product/${product.id}`;

  return (
    <motion.div
      variants={cardItemVariants}
      className="glass rounded-3xl p-5 border border-[var(--border)] hover:border-[var(--border-strong)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between group bg-[#140A06]/85 will-change-transform h-full"
    >
      <div>
        {/* Packshot Image Container with Dynamic Glow & Image Preview */}
        <Link
          href={productHref}
          className="relative w-full h-56 rounded-2xl overflow-hidden flex items-end justify-center p-3 mb-3 block cursor-pointer transition-colors duration-300"
          style={{
            background: `radial-gradient(ellipse at 50% 90%, ${activeColor}30 0%, #100603 100%)`,
            border: `1px solid ${activeColor}40`,
          }}
        >
          {/* Top badges */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: `${activeColor}30`,
                color: product.accentLight,
                border: `1px solid ${activeColor}60`,
              }}
            >
              {product.brand}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="w-4 h-4 rounded-full flex items-center justify-center bg-black/60 border border-green-500/40 p-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </span>
          </div>

          {/* Packshot with smooth swap & zoom on hover */}
          <div className="relative w-32 h-44 z-10 flex items-end justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0.65, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.65, scale: 0.94 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-end justify-center"
              >
                <Image
                  src={activeImage}
                  alt={selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name}
                  fill
                  className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
                  sizes="128px"
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </Link>

        {/* ── Variant Color Dots & Name Preview ── */}
        {product.variants && product.variants.length > 1 && (
          <div
            className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-full glass border border-[var(--border)] mb-3 bg-black/35 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="flex items-center gap-1.5">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onMouseEnter={() => setSelectedVariant(v)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(v);
                    }}
                    title={v.name}
                    aria-label={`Preview variant ${v.name}`}
                    className={`relative p-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'scale-125 ring-2 ring-[var(--gold)] ring-offset-1 ring-offset-[#090503]'
                        : 'hover:scale-115 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="block w-3.5 h-3.5 rounded-full"
                      style={{
                        background: v.color,
                        boxShadow: isSelected ? `0 0 10px ${v.color}` : 'none',
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] font-bold text-[var(--gold-light)] truncate max-w-[130px]">
              {selectedVariant?.shortName}
            </span>
          </div>
        )}

        {/* Product Titles & Info */}
        <Link href={productHref} className="block group-hover:text-[var(--gold-light)]">
          <h3 className="font-display text-lg font-bold leading-snug text-[#FAF3E0] line-clamp-1 group-hover:text-[var(--gold-light)] transition-colors duration-200">
            {selectedVariant ? selectedVariant.name : product.shortName}
          </h3>
        </Link>

        {/* Short description (1-2 lines) */}
        <p className="text-xs text-[#CBB89D] leading-relaxed line-clamp-2 mt-1.5">
          {selectedVariant?.tagline || product.description}
        </p>
      </div>

      {/* Net Quantity & View Details CTA (NO PRICES) */}
      <div className="mt-5 pt-3.5 border-t border-[rgba(212,175,55,0.12)]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--gold-light)]">
            <span>{product.volume}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
            Ready to Serve
          </span>
        </div>

        {/* View Details Button with Arrow Slide on Hover */}
        <Link
          href={productHref}
          aria-label={`View details for ${selectedVariant ? selectedVariant.name : product.shortName}`}
          className="group/btn btn-gold w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-102 active:scale-98 transition-all duration-200"
        >
          <span aria-hidden="true">View Details</span>
          <ArrowRight
            size={13}
            className="text-[#120701] transition-transform duration-200 ease-out group-hover/btn:translate-x-1.5 will-change-transform"
          />
        </Link>
      </div>
    </motion.div>
  );
}
