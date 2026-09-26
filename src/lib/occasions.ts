export interface OccasionDrink {
  /** Matches a Flavour.key from '@/lib/flavours'. */
  flavourKey: string;
  why: string;
}

export interface OccasionFaq {
  q: string;
  a: string;
}

export interface Occasion {
  key: 'heat' | 'go' | 'morning' | 'comfort';
  /** URL segment: /occasions/[slug]. Changing one breaks indexed URLs. */
  slug: string;
  label: string;
  page: string;
  question: string;
  answer: string;
  bannerImage: string;
  bannerAlt: string;
  drinks: OccasionDrink[];
}

// Shared across occasions: facts already established elsewhere on the site
// (productFaq.ts, FAQ.tsx), not occasion-specific claims.
export const OCCASION_FAQS: OccasionFaq[] = [
  {
    q: 'Are these drinks 100% vegetarian?',
    a: 'Yes. Every Sunfeast, Dark Fantasy and Aashirvaad beverage carries the certified green vegetarian emblem on the pack.',
  },
  {
    q: 'Do they contain added chemical preservatives?',
    a: 'No. All beverages are flash-UHT processed and sealed in multi-layer aseptic Tetra Pak packaging, so no chemical preservatives are needed.',
  },
  {
    q: 'How should I store and serve them?',
    a: 'Serve chilled and shake well before drinking. Store unopened packs in a cool, dry place, and refrigerate after opening.',
  },
];

export const OCCASIONS: Occasion[] = [
  {
    key: 'heat',
    slug: 'beat-the-heat',
    label: 'Beat the heat',
    page: 'Best drinks for summer in India',
    question: 'What should I drink on a hot day?',
    answer:
      'Pick something cold, fruity or cultured. Chilled lassi is naturally cooling and hydrating, and real-fruit smoothies help restore fluids lost to warm Indian weather.',
    bannerImage: '/assets/kvs/hero-range.webp',
    bannerAlt: 'Sunfeast Breakfast Smoothie with ingredients on an orange backdrop',
    drinks: [
      { flavourKey: 'aashirvaad-lassi', why: 'Naturally cooling and hydrating on hot days, and easy on the stomach.' },
      { flavourKey: 'var-mango', why: '25% real Ratnagiri Alphonso chunks and a dairy base that restores fluids lost to warm weather.' },
      { flavourKey: 'var-berry', why: 'Real berries and sweet mango in a creamy dairy base that keeps you going.' },
    ],
  },
  {
    key: 'go',
    slug: 'on-the-go',
    label: 'On-the-go refreshment',
    page: 'Quick refreshment ideas during work',
    question: 'What should I grab on a busy commute?',
    answer:
      'Pick something quick to sip and easy to carry. Ready-to-drink Tetra Paks need no prep, so you can grab one on the way out and keep going.',
    bannerImage: '/assets/kvs/sunfeast-bf-smoothie-hero.webp',
    bannerAlt: 'Sunfeast Breakfast Smoothie packs styled with almonds, oats and dates',
    drinks: [
      { flavourKey: 'var-choco', why: 'A rich, feel-good treat you can drink straight from the pack, no spoon needed.' },
      { flavourKey: 'badam-milk', why: 'Real almond slivers and dairy protein for steady energy between meetings.' },
      { flavourKey: 'var-breakfast', why: 'Oats, dates and 4 super seeds in one 160ml bottle you can finish in one sip.' },
    ],
  },
  {
    key: 'morning',
    slug: 'busy-mornings',
    label: 'Busy mornings',
    page: 'Healthy drinks for the urban jobber',
    question: "What's a good drink for a rushed morning?",
    answer:
      'Something with real fibre and protein carries you further than a rushed breakfast. Breakfast Smoothie packs oats, dates and 4 super seeds into a 160ml bottle you can drink in one go.',
    bannerImage: '/assets/kvs/Picture1.webp',
    bannerAlt: 'Sunfeast Breakfast Smoothie with oats, dates, almonds and banana',
    drinks: [
      { flavourKey: 'var-breakfast', why: '6g of protein per serve, with no added sugar, so the morning starts right.' },
      { flavourKey: 'badam-milk', why: 'California almonds, cardamom and a hint of saffron for a nourishing start.' },
      { flavourKey: 'var-mango', why: 'Real Alphonso mango pieces for a bright, energising start to the day.' },
    ],
  },
  {
    key: 'comfort',
    slug: 'evening-indulgence',
    label: 'Evening indulgence',
    page: 'Comfort drinks for rainy evenings',
    question: "What's a comforting drink to unwind with?",
    answer:
      "Rich, warming flavours work best at the end of the day. Dark Fantasy's Belgian cocoa or White Chocolate Vanilla milkshake make a cosy way to unwind.",
    bannerImage: '/assets/kvs/hero-range.webp',
    bannerAlt: 'Sunfeast Breakfast Smoothie with ingredients on an orange backdrop',
    drinks: [
      { flavourKey: 'var-choco', why: 'Deep, velvety Belgian cocoa for a proper end-of-day treat.' },
      { flavourKey: 'var-vanilla', why: 'Creamy vanilla bean and white chocolate for a gentler, comforting sip.' },
      { flavourKey: 'badam-milk', why: 'Warm cardamom and saffron notes make this a cosy, homestyle treat.' },
    ],
  },
];

export const occasionPath = (occ: Occasion) => `/occasions/${occ.slug}`;

export function getOccasionBySlug(slug: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}
