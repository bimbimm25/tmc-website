import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tomeetcafe.com';

export const viewport: Viewport = {
  themeColor: '#E4CFB8',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'To Meet Cafe & Playground Sidoarjo | Cafe Ramah Anak & Keluarga',
    template: '%s | To Meet Cafe',
  },
  description:
    'To Meet Cafe & Playground adalah kafe ramah keluarga bertema beruang di Sidoarjo. Nikmati menu lezat, indoor playground, paket ulang tahun, event workshop seru, dan integrasi game Roblox.',
  keywords: [
    'To Meet Cafe',
    'To Meet Cafe Sidoarjo',
    'Cafe Ramah Anak Sidoarjo',
    'Kids Playground Cafe Sidoarjo',
    'Tempat Ulang Tahun Anak Sidoarjo',
    'Cafe Heavenland Park Sidoarjo',
    'To Meet Pondok Mutiara',
    'Cafe Keluarga Jawa Timur',
    'To Meet Roblox Cafe',
  ],
  authors: [{ name: 'To Meet Cafe Team' }],
  creator: 'To Meet Cafe',
  publisher: 'To Meet Cafe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: 'To Meet Cafe',
    title: 'To Meet Cafe & Playground Sidoarjo | Sweet Stories & Family Fun',
    description:
      'Kafe keluarga ramah anak dengan playground tematik, menu lezat, area privat event, dan petualangan seru di Sidoarjo.',
    images: [
      {
        url: '/img/logo-tomeet.png',
        width: 800,
        height: 800,
        alt: 'To Meet Cafe Official Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'To Meet Cafe & Playground Sidoarjo',
    description:
      'Kafe keluarga ramah anak dengan playground tematik dan menu lezat di Sidoarjo.',
    images: ['/img/logo-tomeet.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/img/logo-tomeet.png',
    shortcut: '/img/logo-tomeet.png',
    apple: '/img/logo-tomeet.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'To Meet Cafe & Playground',
    image: `${SITE_URL}/img/logo-tomeet.png`,
    logo: `${SITE_URL}/img/logo-tomeet.png`,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: '+628123456789',
    priceRange: '$$',
    servesCuisine: ['Indonesian', 'Western', 'Dessert', 'Coffee', 'Kids Meal'],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Heavenland Park, Jl. Raya Pralajur',
        addressLocality: 'Sidoarjo',
        addressRegion: 'Jawa Timur',
        addressCountry: 'ID',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Pondok Mutiara No. 1',
        addressLocality: 'Sidoarjo',
        addressRegion: 'Jawa Timur',
        addressCountry: 'ID',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        opens: '10:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '09:00',
        closes: '22:00',
      },
    ],
  };

  return (
    <html
      lang="id"
      className={`light bg-[#fffaf1] ${jakartaSans.variable}`}
      style={{ colorScheme: 'light' }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#fffaf1] text-[#3d2314] font-sans antialiased selection:bg-[#8c5a3c] selection:text-white min-h-screen flex flex-col">
        <SmoothScroll>
          <Navbar />
          <main className="bg-[#fffaf1] flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}