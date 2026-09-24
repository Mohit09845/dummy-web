'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Share2, MessageCircle, Send, Mail, Check } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Explore All Products', href: '/products' },
  { label: 'Beverages Collection', href: '/#products' },
  { label: 'Frequently Asked Questions', href: '/#faq' },
];

const SOCIALS = [
  { icon: <MessageCircle size={18} />, href: 'https://www.instagram.com/darkfantasycreations', label: 'Instagram' },
  { icon: <Globe size={18} />, href: 'https://darkfantasycreations.com/', label: 'Official Website' },
  { icon: <Share2 size={18} />, href: 'https://www.facebook.com/darkfantasy', label: 'Facebook' },
  { icon: <Send size={18} />, href: 'https://www.youtube.com', label: 'YouTube' },
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
    <footer
      className="pt-16 pb-10 border-t relative overflow-hidden"
      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-12 border-b border-[var(--border)]">
          {/* Brand column */}
          <div className="sm:col-span-1 space-y-4">
            <Link href="/" className="relative w-44 h-11 block cursor-pointer">
              <Image
                src="/assets/logos/df-logo.webp"
                alt="Sunfeast Dark Fantasy Logo"
                fill
                className="object-contain object-left filter brightness-[2.3] contrast-[1.1] drop-shadow-[0_1px_8px_rgba(212,175,55,0.4)]"
                unoptimized
              />
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              A flagship brand of ITC Foods. Crafting moments of pure, unadulterated indulgence with authentic cocoa, real fruits, and dairy excellence.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 glass border border-[var(--border)] hover:border-[var(--border-strong)] cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: 'var(--gold)' }}
            >
              Explore
            </h5>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-xs sm:text-sm transition-colors cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us / Email Section */}
          <div className="space-y-4">
            <h5
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--gold)' }}
            >
              Contact Us
            </h5>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Have questions, feedback, or business inquiries? Drop us an email anytime.
            </p>

            {/* Direct Email link */}
            <a
              href="mailto:itccares@itc.in"
              className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl glass border border-[var(--border)] hover:border-[var(--gold)] text-xs sm:text-sm font-semibold transition-all group hover:scale-[1.02] cursor-pointer"
              style={{ color: 'var(--gold-light)' }}
            >
              <Mail size={15} className="text-[var(--gold)] group-hover:scale-110 transition-transform" />
              <span>itccares@itc.in</span>
            </a>

            {/* Quick Email Inquiry */}
            <form onSubmit={handleEmailSubmit} className="space-y-2 pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to reach us..."
                  required
                  className="w-full bg-[#140A06] border border-[var(--border)] rounded-xl py-2.5 pl-3.5 pr-20 text-xs text-[#FAF3E0] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1.5 rounded-lg btn-gold text-[11px] font-bold tracking-wider cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  Send
                </button>
              </div>
              {submitted && (
                <p className="text-[11px] font-semibold text-green-400 flex items-center gap-1.5">
                  <Check size={12} />
                  <span>Thank you! We&apos;ll be in touch with you shortly.</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <p>© {new Date().getFullYear()} ITC Limited. All rights reserved.</p>
          <p>Sunfeast & Dark Fantasy are registered trademarks of ITC Limited.</p>
        </div>
      </div>
    </footer>
  );
}
