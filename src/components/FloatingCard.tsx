import Image from 'next/image';
import Link from 'next/link';

/** Pastel card with its image floating half above the top edge. Used for the
 * homepage "Did you know?" facts and Occasion "Suggested drinks" — both are
 * laid out with `.stagger-row` so alternating cards sit lower. */
export interface FloatingCardData {
  img: string;
  tag: string;
  title: string;
  text: string;
  href: string;
  bg?: string;
  link?: string;
  product?: string;
  vol?: string;
}

interface FloatingCardProps {
  card: FloatingCardData;
}

export default function FloatingCard({ card }: FloatingCardProps) {
  const link = card.link || 'View product';

  return (
    <article
      className="box-border w-[220px] sm:w-[240px] lg:w-[264px] flex flex-col px-5 pb-5 rounded transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_22px_40px_-20px_rgba(29,15,9,0.25)]"
      style={{ background: card.bg || 'var(--surface-light)', color: 'var(--text-on-light)' }}
    >
      <div className="relative self-center -mt-[46px] sm:-mt-[52px] lg:-mt-[58px] h-[92px] sm:h-[104px] lg:h-[116px] w-[70px] sm:w-[78px] lg:w-[86px]">
        <Image
          src={card.img}
          alt=""
          fill
          sizes="86px"
          unoptimized
          className="object-contain object-bottom drop-shadow-[0_12px_12px_rgba(9,5,3,0.2)]"
        />
      </div>

      <span
        className="self-start mt-3.5 px-2 py-[3px] text-[10px] font-semibold tracking-[0.1em] uppercase"
        style={{ background: '#1D0F09', color: '#FAF3E0' }}
      >
        {card.tag}
      </span>

      <h3 className="mt-2.5 text-base leading-[1.2] font-medium">{card.title}</h3>

      <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'var(--text-on-light-muted)' }}>
        {card.text}
      </p>

      {card.product && (
        <p className="mt-3 pt-2.5 text-xs border-t" style={{ color: 'var(--text-on-light-muted)', borderColor: 'var(--border-on-light)' }}>
          {card.product} · {card.vol}
        </p>
      )}

      <Link href={card.href} className="mt-2.5 text-[13px] font-semibold cursor-pointer" style={{ color: 'var(--accent-on-light)' }}>
        {link} →
      </Link>
    </article>
  );
}
