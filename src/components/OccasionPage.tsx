// Server component: each occasion is its own static route, so all of this
// is plain HTML. Only FaqSection and Reveal ship JS.
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FLAVOURS } from '@/lib/flavours';
import { OCCASIONS, OCCASION_FAQS, occasionPath, type Occasion } from '@/lib/occasions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCard, { type FloatingCardData } from '@/components/FloatingCard';
import FaqSection from '@/components/FaqSection';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, itemListSchema } from '@/lib/schema';

export function occasionCards(occ: Occasion): FloatingCardData[] {
  return occ.drinks.flatMap(({ flavourKey, why }) => {
    const flavour = FLAVOURS.find((f) => f.key === flavourKey);
    if (!flavour) return [];
    const { product, variant } = flavour;
    return [
      {
        tag: product.brand,
        title: variant?.name || product.name,
        text: why,
        product: product.category,
        vol: product.volume,
        img: variant?.image || product.packshot,
        bg: `color-mix(in srgb, ${variant?.color || product.accentColor} 22%, #F2E8D5)`,
        href: variant ? `/product/${product.id}?variant=${variant.id}` : `/product/${product.id}`,
        link: 'View product',
      },
    ];
  });
}

export function occasionMetadata(occ: Occasion): Metadata {
  const path = occasionPath(occ);
  const description = `${occ.question} ${occ.answer}`.slice(0, 158);
  return {
    title: occ.page,
    description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: occ.page,
      description,
      images: [{ url: occ.bannerImage, alt: occ.bannerAlt }],
    },
    twitter: { title: occ.page, description, images: [occ.bannerImage] },
  };
}

export function OccasionJsonLd({ occ }: { occ: Occasion }) {
  return (
    <JsonLd
      data={[
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Occasions', path: occasionPath(OCCASIONS[0]) },
          { name: occ.label, path: occasionPath(occ) },
        ]),
        itemListSchema(
          `Suggested drinks: ${occ.label}`,
          occasionCards(occ).map((c) => ({ name: c.title, path: c.href, image: c.img })),
        ),
        faqSchema([
          { question: occ.question, answer: occ.answer },
          ...OCCASION_FAQS.map((f) => ({ question: f.q, answer: f.a })),
        ]),
      ]}
    />
  );
}

