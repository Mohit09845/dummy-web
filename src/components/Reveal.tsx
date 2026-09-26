'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

// Fades/slides content in as it scrolls into view. Elements already on
// screen at mount are left untouched, so above-the-fold content never
// flashes and stays visible without JavaScript.
export default function Reveal({ children, className, delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.style.setProperty('--reveal-delay', `${delay}ms`);
    el.classList.add('reveal-pending');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('reveal-in');
        observer.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}
