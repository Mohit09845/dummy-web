import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sunfeast Dark Fantasy Beverages | Where Every Sip Becomes an Indulgence',
  description:
    'Indulge in the luxurious range of Sunfeast Dark Fantasy milkshakes, smoothies, badam milk, and lassi — crafted with authentic Belgian cocoa, pure dairy, and real fruits.',
  keywords: [
    'Sunfeast Dark Fantasy',
    'Dark Fantasy Beverages',
    'Belgian Chocolate Milkshake',
    'Vanilla Milkshake',
    'Mango Smoothie',
    'ITC Foods',
  ],
  icons: {
    icon: [
      { url: '/assets/logos/df-logo.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/assets/logos/df-logo.png',
    apple: '/assets/logos/df-logo.png',
  },
  openGraph: {
    title: 'Sunfeast Dark Fantasy Beverages',
    description: 'Where Every Sip Becomes an Indulgence — Belgian Chocolate Milkshakes & Fruit Smoothies',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/assets/logos/df-logo.png" />
        <link rel="apple-touch-icon" href="/assets/logos/df-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased bg-[#090503] text-[#FAF3E0] selection:bg-[#D4AF37] selection:text-[#090503]">
        {children}
      </body>
    </html>
  );
}
