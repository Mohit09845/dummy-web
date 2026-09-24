import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductsSection from '@/components/ProductsSection';
import LifestyleBanner from '@/components/LifestyleBanner';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

// Below-the-fold and interaction-heavy (framer-motion, ~20 lucide icons,
// quiz scoring logic) — code-split out of the initial route chunk. Still
// server-rendered (ssr defaults to true) so the first question stays in
// the static HTML for crawlers/GEO.
const DrinkQuiz = dynamic(() => import('@/components/DrinkQuiz'));

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero banner (with working image) */}
        <Hero />

        {/* 2. Featured products */}
        <ProductsSection />

        {/* 3. Lifestyle moment */}
        <LifestyleBanner />

        {/* 4. Find your perfect drink quiz */}
        <section className="px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <DrinkQuiz />
        </section>

        {/* 5. FAQ */}
        <FAQ />
      </main>

      {/* 6. Footer */}
      <Footer />
    </>
  );
}
