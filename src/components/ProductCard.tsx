'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const activeColor = product.accentColor;
  const activeImage = product.packshot;

  return (
    <>
      {/* Card */}
      <motion.article
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="card-glow flex-shrink-0 w-[280px] sm:w-[310px] rounded-3xl overflow-hidden relative group cursor-pointer flex flex-col justify-between"
        style={{
          background: 'var(--bg-card)',
          border: `1px solid var(--border)`,
          boxShadow: `0 0 0 0 ${activeColor}00`,
        }}
        whileHover={{
          boxShadow: `0 24px 60px -15px ${activeColor}40`,
        }}
      >
        {/* Accent glow top stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl z-20"
          style={{ background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)` }}
        />

        {/* Product image stage */}
        <Link
          href={`/product/${product.id}`}
          className="relative h-[250px] flex items-end justify-center overflow-hidden block cursor-pointer transition-colors duration-300"
          style={{ background: `linear-gradient(160deg, ${activeColor}18 0%, #0F0805 100%)` }}
        >
          {/* Radial aura behind packshot */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 80%, ${activeColor}30 0%, transparent 68%)`,
            }}
          />

          <div className="relative z-10 h-[215px] w-[155px] packshot-zoom flex items-end justify-center">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
              sizes="(max-width: 768px) 155px, 180px"
              unoptimized
            />
          </div>

          {/* Category pill */}
          <div
            className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider glass"
            style={{
              borderColor: `${activeColor}50`,
              color: product.accentLight,
            }}
          >
            {product.category}
          </div>
        </Link>

        {/* Card body */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
          <div>
            {/* Brand + Name */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeColor }} />
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: activeColor }}>
                {product.brand}
              </p>
            </div>

            <Link href={`/product/${product.id}`} className="block group-hover:text-[var(--gold-light)]">
              <h3
                className="font-display text-lg font-bold leading-snug mb-2 line-clamp-2 transition-colors duration-200"
                style={{ color: 'var(--text-primary)' }}
              >
                {product.shortName}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
              {product.description}
            </p>
          </div>

          <div>
            {/* Volume & Pack Details (No price tag as requested) */}
            <div className="flex items-center justify-between py-2.5 px-3 rounded-xl mb-4 border border-[var(--border)]" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--gold-light)' }}>
                <span>{product.volume}</span>
              </div>
              <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                Ready to Serve
              </span>
            </div>

            {/* Actions: View Details only (No Buy Now on homepage) */}
            <div className="pt-1">
              <Link
                href={`/product/${product.id}`}
                className="group/btn btn-gold w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-102 active:scale-98 transition-all duration-200"
              >
                <span>View Details</span>
                <ArrowRight
                  size={14}
                  className="text-[#120701] transition-transform duration-200 ease-out group-hover/btn:translate-x-1 will-change-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    </>
  );
}
