import Image from 'next/image';
import Link from 'next/link';
import type { Flavour } from '@/lib/flavours';

export interface ProductCardData {
  img: string;
  product?: string;
  vol?: string;
  tag: string;
  title: string;
  text: string;
  href: string;
  /** Tint background for the image panel. */
  bg?: string;
  link?: string;
}

/** The single mapping from a `Flavour` to this card's data shape — shared by
 * the Products grid and the Product Detail page's "You may also like" rail,
 * so both use the exact same card component and copy source. */
export function flavourToProductCard(flavour: Flavour): ProductCardData {
  const { product, variant } = flavour;
  return {
    tag: product.brand,
    title: variant?.name || product.name,
    text: variant?.tagline || product.description,
    product: product.category,
    vol: product.volume,
    img: variant?.image || product.packshot,
    bg: `color-mix(in srgb, ${variant?.color || product.accentColor} 22%, #F2E8D5)`,
    href: variant ? `/product/${product.id}?variant=${variant.id}` : `/product/${product.id}`,
  };
}

interface ProductCardProps {
  card: ProductCardData;
  /** Stretch to fill the parent's width/height (CSS Grid layouts) instead of
   * the fixed width used in horizontal scroll rails. */
  fluid?: boolean;
}

export default function ProductCard({ card, fluid = false }: ProductCardProps) {
  const link = card.link || 'View product';

  return (
    <article
      className={`${fluid ? 'w-full' : 'w-[240px] sm:w-[264px] lg:w-[288px]'} h-full flex flex-col rounded-[20px] overflow-hidden transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-18px_rgba(9,5,3,0.55)]`}
      style={{ background: '#24120B' }}
    >
      <div
        className="relative w-full aspect-[4/3] shrink-0 p-6"
        style={{ background: card.bg || 'var(--surface-light)' }}
      >
        <Image
          src={card.img}
          alt={`${card.title} pack`}
          fill
          sizes="288px"
          unoptimized
          className="object-contain p-2"
        />
      </div>

      <div className="flex flex-col flex-1 px-5 py-5" style={{ color: '#FAF3E0' }}>
        <span
          className="self-start px-2 py-[3px] text-[10px] font-semibold tracking-[0.1em] uppercase"
          style={{ background: '#D4AF37', color: '#090503' }}
        >
          {card.tag}
        </span>

        <h3 className="mt-3 text-lg leading-[1.2] font-medium">{card.title}</h3>

        <p className="mt-1.5 text-[13px] leading-relaxed flex-1" style={{ color: '#CBB89D' }}>
          {card.text}
        </p>

        {card.product && (
          <p className="mt-3 pt-2.5 text-xs border-t" style={{ color: '#CBB89D', borderColor: 'rgba(250,243,224,0.14)' }}>
            {card.product} · {card.vol}
          </p>
        )}

        <Link href={card.href} className="mt-2.5 text-[13px] font-semibold cursor-pointer" style={{ color: '#F7D78D' }}>
          {link} →
        </Link>
      </div>
    </article>
  );
}
