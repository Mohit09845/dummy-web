import FaqSection, { FaqItem } from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';
import { faqSchema } from '@/lib/schema';

interface FAQItem extends FaqItem {
  id: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What makes Sunfeast Dark Fantasy Beverages uniquely indulgent?',
    answer:
      'Sunfeast Dark Fantasy Beverages are created for true dessert lovers. Crafted with real Belgian cocoa, luscious fruit pulps, and rich dairy milk, each sip delivers a cafe-like decadent texture. Our advanced flash-UHT processing locks in intense chocolate richness and creaminess without compromising on quality.',
  },
  {
    id: 'faq-2',
    question: 'Are Sunfeast Dark Fantasy beverages suitable for vegetarians?',
    answer:
      'Yes, 100%. All Sunfeast Dark Fantasy Milkshakes (Belgian Chocolate, White Chocolate Vanilla), Smoothies (Mango, Berry & Mango), Badam Flavoured Milk, and Aashirvaad Lassi are 100% vegetarian and carry the certified green vegetarian emblem on every pack.',
  },
  {
    id: 'faq-3',
    question: 'How should I store and serve Sunfeast Beverages for the best taste?',
    answer:
      'For the ultimate indulgent experience, always serve chilled! Give the pack a gentle shake before sipping to awaken the rich, velvety consistency. Unopened packs can be stored at ambient room temperature in a cool, dry place away from sunlight. Once opened, refrigerate and consume within 24 hours.',
  },
  {
    id: 'faq-4',
    question: 'Do these beverages contain added chemical preservatives?',
    answer:
      'No. Our beverages are processed using high-precision Ultra-High Temperature (UHT) thermal technology and sealed in multi-layer aseptic Tetra Pak packaging. This preserves natural taste, aroma, and essential nutrients safely without requiring any artificial chemical preservatives.',
  },
  {
    id: 'faq-5',
    question: 'Where can I purchase Sunfeast Dark Fantasy beverages online?',
    answer:
      'You can easily order Sunfeast beverages on major quick-commerce and e-commerce platforms across India, including Blinkit, Zepto, Swiggy Instamart, Amazon Fresh, and Flipkart Supermart, as well as select supermarkets and premium retail outlets near you.',
  },
  {
    id: 'faq-6',
    question: 'What is the shelf life of Sunfeast Beverages packs?',
    answer:
      'Thanks to state-of-the-art aseptic packaging, unopened Sunfeast Milkshakes and Smoothies maintain their peak flavor and freshness for 6 to 9 months from the date of manufacture. Please refer to the top of each pack for the exact "Best Before" date.',
  },
];

export default function FAQ() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <FaqSection
        id="faq"
        eyebrow="Got questions?"
        title="Frequently asked questions"
        items={FAQS}
        intro={
          <>
            <p className="mt-5 mx-auto max-w-[420px] text-base leading-relaxed" style={{ color: 'var(--text-on-light-muted)' }}>
              Reach out to our consumer care desk or write directly to ITC Foods.
            </p>
            <a
              href="mailto:consumer.care@itc.in"
              className="inline-block mt-4 pb-1 border-b text-base font-medium"
              style={{ borderColor: 'var(--text-on-light)', color: 'var(--text-on-light)' }}
            >
              consumer.care@itc.in
            </a>
          </>
        }
      />
    </>
  );
}
