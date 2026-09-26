import type { Metadata, Viewport } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';

// Jost is a variable font, so one file covers every weight. Upright is
// preloaded (used everywhere); italic is only for accent words, so it is
// not preloaded and stays off the critical path.
const jost = Jost({
  subsets: ['latin'],
  style: 'normal',
  variable: '--font-jost',
  display: 'swap',
});
const jostItalic = Jost({
  subsets: ['latin'],
  style: 'italic',
  variable: '--font-jost-italic',
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#24120B',
};

const DEFAULT_DESCRIPTION =
  'Dark Fantasy Belgian chocolate milkshakes, Sunfeast real-fruit smoothies, and Aashirvaad badam milk and lassi, with no chemical preservatives.';

// Pages set `title` (short) and their own `alternates.canonical`; nothing
// page-specific belongs here because every route inherits it.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Where Every Sip Becomes an Indulgence`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/assets/kvs/og-image.jpg', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/kvs/og-image.jpg'],
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${jost.variable} ${jostItalic.variable}`}>
      <body className="min-h-screen antialiased bg-[#090503] text-[#FAF3E0] selection:bg-[#D4AF37] selection:text-[#090503]">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
