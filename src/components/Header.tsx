'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Header hides while the user is actively scrolling down, and reappears
// either when they scroll up or when scrolling comes to a stop.
const HIDE_THRESHOLD_PX = 80; // don't hide until scrolled past the very top
const SCROLL_STOP_DELAY_MS = 220;

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastScrollY.current;

      if (y <= HIDE_THRESHOLD_PX) {
        setHidden(false);
      } else if (goingDown) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;

      if (stopTimer.current) clearTimeout(stopTimer.current);
      stopTimer.current = setTimeout(() => setHidden(false), SCROLL_STOP_DELAY_MS);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3.5 px-5 sm:px-10 lg:px-16 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform bg-[#090503]/90 backdrop-blur-md border-b border-[rgba(212,175,55,0.2)] shadow-[0_4px_28px_rgba(0,0,0,0.6)] flex items-center justify-between ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* ── Top-Left: Dark Fantasy Brand Logo (Clean, No Border) ── */}
      <Link href="/" className="relative w-36 sm:w-44 h-10 sm:h-11 block cursor-pointer">
        <Image
          src="/assets/logos/df-logo.webp"
          alt="Sunfeast Dark Fantasy"
          fill
          className="object-contain object-left filter brightness-[2.3] contrast-[1.1] drop-shadow-[0_1px_8px_rgba(212,175,55,0.4)]"
          priority
          unoptimized
        />
      </Link>

      {/* ── Top-Right: Explore Products Button ── */}
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="btn-gold px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Explore Products</span>
          <ArrowRight size={14} className="text-[#120701]" />
        </Link>
      </div>
    </header>
  );
}
