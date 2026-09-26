'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FLAVOURS } from '@/lib/flavours';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { flavourToProductCard } from '@/components/ProductCard';
import Reveal from '@/components/Reveal';

const DrinkQuiz = dynamic(() => import('@/components/DrinkQuiz'));

type CategoryKey = 'all' | 'shakes' | 'smoothies' | 'dairy';

const TABS: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All Beverages' },
  { key: 'shakes', label: 'Dark Fantasy Shakes' },
  { key: 'smoothies', label: 'Fruit Smoothies' },
  { key: 'dairy', label: 'Dairy Classics' },
];

export default function ProductsListingClient() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const displayedFlavours =
    activeCategory === 'all' ? FLAVOURS : FLAVOURS.filter((f) => f.category === activeCategory);

  return (
    <>
      <Header />

      <main style={{ background: 'var(--bg-light)', color: 'var(--text-on-light)' }}>
        {/* No bottom padding here: DrinkQuiz supplies its own top padding
            right below, and the two sections share the same cream
            background, so stacking both created a large dead gap. */}
        <section className="pt-24 sm:pt-28 lg:pt-32 px-5 sm:px-10 lg:px-20">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
            <div className="hero-rise">
              <nav aria-label="Breadcrumb" className="flex gap-2 text-sm" style={{ color: 'var(--text-on-light-muted)' }}>
                <Link href="/">Home</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page" style={{ color: 'var(--text-on-light)' }}>Products</span>
              </nav>

              {/* ── Large, prominent heading ── */}
              <h1 className="mt-6 text-[44px] sm:text-[64px] lg:text-[84px] leading-[0.98] font-medium tracking-[-0.025em]">
                Our Beverages
              </h1>
              <p className="mt-4 max-w-[560px] text-base leading-relaxed" style={{ color: 'var(--text-on-light-muted)' }}>
                Browse our complete beverage collection: rich Belgian chocolate milkshakes, thick fruit smoothies with real Alphonso mango and berries, and authentic dairy drinks.
              </p>

              {/* Drink Finder preview: the actual quiz widget renders right
                  below in its own section (id="quiz"), heading hidden there
                  via `hideHeading` so it isn't duplicated. */}
              <div className="mt-14 sm:mt-16">
                <p className="mb-4 text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-on-light)' }}>
                  Drink Finder
                </p>
                <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.02] font-medium tracking-[-0.02em]" style={{ color: 'var(--text-on-light)' }}>
                  Find your perfect drink
                </h2>
              </div>
            </div>

            {/* Packshots (transparent bg) floating directly on the page
                background, no card/label — crossed over with rotation.
                Hidden below md so they never crowd the heading text. */}
            <div className="hidden md:flex relative items-center justify-center min-h-[260px] lg:min-h-[360px]">
              <div className="relative w-[220px] sm:w-[260px] lg:w-[320px] aspect-square">
                <Image
                  src="/assets/packshots/badam-milk/fop.webp"
                  alt="Aashirvaad Shahi Badam Milk"
                  width={220}
                  height={420}
                  unoptimized
                  className="absolute left-[4%] top-[6%] w-[52%] h-auto -rotate-[16deg] drop-shadow-xl"
                />
                <Image
                  src="/assets/packshots/berry-mango-smoothie/render.webp"
                  alt="Sunfeast Berry & Mango Smoothie"
                  width={220}
                  height={420}
                  unoptimized
                  className="absolute right-[6%] bottom-0 z-10 w-[56%] h-auto rotate-[14deg] drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <DrinkQuiz hideHeading />

        <section className="px-5 sm:px-10 lg:px-20 pb-16 sm:pb-24 lg:pb-32">
          <div className="max-w-[1280px] mx-auto">
            {/* ── Categories: own row directly above the grid, wraps so nothing is ever hidden/cut off ── */}
            <div role="tablist" aria-label="Product categories" className="flex flex-wrap gap-2.5 mb-8 sm:mb-10">
              {TABS.map((tab) => {
                const active = tab.key === activeCategory;
                const count = tab.key === 'all' ? FLAVOURS.length : FLAVOURS.filter((f) => f.category === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(tab.key)}
                    className="h-11 px-5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer border transition-colors"
                    style={{
                      background: active ? 'var(--text-on-light)' : 'transparent',
                      color: active ? 'var(--bg-light)' : 'var(--text-on-light)',
                      borderColor: active ? 'var(--text-on-light)' : 'var(--border-on-light-strong)',
                    }}
                  >
                    {tab.label} <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Flavour grid ── */}
            <div
              key={activeCategory}
              className="panel-in grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-12 sm:gap-y-14 lg:gap-y-16"
            >
              {displayedFlavours.map((flavour, i) => (
                <Reveal key={flavour.key} delay={(i % 4) * 90}>
                  <ProductCard card={flavourToProductCard(flavour)} fluid />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
