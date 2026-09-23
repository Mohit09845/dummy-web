'use client';

import { useLayoutEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import ProductCard from './ProductCard';

export default function ProductsSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Reset scroll position before paint so the scroll-snap rail doesn't
  // auto-realign to a centered card when the filtered list changes.
  useLayoutEffect(() => {
    if (railRef.current) railRef.current.scrollLeft = 0;
  }, [selectedCategory]);

  const categories = [
    { label: 'All Beverages', value: 'all' },
    { label: 'Dark Fantasy Shakes', value: 'Dark Fantasy' },
    { label: 'Fruit Smoothies', value: 'Smoothies' },
    { label: 'Dairy Classics', value: 'Dairy' },
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'Dark Fantasy') return product.brand.includes('Dark Fantasy');
    if (selectedCategory === 'Smoothies') return product.category.includes('Smoothie') || product.brand.includes('Sunfeast Breakfast');
    if (selectedCategory === 'Dairy') return product.category.includes('Flavoured Milk') || product.category.includes('Lassi');
    return true;
  });

  const scroll = (dir: 'left' | 'right') => {
    if (!railRef.current) return;
    const amount = 340;
    railRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section id="products" className="py-20 sm:py-28 overflow-hidden relative" style={{ background: 'var(--bg-section)' }}>
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      <div className="max-w-8xl mx-auto">
        {/* ── Centered Section Header ─────────────────────────── */}
        <div className="text-center px-5 sm:px-10 lg:px-16 max-w-3xl mx-auto mb-6">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--gold-light)' }}
          >
            <span>Featured Products</span>
          </div>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Indulgent <span className="text-gold-gradient italic">Beverages</span>
          </h2>
          <p
            className="mt-2.5 text-xs sm:text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Explore ready-to-sip gourmet milkshakes, high-fruit smoothies, and authentic Indian dairy delights.
          </p>
        </div>

        {/* ── Category Filter Pills Below Heading ──────────────── */}
        <div className="flex items-center justify-center px-5 mb-10">
          <div className="flex items-center gap-2 p-1.5 rounded-full glass border border-[var(--border)] overflow-x-auto max-w-full scroll-rail">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.value
                    ? 'btn-gold shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--gold-light)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product Displaying Row with Left & Right Arrow Buttons on Sides ── */}
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 group/row">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll products left"
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center glass border border-[var(--border)] hover:border-[var(--gold)] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md text-[var(--gold-light)] bg-[#140A06]/90"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll products right"
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center glass border border-[var(--border)] hover:border-[var(--gold)] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.9)] backdrop-blur-md text-[var(--gold-light)] bg-[#140A06]/90"
          >
            <ChevronRight size={20} />
          </button>

          {/* Horizontal Scroll Rail */}
          <div
            ref={railRef}
            className="scroll-rail flex items-stretch gap-6 px-10 sm:px-16 pb-8 overflow-x-auto"
            style={{ overflowAnchor: 'none' }}
          >
            <div className="flex-shrink-0 w-0" />

            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}

            <div className="flex-shrink-0 w-6 sm:w-12" />
          </div>
        </div>

        {/* ── Mobile swipe indicator ──────────────────── */}
        <p
          className="sm:hidden text-center text-xs mt-2 tracking-widest uppercase font-semibold"
          style={{ color: 'var(--text-muted)' }}
        >
          Swipe sideways or tap arrows to explore →
        </p>
      </div>
    </section>
  );
}
