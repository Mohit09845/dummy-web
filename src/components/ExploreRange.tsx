import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import Reveal from '@/components/Reveal';

const LINEUP = [
  PRODUCTS[0].variants[0].image, // chocolate
  PRODUCTS[0].variants[1].image, // vanilla
  PRODUCTS[1].variants[0].image, // mango
  PRODUCTS[1].variants[1].image, // berry
  PRODUCTS[1].variants[2].image, // breakfast
  PRODUCTS[2].packshot, // badam
  PRODUCTS[3].packshot, // lassi
];

export default function ExploreRange() {
  return (
    <section
      id="buy"
      className="relative overflow-hidden text-[#FAF3E0] pt-16 sm:pt-24 lg:pt-32 px-5 sm:px-10 lg:px-20"
      style={{
        background:
          'radial-gradient(ellipse 70% 55% at 50% 100%, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.12) 45%, rgba(212,175,55,0) 70%), linear-gradient(180deg, #0F0805 0%, #24120B 55%, #3A2114 100%)',
      }}
    >
      <Reveal className="relative z-10 max-w-[880px] mx-auto text-center flex flex-col items-center">
        <p className="mb-[18px] text-[13px] font-semibold tracking-[0.2em] uppercase text-[#F7D78D]">
          The full range
        </p>
        <h2 className="text-[42px] sm:text-[60px] lg:text-[80px] leading-none font-medium tracking-[-0.025em] text-balance">
          Explore the <em className="not-italic italic font-normal text-[#F7D78D]">full range</em>
        </h2>
        <p className="mt-[22px] max-w-[600px] text-base sm:text-[17px] lg:text-lg leading-relaxed text-[#E3D5BC] text-pretty">
          Milkshakes, smoothies, badam milk and lassi. Order on Blinkit, Zepto, Swiggy Instamart, Amazon Fresh and Flipkart Supermart, or find us at select supermarkets near you.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8 sm:mt-10 w-full">
          <Link
            href="/products"
            className="btn-gold w-full sm:w-auto flex items-center justify-center gap-2.5 h-[52px] px-7 rounded-full text-sm font-bold tracking-[0.08em] uppercase cursor-pointer"
          >
            See all products →
          </Link>
          <a
            href="https://blinkit.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center h-[52px] px-7 rounded-full border border-[rgba(250,243,224,0.45)] text-sm font-bold tracking-[0.08em] uppercase hover:border-[#F7D78D] hover:text-[#F7D78D] transition-colors cursor-pointer"
          >
            Order on Blinkit
          </a>
        </div>
      </Reveal>

      <div
        aria-hidden="true"
        className="relative z-[1] flex justify-center items-end gap-0 sm:gap-2 lg:gap-6 mt-16 sm:mt-14 lg:mt-16 flex-wrap sm:flex-nowrap"
      >
        {LINEUP.map((src, i) => (
          <Reveal
            key={src}
            delay={i * 70}
            className="relative h-[108px] w-[70px] sm:h-[210px] sm:w-[130px] lg:h-[340px] lg:w-[200px] -mb-[14px] sm:-mb-[26px] lg:-mb-[40px]"
          >
            <Image
              src={src}
              alt=""
              fill
              unoptimized
              sizes="200px"
              className="object-contain object-bottom drop-shadow-[0_28px_24px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2"
            />
          </Reveal>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="relative z-[2] h-10 sm:h-14 lg:h-[72px] -mx-5 sm:-mx-10 lg:-mx-20 border-t border-[rgba(247,215,141,0.35)]"
        style={{ background: 'linear-gradient(180deg, rgba(15,8,5,0) 0%, #140A06 70%)' }}
      />
    </section>
  );
}
