import { PRODUCTS } from '@/data/products';

// Same facts already shown per-flavour in DrinkQuiz's result panel, reused
// here for the homepage "Did you know?" carousel so the claims stay in one
// place conceptually (see RECOMMENDATIONS in DrinkQuiz.tsx for the source).
export interface ProductFact {
  key: string;
  tag: string;
  title: string;
  text: string;
  img: string;
  href: string;
  bg: string;
}

// Pastel tint derived from each flavour's own brand colour, same formula
// ProductCard uses (flavourToProductCard) — keeps every tint tied to a real
// product colour instead of an arbitrary one.
const tint = (color: string) => `color-mix(in srgb, ${color} 22%, #F2E8D5)`;

export const PRODUCT_FACTS: ProductFact[] = [
  {
    key: 'var-choco',
    tag: 'Dark Fantasy',
    title: 'A gentler lift',
    text: 'Cocoa naturally contains theobromine and flavanols, a gentler lift than the sharp spike and crash of caffeine.',
    img: PRODUCTS[0].variants[0].image,
    href: `/product/${PRODUCTS[0].id}?variant=${PRODUCTS[0].variants[0].id}`,
    bg: tint(PRODUCTS[0].variants[0].color),
  },
  {
    key: 'var-vanilla',
    tag: 'Dark Fantasy',
    title: 'The scent of comfort',
    text: 'Vanilla is one of the most widely loved comfort aromas, and its scent is often used in studies on relaxation.',
    img: PRODUCTS[0].variants[1].image,
    href: `/product/${PRODUCTS[0].id}?variant=${PRODUCTS[0].variants[1].id}`,
    bg: tint(PRODUCTS[0].variants[1].color),
  },
  {
    key: 'var-mango',
    tag: 'Sunfeast',
    title: 'Enzymes for summer',
    text: 'Ratnagiri Alphonso mangoes contain natural digestive enzymes and potassium, a good pick for summer hydration.',
    img: PRODUCTS[1].variants[0].image,
    href: `/product/${PRODUCTS[1].id}?variant=${PRODUCTS[1].variants[0].id}`,
    bg: tint(PRODUCTS[1].variants[0].color),
  },
  {
    key: 'var-berry',
    tag: 'Sunfeast',
    title: 'Antioxidant-dense berries',
    text: 'Mixed berries rank among the most antioxidant-dense foods, which is why they show up so often in wellness drinks.',
    img: PRODUCTS[1].variants[1].image,
    href: `/product/${PRODUCTS[1].id}?variant=${PRODUCTS[1].variants[1].id}`,
    bg: tint(PRODUCTS[1].variants[1].color),
  },
  {
    key: 'var-breakfast',
    tag: 'Sunfeast',
    title: 'Oats keep you steady',
    text: 'Oats are a rich source of beta-glucan fibre, which helps slow digestion and keep energy steadier for longer.',
    img: PRODUCTS[1].variants[2].image,
    href: `/product/${PRODUCTS[1].id}?variant=${PRODUCTS[1].variants[2].id}`,
    bg: tint(PRODUCTS[1].variants[2].color),
  },
  {
    key: 'badam-milk',
    tag: 'Aashirvaad',
    title: 'Vitamin E from real almonds',
    text: 'Almonds are one of the best natural sources of Vitamin E, an antioxidant that helps protect your cells.',
    img: PRODUCTS[2].packshot,
    href: `/product/${PRODUCTS[2].id}`,
    bg: tint(PRODUCTS[2].accentColor),
  },
  {
    key: 'aashirvaad-lassi',
    tag: 'Aashirvaad',
    title: 'Good bacteria, real curd',
    text: 'Traditional dahi lassi contains Lactobacillus cultures that support gut health and help your body absorb nutrients.',
    img: PRODUCTS[3].packshot,
    href: `/product/${PRODUCTS[3].id}`,
    bg: tint(PRODUCTS[3].accentColor),
  },
];
