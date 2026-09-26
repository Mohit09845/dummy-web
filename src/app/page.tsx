import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductsSection from '@/components/ProductsSection';
import DidYouKnowSection from '@/components/DidYouKnowSection';
import ExploreRange from '@/components/ExploreRange';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Sunfeast Dark Fantasy Beverages | Where Every Sip Becomes an Indulgence',
    description:
      'Belgian chocolate milkshakes, real-fruit smoothies, badam milk and lassi from Dark Fantasy, Sunfeast and Aashirvaad.',
  },
};

// Interaction-heavy (quiz scoring, ~20 icons), code-split out of the initial
// route chunk. Still server-rendered (ssr defaults to true) so the first
// question stays in the static HTML for crawlers.
const DrinkQuiz = dynamic(() => import('@/components/DrinkQuiz'));

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductsSection />
        <DidYouKnowSection />
        <DrinkQuiz />
        <ExploreRange />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
