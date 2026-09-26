'use client';

import { useState, type ReactNode } from 'react';
import Reveal from '@/components/Reveal';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  items: FaqItem[];
  className?: string;
}

// Every answer stays in the server HTML (collapsed with a CSS grid-rows
// transition) so crawlers and AI answer engines can read all of them.
export default function FaqSection({ id, eyebrow, title, intro, items, className = '' }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={id}
      className={`py-16 sm:py-24 lg:py-28 px-5 sm:px-10 lg:px-20 ${className}`}
      style={{ background: 'var(--bg-light)' }}
    >
      <div className="max-w-[800px] mx-auto">
        <Reveal className="text-center mb-10 sm:mb-14">
          <p className="mb-4 text-[13px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-on-light)' }}>
            {eyebrow}
          </p>
          <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.02] font-medium tracking-[-0.02em] text-balance" style={{ color: 'var(--text-on-light)' }}>
            {title}
          </h2>
          {intro}
        </Reveal>

        <Reveal delay={120}>
          {items.map((faq, i) => {
            const isOpen = openIndex === i;
            const panelId = `${id ?? 'faq'}-panel-${i}`;
            return (
              <div key={faq.question} className="border-b" style={{ borderColor: 'var(--border-on-light)' }}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="group w-full flex justify-between items-center gap-5 min-h-[72px] py-[18px] text-left"
                    style={{ color: 'var(--text-on-light)' }}
                  >
                    <span className="text-[17px] sm:text-lg lg:text-xl font-medium leading-[1.35] transition-colors group-hover:text-[var(--accent-on-light)]">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-[background-color,color,transform] duration-300"
                      style={{
                        borderColor: 'var(--border-on-light-strong)',
                        background: isOpen ? 'var(--text-on-light)' : 'transparent',
                        color: isOpen ? 'var(--bg-light)' : 'var(--text-on-light)',
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M2 7h10" />
                        {!isOpen && <path d="M7 2v10" />}
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  inert={!isOpen}
                  className="grid transition-[grid-template-rows,opacity] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <p className="pr-0 sm:pr-14 pb-6 text-base leading-relaxed" style={{ color: 'var(--text-on-light-muted)' }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
