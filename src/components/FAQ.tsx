'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, HelpCircle, Mail } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'all' | 'products' | 'ingredients' | 'serving' | 'availability';
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'products',
    question: 'What makes Sunfeast Dark Fantasy Beverages uniquely indulgent?',
    answer:
      'Sunfeast Dark Fantasy Beverages are created for true dessert lovers. Crafted with real Belgian cocoa, luscious fruit pulps, and rich dairy milk, each sip delivers a cafe-like decadent texture. Our advanced flash-UHT processing locks in intense chocolate richness and creaminess without compromising on quality.',
  },
  {
    id: 'faq-2',
    category: 'ingredients',
    question: 'Are Sunfeast Dark Fantasy beverages suitable for vegetarians?',
    answer:
      'Yes, 100%. All Sunfeast Dark Fantasy Milkshakes (Belgian Chocolate, White Chocolate Vanilla), Smoothies (Mango, Berry & Mango), Badam Flavoured Milk, and Aashirvaad Lassi are 100% vegetarian and carry the certified green vegetarian emblem on every pack.',
  },
  {
    id: 'faq-3',
    category: 'serving',
    question: 'How should I store and serve Sunfeast Beverages for the best taste?',
    answer:
      'For the ultimate indulgent experience, always serve chilled! Give the pack a gentle shake before sipping to awaken the rich, velvety consistency. Unopened packs can be stored at ambient room temperature in a cool, dry place away from sunlight. Once opened, refrigerate and consume within 24 hours.',
  },
  {
    id: 'faq-4',
    category: 'ingredients',
    question: 'Do these beverages contain added chemical preservatives?',
    answer:
      'No. Our beverages are processed using high-precision Ultra-High Temperature (UHT) thermal technology and sealed in multi-layer aseptic Tetra Pak packaging. This preserves natural taste, aroma, and essential nutrients safely without requiring any artificial chemical preservatives.',
  },
  {
    id: 'faq-5',
    category: 'availability',
    question: 'Where can I purchase Sunfeast Dark Fantasy beverages online?',
    answer:
      'You can easily order Sunfeast beverages on major quick-commerce and e-commerce platforms across India, including Blinkit, Zepto, Swiggy Instamart, Amazon Fresh, and Flipkart Supermart, as well as select supermarkets and premium retail outlets near you.',
  },
  {
    id: 'faq-6',
    category: 'products',
    question: 'What is the shelf life of Sunfeast Beverages packs?',
    answer:
      'Thanks to state-of-the-art aseptic packaging, unopened Sunfeast Milkshakes and Smoothies maintain their peak flavor and freshness for 6 to 9 months from the date of manufacture. Please refer to the top of each pack for the exact "Best Before" date.',
  },
];

export default function FAQ() {
  const [activeId, setActiveId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'All Questions', value: 'all' },
    { label: 'Products & Flavours', value: 'products' },
    { label: 'Ingredients & Safety', value: 'ingredients' },
    { label: 'Serving & Storage', value: 'serving' },
    { label: 'Where to Buy', value: 'availability' },
  ];

  const filteredFaqs =
    selectedCategory === 'all'
      ? FAQS
      : FAQS.filter((item) => item.category === selectedCategory);

  const toggleAccordion = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gold-light)' }}>
            <span>Got Questions?</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            Frequently Asked <span className="text-gold-gradient italic">Questions</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to know about our indulgent range of milkshakes, smoothies, ingredients, and storage tips.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${selectedCategory === cat.value
                ? 'btn-gold shadow-md'
                : 'glass text-[var(--text-secondary)] hover:text-[var(--gold-light)] hover:border-[var(--border-strong)]'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = activeId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-2xl transition-colors duration-300 overflow-hidden"
                style={{
                  background: isOpen ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  border: isOpen ? '1px solid var(--border-strong)' : '1px solid var(--border)',
                  boxShadow: isOpen ? '0 12px 30px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.08)' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 sm:py-6 flex items-center justify-between gap-4 transition-colors group cursor-pointer"
                >
                  <span
                    className={`font-display text-base sm:text-lg font-semibold leading-snug transition-colors ${isOpen ? 'text-gold-gradient' : 'text-[var(--text-primary)] group-hover:text-[var(--gold-light)]'
                      }`}
                  >
                    {faq.question}
                  </span>

                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300"
                    style={{
                      background: isOpen ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.08)',
                      color: isOpen ? 'var(--gold-light)' : 'var(--gold)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <motion.span
                      className="flex items-center justify-center"
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <Plus size={16} />
                    </motion.span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed border-t border-[rgba(212,175,55,0.08)]" style={{ color: 'var(--text-secondary)' }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Support Help Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 rounded-3xl p-6 sm:p-8 glass flex flex-col sm:flex-row items-center justify-between gap-6 border border-[var(--border)]"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 hidden sm:flex"
              style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-light)' }}
            >
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Have more questions?
              </h4>
              <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Reach out to our consumer care desk or write directly to ITC Foods.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:consumer.care@itc.in"
              className="btn-gold px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg"
            >
              <Mail size={14} />
              <span>consumer.care@itc.in</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
