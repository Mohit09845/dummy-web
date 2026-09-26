// Static banner: a single image, no carousel, no client JS. See AGENTS.md
// if reviving a multi-slide version — home-slider-two/three.webp are the
// other two creatives previously used here.
import Image from 'next/image';
import Link from 'next/link';

const IMAGE = {
  src: '/assets/kvs/hero-range.webp',
  alt: 'Sunfeast Breakfast Smoothie styled with oats, almonds and banana',
  posMobile: '30% center',
  posDesktop: 'center 62%',
};

const COPY = {
  eyebrow: 'Dark Fantasy · Sunfeast · Aashirvaad',
  a: 'Where every ',
  em: 'sip',
  b: ' becomes an indulgence.',
  sub: 'Rich Belgian chocolate shakes, luscious fruit smoothies, and slow-crafted flavoured milks created for decadent everyday refreshment.',
};

const PRIMARY_CTA = { label: 'Explore Products', href: '/products' };
const SECONDARY_CTA = { label: 'Find your drink', href: '#quiz' };

export default function Hero() {
  return (
    <section className="relative w-full bg-[#090503] pt-16 sm:pt-[76px] lg:pt-[84px]" aria-label="Featured">
      {/* Sized off the viewport itself (not an aspect-ratio) so the image
          always reaches the bottom of the frame with no gap before the
          next section, at any window width/height combination. */}
      <div className="relative w-full h-[86svh] min-h-[600px] max-h-[820px] lg:h-[calc(100svh-84px)] lg:min-h-[640px] lg:max-h-[880px] overflow-hidden">
        <Image
          src={IMAGE.src}
          alt={IMAGE.alt}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover [object-position:var(--pos-m)] lg:[object-position:var(--pos-d)]"
          style={{ '--pos-m': IMAGE.posMobile, '--pos-d': IMAGE.posDesktop } as React.CSSProperties}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(9,5,3,0.42) 0%, rgba(9,5,3,0) 100%), linear-gradient(180deg, rgba(9,5,3,0.38) 0%, rgba(9,5,3,0.26) 45%, rgba(9,5,3,0.6) 100%)',
          }}
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 sm:px-10">
          <div className="hero-rise max-w-[900px] flex flex-col items-center [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
            <p className="mb-4 sm:mb-5 text-[12px] sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-[#F7D78D]">
              {COPY.eyebrow}
            </p>
            <h1 className="text-[42px] leading-[1.02] sm:text-[60px] lg:text-[64px] xl:text-[76px] font-medium tracking-[-0.025em] text-[#FAF3E0] text-balance">
              {COPY.a}
              <em className="italic font-normal text-[#F7D78D]">{COPY.em}</em>
              {COPY.b}
            </h1>
            <p className="mt-5 max-w-[560px] text-base sm:text-lg leading-relaxed text-[#F2E8D5]">
              {COPY.sub}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8 w-full sm:w-auto [text-shadow:none]">
              <Link
                href={PRIMARY_CTA.href}
                className="btn-gold w-full sm:w-auto flex items-center justify-center gap-2.5 h-[52px] px-7 rounded-full text-sm font-bold tracking-[0.08em] uppercase"
              >
                {PRIMARY_CTA.label} →
              </Link>
              <a
                href={SECONDARY_CTA.href}
                className="w-full sm:w-auto flex items-center justify-center h-[52px] px-7 rounded-full border border-[rgba(250,243,224,0.55)] bg-[rgba(9,5,3,0.25)] backdrop-blur-sm text-sm font-bold tracking-[0.08em] uppercase text-[#FAF3E0] hover:border-[#F7D78D] hover:text-[#F7D78D] transition-colors"
              >
                {SECONDARY_CTA.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
