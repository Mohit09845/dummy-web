'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const EXPLORE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore All Products', href: '/products' },
  { label: 'Occasions', href: '/occasions/beat-the-heat' },
  { label: 'Frequently Asked Questions', href: '/#faq' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/darkfantasycreations', icon: '/assets/logos/Instagram_logo.svg' },
  { label: 'Facebook', href: 'https://www.facebook.com/darkfantasy', icon: '/assets/logos/facebook.webp' },
  // Black mark on a transparent background: invisible on the dark footer without a white plate behind it.
  { label: 'X (Twitter)', href: 'https://x.com/darkfantasycreations', icon: '/assets/logos/twitter-x.webp', plate: true },
  { label: 'YouTube', href: 'https://www.youtube.com', icon: '/assets/logos/youtube.webp' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 4000);
    }
  };

  return (
    <footer className="pt-14 sm:pt-16 pb-10 px-5 sm:px-10 lg:px-20" style={{ background: '#24120B', color: '#CBB89D' }}>
      <div className="max-w-[1280px] mx-auto">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_1.3fr] gap-8 sm:gap-10 pb-8 sm:pb-10 border-b"
          style={{ borderColor: 'rgba(212,175,55,0.18)' }}
        >
          {/* Brand */}
          <div className="flex flex-col gap-[18px]">
            <Link href="/" className="relative w-14 h-14 block self-start cursor-pointer">
              <Image
                src="/assets/logos/Logo-sunfeast.webp"
                alt="Sunfeast Beverages"
                fill
                className="object-contain object-left"
                unoptimized
              />
            </Link>
            <p className="text-[15px] leading-relaxed max-w-[320px]" style={{ color: '#CBB89D' }}>
              A flagship brand of ITC Foods. Crafting moments of pure, unadulterated indulgence with authentic cocoa, real fruits, and dairy excellence.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-[18px] text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
              Explore
            </h3>
            <div className="flex flex-col gap-3 text-[15px]">
              {EXPLORE_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="hover:text-[#F7D78D] transition-colors cursor-pointer" style={{ color: '#CBB89D' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Follow */}
          <div>
            <h3 className="mb-[18px] text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
              Follow
            </h3>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l.label}
                  title={l.label}
                  className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 transition-transform duration-300 hover:scale-110"
                  style={l.plate ? { background: '#FFFFFF' } : undefined}
                >
                  <Image
                    src={l.icon}
                    alt=""
                    fill
                    unoptimized
                    className={l.plate ? 'object-contain p-2' : 'object-cover'}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-[18px] text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
              Contact Us
            </h3>
            <p className="text-[15px] leading-relaxed" style={{ color: '#BBA68C' }}>
              Have questions, feedback, or business inquiries? Drop us an email anytime.
            </p>
            <a
              href="mailto:consumer.care@itc.in"
              className="inline-block mt-3 text-base font-medium cursor-pointer"
              style={{ color: '#F7D78D' }}
            >
              consumer.care@itc.in
            </a>
            <form onSubmit={handleEmailSubmit} className="flex mt-[18px] border-b" style={{ borderColor: 'rgba(212,175,55,0.4)' }}>
              <input
                type="email"
                aria-label="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to reach us"
                required
                className="flex-1 min-w-0 h-12 bg-transparent border-0 outline-none text-[15px]"
                style={{ color: '#FAF3E0' }}
              />
              <button
                type="submit"
                className="h-12 pl-4 text-[13px] font-semibold tracking-[0.14em] uppercase cursor-pointer"
                style={{ color: '#F7D78D' }}
              >
                Send →
              </button>
            </form>
            {submitted && (
              <p className="mt-2 text-xs font-semibold text-green-400">
                Thank you! We&apos;ll be in touch with you shortly.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-2.5 pt-7 text-[13px]" style={{ color: '#BBA68C' }}>
          <p className="m-0">© {new Date().getFullYear()} ITC Limited. All rights reserved.</p>
          <p className="m-0">Sunfeast &amp; Dark Fantasy are registered trademarks of ITC Limited.</p>
        </div>
      </div>
    </footer>
  );
}
