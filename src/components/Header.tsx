'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// Header hides while the user is actively scrolling down, and reappears
// either when they scroll up or when scrolling comes to a stop.
const HIDE_THRESHOLD_PX = 80; // don't hide until scrolled past the very top
const SCROLL_STOP_DELAY_MS = 220;

const NAV_LINKS = [
  { label: 'Home', href: '/', match: [] as string[] },
  { label: 'Products', href: '/products', match: ['/products', '/product/'] },
  { label: 'Occasions', href: '/occasions/beat-the-heat', match: ['/occasions'] },
  { label: 'FAQs', href: '/#faq', match: [] as string[] },
];

export default function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close the mobile drawer on route change. Adjusted during render (React's
  // recommended pattern) rather than in an effect, since it's deriving state
  // from a prop-like change, not syncing with an external system.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

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
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div
        className="h-16 sm:h-[76px] lg:h-[84px] px-5 sm:px-10 lg:px-20 flex items-center justify-between gap-6 border-b"
        style={{ background: '#24120B', borderColor: 'rgba(212,175,55,0.18)' }}
      >
        {/* ── Logo ── */}
        <Link href="/" className="relative w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 block shrink-0 cursor-pointer">
          <Image
            src="/assets/logos/Logo-sunfeast.webp"
            alt="Sunfeast Beverages"
            fill
            className="object-contain object-left"
            loading="eager"
            unoptimized
          />
        </Link>

        {/* ── Desktop nav ── */}
        <nav aria-label="Main" className="hidden lg:flex items-center gap-9 text-[15px] font-medium tracking-wide">
          {NAV_LINKS.map((l) => {
            const current = l.href === '/' ? pathname === '/' : l.match.some((m) => pathname.startsWith(m));
            return (
              <Link
                key={l.label}
                href={l.href}
                aria-current={current ? 'page' : undefined}
                className="py-1.5 border-b-[1.5px] transition-colors cursor-pointer"
                style={{
                  color: '#FAF3E0',
                  borderColor: current ? '#F7D78D' : 'transparent',
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right side: CTA (desktop) / hamburger (mobile & tablet) ── */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="hidden lg:flex btn-gold items-center gap-2 h-11 px-6 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Explore Products</span>
            <ArrowRight size={14} className="text-[#120701]" />
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden w-11 h-11 rounded-full border flex flex-col items-center justify-center gap-[5px] cursor-pointer"
            style={{ borderColor: 'rgba(250,243,224,0.3)' }}
          >
            <span
              className="block w-[18px] h-[1.5px] transition-transform"
              style={{ background: '#FAF3E0', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-[18px] h-[1.5px] transition-opacity"
              style={{ background: '#FAF3E0', opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-[18px] h-[1.5px] transition-transform"
              style={{ background: '#FAF3E0', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile / tablet nav drawer ── */}
      {menuOpen && (
        <div
          className="panel-in lg:hidden flex flex-col px-5 sm:px-10 pt-2 pb-8 max-h-[calc(100svh-64px)] overflow-y-auto"
          style={{ background: '#24120B' }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between min-h-16 border-b text-2xl cursor-pointer"
              style={{ color: '#FAF3E0', borderColor: 'rgba(212,175,55,0.18)' }}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-8">
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="btn-gold flex items-center justify-center h-[52px] rounded-full text-xs font-bold tracking-wider uppercase cursor-pointer"
            >
              Explore Products →
            </Link>
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center h-[52px] rounded-full border text-xs font-bold tracking-wider uppercase cursor-pointer"
              style={{ borderColor: 'rgba(250,243,224,0.4)', color: '#FAF3E0' }}
            >
              Where to buy
            </Link>
          </div>
          <p className="mt-7 text-sm" style={{ color: '#CBB89D' }}>
            Consumer care: consumer.care@itc.in
          </p>
        </div>
      )}
    </header>
  );
}
