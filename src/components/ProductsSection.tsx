'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import ProductCard, { ProductCardData } from './ProductCard';
import Reveal from './Reveal';

const CARDS: ProductCardData[] = [
  {
    tag: 'Dark Fantasy',
    title: 'Imported Belgian cocoa',
    text: 'Belgian cocoa solids give Dark Fantasy Milkshake its deep, velvety richness.',
    product: 'Belgian Chocolate Milkshake',
    vol: PRODUCTS[0].volume,
    img: PRODUCTS[0].variants[0].image,
    bg: `color-mix(in srgb, ${PRODUCTS[0].accentColor} 20%, #F2E8D5)`,
    href: `/product/${PRODUCTS[0].id}?variant=${PRODUCTS[0].variants[0].id}`,
  },
  {
    tag: 'Sunfeast',
    title: 'Ratnagiri Alphonso',
    text: '25% real Alphonso mango pieces in a thick, creamy smoothie.',
    product: 'Alphonso Mango Smoothie',
    vol: PRODUCTS[1].volume,
    img: PRODUCTS[1].variants[0].image,
    bg: `color-mix(in srgb, ${PRODUCTS[1].variants[0].color} 20%, #F2E8D5)`,
    href: `/product/${PRODUCTS[1].id}?variant=${PRODUCTS[1].variants[0].id}`,
  },
  {
    tag: 'Aashirvaad',
    title: 'Almonds & saffron',
    text: 'California almond slivers, cardamom and a hint of saffron in Shahi Badam Milk.',
    product: 'Shahi Badam Milk',
    vol: PRODUCTS[2].volume,
    img: PRODUCTS[2].packshot,
    bg: `color-mix(in srgb, ${PRODUCTS[2].accentColor} 20%, #F2E8D5)`,
    href: `/product/${PRODUCTS[2].id}`,
  },
  {
    tag: 'Aashirvaad',
    title: 'Live probiotic cultures',
    text: 'Svasti Lassi is cultured from fresh full-fat curd for homestyle tang.',
    product: 'Svasti Lassi',
    vol: PRODUCTS[3].volume,
    img: PRODUCTS[3].packshot,
    bg: `color-mix(in srgb, ${PRODUCTS[3].accentColor} 20%, #F2E8D5)`,
    href: `/product/${PRODUCTS[3].id}`,
  },
  {
    tag: 'Dark Fantasy',
    title: 'White chocolate & vanilla',
    text: 'Creamy vanilla bean essence paired with rich white chocolate.',
    product: 'White Chocolate Vanilla Milkshake',
    vol: PRODUCTS[0].volume,
    img: PRODUCTS[0].variants[1].image,
    bg: `color-mix(in srgb, ${PRODUCTS[0].variants[1].color} 20%, #F2E8D5)`,
    href: `/product/${PRODUCTS[0].id}?variant=${PRODUCTS[0].variants[1].id}`,
  },
  {
    tag: 'Sunfeast',
    title: 'Tangy wild berries',
    text: 'Real berries and sweet mango together provide immunity-supporting Vitamin C.',
    product: 'Berry & Mango Smoothie',
    vol: PRODUCTS[1].volume,
    img: PRODUCTS[1].variants[1].image,
    bg: `color-mix(in srgb, ${PRODUCTS[1].variants[1].color} 20%, #F2E8D5)`,
    href: `/product/${PRODUCTS[1].id}?variant=${PRODUCTS[1].variants[1].id}`,
  },
  {
    tag: 'Sunfeast',
    title: 'Oats, dates & super seeds',
    text: '6g of protein per serve, with no added sugar. The sweetness comes from real dates and banana.',
    product: 'Breakfast Smoothie',
    vol: PRODUCTS[1].volume,
    img: PRODUCTS[1].variants[2].image,
    bg: `color-mix(in srgb, ${PRODUCTS[1].variants[2].color} 20%, #F2E8D5)`,
    href: `/product/${PRODUCTS[1].id}?variant=${PRODUCTS[1].variants[2].id}`,
  },
];

export default function ProductsSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [fill, setFill] = useState(12);

  const updateScrollState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setCanScrollLeft(rail.scrollLeft > 4);
    setCanScrollRight(rail.scrollLeft < maxScroll - 4);
    setFill(maxScroll > 0 ? 12 + (rail.scrollLeft / maxScroll) * 88 : 100);
  }, []);

  useLayoutEffect(() => {
    updateScrollState();
  }, [updateScrollState]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    if (!railRef.current) return;
    const amount = 340;
    railRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section id="products" className="pt-16 sm:pt-24 lg:pt-32 overflow-hidden" style={{ background: 'var(--bg-light)' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-20">
        <Reveal className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
          <div>
            <p className="mb-4 text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-on-light)' }}>
              Featured Products
            </p>
            <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.02] font-medium tracking-[-0.02em]" style={{ color: 'var(--text-on-light)' }}>
              Crafted from real ingredients
            </h2>
            <p className="mt-4 max-w-[640px] text-base sm:text-[17px] lg:text-lg leading-relaxed" style={{ color: 'var(--text-on-light-muted)' }}>
              Cafe-like decadence, made with real Belgian cocoa, luscious fruit and rich dairy milk, and sealed fresh without chemical preservatives.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/products"
              className="pb-1 border-b text-sm font-semibold tracking-[0.08em] uppercase cursor-pointer mr-2"
              style={{ borderColor: 'var(--text-on-light)', color: 'var(--text-on-light)' }}
            >
              All products →
            </Link>
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-[52px] h-[52px] rounded-full border flex items-center justify-center text-xl cursor-pointer transition-opacity disabled:cursor-default"
              style={{ borderColor: 'var(--text-on-light)', background: 'var(--bg-light)', color: 'var(--text-on-light)', opacity: canScrollLeft ? 1 : 0.35 }}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-xl cursor-pointer transition-opacity disabled:cursor-default"
              style={{ background: 'var(--text-on-light)', color: 'var(--bg-light)', opacity: canScrollRight ? 1 : 0.35 }}
            >
              →
            </button>
          </div>
        </Reveal>

        <div
          ref={railRef}
          onScroll={updateScrollState}
          className="overflow-x-auto scroll-rail mt-8 sm:mt-10 pb-10"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="flex items-start gap-5 sm:gap-6 lg:gap-7 w-max">
            {CARDS.map((card, i) => (
              <Reveal key={card.title} className="snap-start" delay={Math.min(i, 4) * 90}>
                <ProductCard card={card} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative h-0.5 mt-8 sm:mt-10" style={{ background: 'rgba(29,15,9,0.14)' }}>
          <span
            className="absolute left-0 top-0 bottom-0 transition-[width] duration-500 ease-out"
            style={{ width: `${fill}%`, background: 'var(--text-on-light)' }}
          />
        </div>
      </div>
    </section>
  );
}
