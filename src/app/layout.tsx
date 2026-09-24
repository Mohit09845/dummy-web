import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  // Heading-only display font, not needed for the hero's LCP image paint.
  // Preloading it (~85KB across normal+italic) competed with the hero
  // image for early bandwidth for no LCP benefit; display:swap already
  // keeps the fallback-to-webfont swap invisible-cheap.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Sunfeast Dark Fantasy Beverages | Where Every Sip Becomes an Indulgence',
  description:
    'Indulge in the luxurious range of Dark Fantasy milkshakes, Sunfeast smoothies, Aashirvaad badam milk, and lassi — crafted with authentic Belgian cocoa, pure dairy, and real fruits.',
  keywords: [
    'Sunfeast Dark Fantasy',
    'Dark Fantasy Beverages',
    'Belgian Chocolate Milkshake',
    'Vanilla Milkshake',
    'Mango Smoothie',
    'ITC Foods',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sunfeast Dark Fantasy Beverages',
    description: 'Where Every Sip Becomes an Indulgence — Belgian Chocolate Milkshakes & Fruit Smoothies',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunfeast Dark Fantasy Beverages',
    description: 'Where Every Sip Becomes an Indulgence — Belgian Chocolate Milkshakes & Fruit Smoothies',
    images: ['/og-image.jpg'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logos/df-logo.webp`,
  brand: ['Sunfeast', 'Dark Fantasy', 'Aashirvaad'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased bg-[#090503] text-[#FAF3E0] selection:bg-[#D4AF37] selection:text-[#090503]">
        {children}
      </body>
    </html>
  );
}