export default function OccasionPage({ occasion: occ }: { occasion: Occasion }) {
  const cards = occasionCards(occ);
  const others = OCCASIONS.filter((o) => o.key !== occ.key);

  return (
    <>
      <Header />

      <main className="pt-16 sm:pt-[76px] lg:pt-[84px]">
        {/* ── Occasion hero ── */}
        <section style={{ background: '#140A06', color: '#FAF3E0' }} className="py-8 sm:py-10 lg:py-14 px-5 sm:px-10 lg:px-20">
          <div className="max-w-[1280px] mx-auto">
            <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm" style={{ color: '#CBB89D' }}>
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href={occasionPath(OCCASIONS[0])}>Occasions</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" style={{ color: '#FAF3E0' }}>{occ.label}</span>
            </nav>

            <p className="mt-6 sm:mt-8 mb-4 text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#F7D78D' }}>
              Occasions
            </p>
            <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.02] font-medium tracking-[-0.025em] max-w-[900px] text-balance">
              {occ.page}
            </h1>

            <nav aria-label="Occasions" className="flex gap-2 overflow-x-auto scroll-rail mt-8 sm:mt-10">
              {OCCASIONS.map((o) => {
                const active = o.key === occ.key;
                return (
                  <Link
                    key={o.key}
                    href={occasionPath(o)}
                    scroll={false}
                    aria-current={active ? 'page' : undefined}
                    className="shrink-0 h-11 px-5 inline-flex items-center rounded-full text-[15px] font-medium whitespace-nowrap border transition-colors"
                    style={{
                      background: active ? '#D4AF37' : 'transparent',
                      color: active ? '#090503' : '#FAF3E0',
                      borderColor: active ? '#D4AF37' : 'rgba(250,243,224,0.3)',
                    }}
                  >
                    {o.label}
                  </Link>
                );
              })}
            </nav>

            {/* ── Banner: full image with overlaid text ── */}
            <div className="relative mt-8 sm:mt-10 rounded overflow-hidden h-[380px] sm:h-[440px] lg:h-[520px] bg-[#24120B]">
              <Image
                src={occ.bannerImage}
                alt={occ.bannerAlt}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 1280px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: 'linear-gradient(0deg, rgba(9,5,3,0.82) 0%, rgba(9,5,3,0.4) 45%, rgba(9,5,3,0.05) 100%)' }}
              />
              <div className="hero-rise absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10 lg:p-14 [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
                <p className="mb-3.5 text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: '#CBB89D' }}>
                  {occ.label}
                </p>
                <h2 className="text-[26px] sm:text-[34px] lg:text-[40px] leading-[1.1] font-medium tracking-[-0.015em] max-w-[600px] text-balance">
                  {occ.question}
                </h2>
                <p className="mt-4 max-w-[560px] text-base leading-relaxed text-pretty" style={{ color: '#E3D5BC' }}>
                  {occ.answer}
                </p>
                <a
                  href="#suggested"
                  className="inline-block mt-6 sm:mt-8 pb-1 border-b text-sm font-semibold tracking-[0.08em] uppercase w-fit"
                  style={{ borderColor: '#F7D78D', color: '#F7D78D' }}
                >
                  See suggested drinks ↓
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Suggested drinks ── */}
        <section id="suggested" style={{ background: 'var(--bg-light)' }} className="pt-16 sm:pt-24 lg:pt-28 px-5 sm:px-10 lg:px-20 overflow-hidden">
          <div className="max-w-[1280px] mx-auto">
            <Reveal className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
              <div>
                <p className="mb-4 text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-on-light)' }}>
                  Suggested drinks
                </p>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] leading-[1.02] font-medium tracking-[-0.02em]" style={{ color: 'var(--text-on-light)' }}>
                  Why these work for {occ.label.toLowerCase()}
                </h2>
              </div>
              <Link href="/products" className="pb-1 border-b text-sm font-semibold tracking-[0.08em] uppercase w-fit" style={{ borderColor: 'var(--text-on-light)', color: 'var(--text-on-light)' }}>
                All products →
              </Link>
            </Reveal>

            {/* Cards float their pack image above the top edge, so the rail
                needs top padding inside the scroll container — overflow-x:auto
                clips that pop-out otherwise. The .stagger-row offset on
                alternating cards is normal-flow margin, so it grows the
                row's own height and doesn't need extra bottom padding. */}
            <div
              className="overflow-x-auto scroll-rail mt-8 sm:mt-10 pt-14 sm:pt-16 lg:pt-[72px] pb-10"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              <div className="stagger-row flex items-start gap-5 sm:gap-6 lg:gap-7 w-max">
                {cards.map((card, i) => (
                  <Reveal key={card.title} className="snap-start" delay={i * 90}>
                    <FloatingCard card={card} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Occasion FAQ ── */}
        <FaqSection
          id="occasion-faq"
          eyebrow="Quick answers"
          title="Common questions"
          items={OCCASION_FAQS.map((f) => ({ question: f.q, answer: f.a }))}
          intro={
            <Link href="/#quiz" className="inline-block mt-6 pb-1 border-b text-base font-medium" style={{ borderColor: 'var(--text-on-light)', color: 'var(--text-on-light)' }}>
              Not sure? Take the Drink Finder →
            </Link>
          }
        />

        {/* ── More occasions ── */}
        <section style={{ background: 'var(--bg-light)' }} className="pt-4 sm:pt-6 pb-16 sm:pb-24 lg:pb-32 px-5 sm:px-10 lg:px-20">
          <div className="max-w-[1280px] mx-auto">
            <Reveal>
              <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-medium" style={{ color: 'var(--text-on-light)' }}>
                More occasions
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {others.map((o, i) => (
                <Reveal key={o.key} delay={i * 90}>
                  <Link
                    href={occasionPath(o)}
                    className="group w-full h-full flex flex-col justify-between gap-6 min-h-[200px] p-6 rounded text-left transition-[transform,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#EADDC5] hover:shadow-[0_18px_36px_-22px_rgba(29,15,9,0.45)]"
                    style={{ background: 'var(--surface-light)', color: 'var(--text-on-light)' }}
                  >
                    <span className="text-[12px] font-semibold tracking-[0.16em] uppercase" style={{ color: 'var(--accent-on-light)' }}>
                      {o.label}
                    </span>
                    <span className="text-[22px] leading-[1.25] font-medium">{o.page}</span>
                    <span className="text-sm font-semibold">
                      Read guide <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
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
