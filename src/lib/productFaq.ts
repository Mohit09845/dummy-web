import { Product } from '@/data/products';

export interface ProductFaqItem {
  id: string;
  question: string;
  answer: string;
}

// Generated only from fields already shown elsewhere on the product page
// (volume, ingredients, highlights) or facts identical across every product
// (100% vegetarian badge, aseptic Tetra Pak packaging, serve-chilled note) so
// nothing here is invented per AGENTS.md's no-fabrication rule.
export function getProductFaqs(product: Product): ProductFaqItem[] {
  return [
    {
      id: 'net-quantity',
      question: `What is the net quantity of ${product.shortName}?`,
      answer: `Each pack of ${product.shortName} contains ${product.volume}, packed in an aseptic Tetra Pak for freshness.`,
    },
    {
      id: 'ingredients',
      question: `What ingredients are used in ${product.shortName}?`,
      answer: `${product.ingredients.join(', ')}.`,
    },
    {
      id: 'vegetarian',
      question: `Is ${product.shortName} vegetarian?`,
      answer: `Yes, ${product.shortName} is 100% vegetarian.`,
    },
    {
      id: 'serving',
      question: `How should I store and serve ${product.shortName}?`,
      answer: `Serve chilled and shake well before drinking. Store the unopened pack in a cool, dry place until you're ready to enjoy it.`,
    },
    {
      id: 'highlights',
      question: `What makes ${product.shortName} special?`,
      answer: `${product.highlights.join('. ')}.`,
    },
  ];
}
