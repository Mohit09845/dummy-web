import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductsSection from '@/components/ProductsSection';
import DrinkQuiz from '@/components/DrinkQuiz';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero banner (with working image) */}
        <Hero />

        {/* 2. Featured products */}
        <ProductsSection />

        {/* 3. Find your perfect drink quiz */}
        <section className="px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <DrinkQuiz />
        </section>

        {/* 4. FAQ */}
        <FAQ />
      </main>

      {/* 5. Footer */}
      <Footer />
    </>
  );
}
