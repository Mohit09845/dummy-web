import Image from 'next/image';

export default function LifestyleBanner() {
  return (
    <section className="px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto mb-14 sm:mb-16">
      <div className="glass border border-[var(--border)] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-[#140A06]/80">
        <div className="relative w-full max-w-[280px] sm:w-64 sm:max-w-none aspect-square shrink-0 rounded-2xl overflow-hidden border border-[var(--border)]">
          <Image
            src="/assets/kvs/mango-smoothie-friends.webp"
            alt="Friends sharing Sunfeast Mango Smoothies together at a cafe"
            fill
            sizes="(max-width: 640px) 280px, 256px"
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gold-light)' }}>
            <span>Shared Moments</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            Good Company, <span className="text-gold-gradient italic">Great Taste</span>
          </h2>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            From quick catch-ups to long afternoons with friends, our beverages are the easy pick: ready to sip,
            endlessly craveable, and always worth sharing.
          </p>
        </div>
      </div>
    </section>
  );
}
