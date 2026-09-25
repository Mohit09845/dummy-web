'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const [heroSrc, setHeroSrc] = useState<string>('/assets/kvs/sunfeast-bf-smoothie-hero.webp');
  const [imgError, setImgError] = useState<boolean>(false);

  // Subtle parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageError = () => {
    if (heroSrc === '/assets/kvs/sunfeast-bf-smoothie-hero.webp') {
      setHeroSrc('/assets/kvs/Sunfeast BF Smoothie A+ Content-01.webp');
    } else if (heroSrc === '/assets/kvs/Sunfeast BF Smoothie A+ Content-01.webp') {
      setHeroSrc('/assets/kvs/Picture1.webp');
    } else {
      setImgError(true);
    }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.16 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#090503]">
      {/* ── Parallax Background ───────────────────────── */}
      <div
        ref={bgRef}
        className="hero-parallax absolute inset-0 z-0 pointer-events-none"
        style={{ top: '-5%', height: '110%' }}
      >
        {!imgError ? (
          <Image
            key={heroSrc}
            src={heroSrc}
            alt="Sunfeast Dark Fantasy Beverages Hero"
            fill
            priority
            unoptimized
            sizes="100vw"
            onError={handleImageError}
            className="object-cover object-center"
          />
        ) : (
          /* Fallback gradient placeholder if image fails to load */
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background:
                'radial-gradient(ellipse at 50% 35%, rgba(212, 175, 55, 0.25) 0%, rgba(35, 16, 9, 0.95) 55%, #090503 100%)',
            }}
          />
        )}

        {/* Darker overlay for rich text contrast */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090503] via-[#090503]/55 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090503]/70 via-transparent to-[#090503]/70" />
      </div>

      {/* ── Hero Content (Compact single-view layout) ── */}
      <div className="relative z-10 text-center px-5 sm:px-8 max-w-4xl mx-auto pt-20 sm:pt-24 pb-12 flex flex-col items-center justify-center">
        {/* Main headline, staggered with drop shadow */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-1 sm:space-y-1.5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          <motion.h1
            variants={fadeUp}
            className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#FAF3E0]"
          >
            Where Every
          </motion.h1>
          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic leading-[0.95] tracking-tight text-gold-gradient drop-shadow-[0_2px_16px_rgba(212,175,55,0.4)]"
          >
            Sip
          </motion.h1>
          <motion.h1
            variants={fadeUp}
            className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#FAF3E0]"
          >
            Becomes an Indulgence.
          </motion.h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: 'easeOut' }}
          className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed text-[#FAF3E0]/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-medium"
        >
          Rich Belgian chocolate shakes, luscious fruit smoothies, and slow-crafted
          flavoured milks created for decadent everyday refreshment.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5, ease: 'easeOut' }}
          className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link
            href="/products"
            className="btn-gold px-7 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase shadow-2xl cursor-pointer inline-flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Explore Products</span>
          </Link>
          <button
            type="button"
            onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase glass cursor-pointer"
          >
            Read FAQs
          </button>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-10"
        onClick={scrollToProducts}
        role="button"
        tabIndex={0}
        aria-label="Scroll down to products"
      >
        <ChevronDown
          size={20}
          className="bounce-down text-[var(--gold)]"
        />
      </motion.div>
    </section>
  );
}
