export interface ProductVariant {
  id: string;
  name: string;
  shortName: string;
  color: string;
  image: string;
  backImage: string;
  tagline?: string;
}

export interface NutritionItem {
  label: string;
  value: string;
  perServing?: string;
}

export interface Product {
  id: string;
  name: string;
  shortName: string;
  brand: 'Dark Fantasy' | 'Sunfeast' | 'Aashirvaad';
  category: 'Milkshake' | 'Smoothie' | 'Flavoured Milk' | 'Lassi';
  tagline: string;
  description: string;
  longDescription: string;
  volume: string;
  accentColor: string;       // card glow / accent  packshot: string;          // /assets/packshots/...
  backshotImage: string;     // back-of-pack
  ingredients: string[];
  nutrition: NutritionItem[];
  variants: ProductVariant[];
  highlights: string[];
  platforms: {
    blinkit: string;
    amazon: string;
    flipkart: string;
  };
}

export const PRODUCTS: Product[] = [
  {
    id: 'df-milkshake',
    name: 'Dark Fantasy Milkshake',
    shortName: 'Dark Fantasy Milkshake',
    brand: 'Dark Fantasy',
    category: 'Milkshake',
    tagline: 'Pure Belgian cocoa or silky vanilla. Liquid decadence, your call.',
    description: 'Rich, velvety milkshake crafted with authentic Belgian cocoa or delicate white chocolate vanilla, made with standardised dairy milk.',
    longDescription:
      'Indulge in the deep, velvety richness of Dark Fantasy Milkshake. Choose the Belgian Chocolate flavour, crafted with authentic imported Belgian cocoa solids, or the White Chocolate Vanilla flavour, pairing creamy vanilla bean essence with rich white chocolate. Both made with 85%+ standardised dairy milk, flash UHT processed, with zero chemical preservatives. Ready to savour.',
    volume: '160 ml',
    accentColor: '#C8842A',    packshot: '/assets/packshots/chocolate-milkshake/fop.webp',
    backshotImage: '/assets/packshots/chocolate-milkshake/bop1.webp',
    ingredients: [
      'Standardised Milk (85%)',
      'Sugar',
      'Imported Belgian Cocoa Solids (2.8%) or White Chocolate Pieces (1.5%)',
      'Emulsifiers (INS 471)',
      'Stabilisers (INS 407, INS 412)',
      'Natural Chocolate or Vanilla Flavours',
    ],
    nutrition: [
      { label: 'Energy', value: '142 kcal', perServing: '227 kcal' },
      { label: 'Protein', value: '3.8 g', perServing: '6.1 g' },
      { label: 'Carbohydrate', value: '20.4 g', perServing: '32.6 g' },
      { label: 'Total Sugars', value: '18.2 g', perServing: '29.1 g' },
      { label: 'Added Sugars', value: '13.5 g', perServing: '21.6 g' },
      { label: 'Total Fat', value: '5.1 g', perServing: '8.2 g' },
      { label: 'Saturated Fat', value: '3.2 g', perServing: '5.1 g' },
      { label: 'Calcium', value: '120 mg', perServing: '192 mg' },
      { label: 'Sodium', value: '65 mg', perServing: '104 mg' },
    ],
    variants: [
      {
        id: 'var-choco',
        name: 'Belgian Chocolate Milkshake',
        shortName: 'Chocolate',
        color: '#7B3F00',
        image: '/assets/packshots/chocolate-milkshake/fop.webp',
        backImage: '/assets/packshots/chocolate-milkshake/bop1.webp',
        tagline: 'Rich Belgian Cocoa Solids',
      },
      {
        id: 'var-vanilla',
        name: 'White Chocolate Vanilla Milkshake',
        shortName: 'Vanilla',
        color: '#D4B896',
        image: '/assets/packshots/vanilla-milkshake/fop.webp',
        backImage: '/assets/packshots/vanilla-milkshake/bop1.webp',
        tagline: 'Ivory Vanilla Bean Essence',
      },
    ],
    highlights: [
      'Two indulgent flavours: Belgian Chocolate & White Chocolate Vanilla',
      'No chemical preservatives',
      'Flash UHT sterilised for maximum freshness',
      '160 ml, perfectly portioned single serve',
    ],
    platforms: {
      blinkit: 'https://blinkit.com/',
      amazon: 'https://amazon.in/',
      flipkart: 'https://flipkart.com/',
    },
  },
  {
    id: 'sunfeast-smoothie',
    name: 'Sunfeast Smoothie',
    shortName: 'Sunfeast Smoothie',
    brand: 'Sunfeast',
    category: 'Smoothie',
    tagline: 'Real fruit chunks. Thick, chunky, and endlessly craveable.',
    description: 'Thick and chunky smoothie bursting with real fruit pieces and creamy milk, in Alphonso Mango, Berry & Mango, or Breakfast Oats.',
    longDescription:
      'Capture the taste of peak Indian summer, all year round. Sunfeast Smoothie packs real fruit pieces into a thick, creamy dairy blend: sun-ripened Ratnagiri Alphonso mango, a tangy berry-mango mix, or a wholesome Breakfast Smoothie with oats, dates, and chia seeds. No concentrates. No artificial colours. Just real fruit, sip after sip.',
    volume: '160 ml',
    accentColor: '#D97706',    packshot: '/assets/packshots/mango-smoothie/render.webp',
    backshotImage: '/assets/packshots/mango-smoothie/bop.webp',
    ingredients: [
      'Standardised Milk (65%)',
      'Fruit Pieces: Alphonso Mango, Mixed Berry, or Oats & Dates (25%)',
      'Sugar',
      'Fruit Pulp (10%)',
      'Acidity Regulator (INS 330)',
      'Natural Fruit Flavours',
    ],
    nutrition: [
      { label: 'Energy', value: '128 kcal', perServing: '205 kcal' },
      { label: 'Protein', value: '3.2 g', perServing: '5.1 g' },
      { label: 'Carbohydrate', value: '22.0 g', perServing: '35.2 g' },
      { label: 'Fruit Content', value: '35%', perServing: 'Real Fruit Pieces' },
      { label: 'Total Fat', value: '2.8 g', perServing: '4.5 g' },
      { label: 'Saturated Fat', value: '1.6 g', perServing: '2.6 g' },
      { label: 'Vitamin A', value: '140 mcg', perServing: '224 mcg' },
      { label: 'Calcium', value: '95 mg', perServing: '152 mg' },
    ],
    variants: [
      {
        id: 'var-mango',
        name: 'Alphonso Mango Smoothie',
        shortName: 'Alphonso Mango',
        color: '#EAB308',
        image: '/assets/packshots/mango-smoothie/render.webp',
        backImage: '/assets/packshots/mango-smoothie/bop.webp',
        tagline: '25% Ratnagiri Alphonso Pieces',
      },
      {
        id: 'var-berry',
        name: 'Berry & Mango Smoothie',
        shortName: 'Berry & Mango',
        color: '#E11D48',
        image: '/assets/packshots/berry-mango-smoothie/render.webp',
        backImage: '/assets/packshots/berry-mango-smoothie/bop.webp',
        tagline: 'Tangy Wild Berries & Alphonso',
      },
      {
        id: 'var-breakfast',
        name: 'Breakfast Smoothie',
        shortName: 'Breakfast Smoothie',
        color: '#10B981',
        image: '/assets/packshots/breakfast-smoothie/fop.webp',
        backImage: '/assets/packshots/breakfast-smoothie/bop.webp',
        tagline: 'Wholesome Oats & Chia Seeds',
      },
    ],
    highlights: [
      'Three real-fruit flavours in one range',
      'Thick chunky smoothie texture',
      'No artificial colours',
      'Breakfast variant with oats, dates & 4 super seeds',
    ],
    platforms: {
      blinkit: 'https://blinkit.com/',
      amazon: 'https://amazon.in/',
      flipkart: 'https://flipkart.com/',
    },
  },
  {
    id: 'badam-milk',
    name: 'Aashirvaad Shahi Badam Milk',
    shortName: 'Badam Milk',
    brand: 'Aashirvaad',
    category: 'Flavoured Milk',
    tagline: 'Royal nourishment. Ancient wisdom. Modern sip.',
    description: 'Creamy almond-infused milk with saffron and cardamom, a regal treat.',
    longDescription:
      'Inspired by royal Indian kitchens, Aashirvaad Shahi Badam Milk blends wholesome dairy with real California almond slivers, warming cardamom, and a hint of precious saffron. Each sip is a nourishing ritual with 5.2g of natural protein, rich calcium, and a flavour profile worthy of royalty.',
    volume: '160 ml',
    accentColor: '#B45309',    packshot: '/assets/packshots/badam-milk/fop.webp',
    backshotImage: '/assets/packshots/badam-milk/bop.webp',
    ingredients: [
      'Standardised Milk (88%)',
      'Sugar',
      'California Almond Slivers (4.2%)',
      'Saffron Extract',
      'Cardamom Extract',
      'Stabiliser (INS 407)',
    ],
    nutrition: [
      { label: 'Energy', value: '156 kcal', perServing: '250 kcal' },
      { label: 'Protein', value: '5.2 g', perServing: '8.3 g' },
      { label: 'Carbohydrate', value: '20.8 g', perServing: '33.3 g' },
      { label: 'Almonds', value: '4.2 g Slivers', perServing: 'Real California' },
      { label: 'Total Fat', value: '6.0 g', perServing: '9.6 g' },
      { label: 'Saturated Fat', value: '3.4 g', perServing: '5.4 g' },
      { label: 'Calcium', value: '165 mg', perServing: '264 mg' },
      { label: 'Sodium', value: '70 mg', perServing: '112 mg' },
    ],
    variants: [],
    highlights: [
      'Real California almond slivers',
      'Authentic saffron & cardamom infusion',
      '5.2g natural dairy protein per 100ml',
      'Rich in bone-strengthening calcium',
    ],
    platforms: {
      blinkit: 'https://blinkit.com/',
      amazon: 'https://amazon.in/',
      flipkart: 'https://flipkart.com/',
    },
  },
  {
    id: 'aashirvaad-lassi',
    name: 'Aashirvaad Svasti Lassi',
    shortName: 'Svasti Lassi',
    brand: 'Aashirvaad',
    category: 'Lassi',
    tagline: 'Homestyle culture. Probiotic goodness. Pure joy.',
    description: 'Traditional Indian lassi crafted from fresh full-fat yoghurt with live probiotic cultures.',
    longDescription:
      'Aashirvaad Svasti Lassi brings the soul of homestyle Indian lassi into a beautifully packaged, fresh experience. Crafted from full-fat curd with live probiotic cultures, it delivers authentic tang, rich creaminess, and natural gut-health benefits. Available in classic plain and a hint of rose.',
    volume: '200 ml',
    accentColor: '#7C3AED',    packshot: '/assets/packshots/lassi/fop.webp',
    backshotImage: '/assets/packshots/lassi/bop.webp',
    ingredients: [
      'Full-fat Curd (95%)',
      'Sugar',
      'Live Probiotic Cultures (L. acidophilus)',
      'Natural Rose Flavour (rose variant)',
    ],
    nutrition: [
      { label: 'Energy', value: '148 kcal', perServing: '296 kcal' },
      { label: 'Protein', value: '4.2 g', perServing: '8.4 g' },
      { label: 'Carbohydrate', value: '19.5 g', perServing: '39.0 g' },
      { label: 'Probiotics', value: '>10^7 CFU/ml', perServing: 'Live Active' },
      { label: 'Total Fat', value: '5.8 g', perServing: '11.6 g' },
      { label: 'Saturated Fat', value: '3.8 g', perServing: '7.6 g' },
      { label: 'Calcium', value: '150 mg', perServing: '300 mg' },
      { label: 'Phosphorus', value: '110 mg', perServing: '220 mg' },
    ],
    variants: [],
    highlights: [
      'Live active probiotic cultures',
      'Full-fat fresh yoghurt curd base',
      'No artificial colours or preservatives',
      'Supports natural digestive gut health',
    ],
    platforms: {
      blinkit: 'https://blinkit.com/',
      amazon: 'https://amazon.in/',
      flipkart: 'https://flipkart.com/',
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
