'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PRODUCT_FACTS } from '@/lib/facts';
import FloatingCard, { type FloatingCardData } from './FloatingCard';
import Reveal from './Reveal';

const CARDS: FloatingCardData[] = PRODUCT_FACTS.map((fact) => ({
  img: fact.img,
  tag: 'Did you know?',
  title: fact.title,
  text: fact.text,
  href: fact.href,
  bg: fact.bg,
  link: `Explore ${fact.tag}`,
}));

export default function DidYouKnowSection() {
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
    railRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  };

  return (
    <section className="pt-8 sm:pt-10 lg:pt-12 overflow-hidden" style={{ background: 'var(--bg-light)' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-20">
        <Reveal className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
          <div>
            <p className="mb-4 text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-on-light)' }}>
              Did you know?
            </p>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] leading-[1.05] font-medium tracking-[-0.02em]" style={{ color: 'var(--text-on-light)' }}>
              A little goodness in every bottle
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label="Previous facts"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-[52px] h-[52px] rounded-full border flex items-center justify-center text-xl cursor-pointer transition-opacity disabled:cursor-default"
              style={{ borderColor: 'var(--text-on-light)', background: 'var(--bg-light)', color: 'var(--text-on-light)', opacity: canScrollLeft ? 1 : 0.35 }}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next facts"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-xl cursor-pointer transition-opacity disabled:cursor-default"
              style={{ background: 'var(--text-on-light)', color: 'var(--bg-light)', opacity: canScrollRight ? 1 : 0.35 }}
            >
              →
            </button>
          </div>
        </Reveal>

        {/* Cards float their pack image above the top edge, so the rail
            needs top padding inside the scroll container — overflow-x:auto
            clips that pop-out otherwise. The .stagger-row offset on
            alternating cards is normal-flow margin, so it grows the row's
            own height and doesn't need extra bottom padding. */}
        <div
          ref={railRef}
          onScroll={updateScrollState}
          className="overflow-x-auto scroll-rail mt-8 sm:mt-10 pt-14 sm:pt-16 lg:pt-[72px] pb-10"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="stagger-row flex items-start gap-5 sm:gap-6 lg:gap-7 w-max">
            {CARDS.map((card, i) => (
              <Reveal key={card.title} className="snap-start" delay={Math.min(i, 4) * 90}>
                <FloatingCard card={card} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative h-0.5 mt-2" style={{ background: 'rgba(29,15,9,0.14)' }}>
          <span
            className="absolute left-0 top-0 bottom-0 transition-[width] duration-500 ease-out"
            style={{ width: `${fill}%`, background: 'var(--text-on-light)' }}
          />
        </div>
      </div>
    </section>
  );
}
