import { PRODUCTS, Product, ProductVariant } from '@/data/products';

export type FlavourCategory = 'shakes' | 'smoothies' | 'dairy';

export interface Flavour {
  key: string;
  category: FlavourCategory;
  product: Product;
  variant: ProductVariant | null;
}

// Flattened one-flavour-per-card, grouped the way the range is merchandised
// (Dark Fantasy shakes / Sunfeast smoothies / Aashirvaad dairy) rather than
// one card per product family. Shared by the products listing grid and the
// product detail page's "You may also like" rail.
export const FLAVOURS: Flavour[] = [
  ...PRODUCTS[0].variants.map((variant): Flavour => ({ key: variant.id, category: 'shakes', product: PRODUCTS[0], variant })),
  ...PRODUCTS[1].variants.map((variant): Flavour => ({ key: variant.id, category: 'smoothies', product: PRODUCTS[1], variant })),
  { key: PRODUCTS[2].id, category: 'dairy', product: PRODUCTS[2], variant: null },
  { key: PRODUCTS[3].id, category: 'dairy', product: PRODUCTS[3], variant: null },
];
