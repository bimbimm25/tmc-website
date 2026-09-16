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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tomeetcafe.id';

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
    default: 'To Meet Cafe & Playground | Cafe Ramah Anak di Sidoarjo',
    template: '%s | To Meet Cafe',
  },
  description:
    'To Meet Cafe & Playground adalah cafe ramah anak dan keluarga di Sidoarjo dengan konsep beruang yang unik. Nikmati menu lucu, playground, birthday package, workshop, merchandise, dan pengalaman seru di To Meet.',
  keywords: [
    'To Meet Cafe',
    'To Meet Cafe Sidoarjo',
    'To Meet Cafe & Playground',
    'Cafe Sidoarjo',
    'Cafe Ramah Anak Sidoarjo',
    'Cafe kids friendly Sidoarjo',
    'Cafe Anak Sidoarjo',
    'Cafe Keluarga Sidoarjo',
    'Family Cafe Sidoarjo',
    'Cafe dengan Playground Sidoarjo',
    'Kids Cafe Sidoarjo',
    'Playground Cafe Sidoarjo',
    'Indoor Playground Sidoarjo',
    'Tempat Makan Ramah Anak Sidoarjo',
    'Tempat Makan Keluarga Sidoarjo',
    'Tempat Main Anak Sidoarjo',
    'Tempat Ulang Tahun Anak Sidoarjo',
    'Birthday Cafe Sidoarjo',
    'To Meet Pondok Mutiara',
    'Cafe Pondok Mutiara Sidoarjo',
    'Workshop Anak Sidoarjo',
    'Aktivitas Anak Sidoarjo',
    'To Meet Roblox',
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
    title: 'To Meet Cafe & Playground | Cafe Ramah Anak di Sidoarjo',
    description:
      'To Meet Cafe & Playground adalah cafe ramah anak dan keluarga di Sidoarjo dengan konsep beruang yang unik. Nikmati menu lucu, playground, birthday package, workshop, merchandise, dan pengalaman seru di To Meet.',
    images: [
      {
        url: '/logo-tomeet.svg',
        width: 800,
        height: 800,
        alt: 'To Meet Cafe Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'To Meet Cafe & Playground | Cafe Ramah Anak di Sidoarjo',
    description:
      'Kafe keluarga ramah anak dengan playground tematik dan menu lezat di Sidoarjo.',
    images: ['/logo-tomeet.svg'],
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
    icon: [
      { url: '/logo-tomeet.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logo-tomeet.svg',
    apple: '/logo-tomeet.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Restaurant',
        '@id': `${SITE_URL}/visit-us/pondok-mutiara`,
        name: 'To Meet Cafe & Playground - Pondok Mutiara',
        image: `${SITE_URL}/logo-tomeet.svg`,
        url: SITE_URL,
        telephone: '+62 821-4160-9328',
        priceRange: '$$',
        servesCuisine: ['Indonesian', 'Western', 'Dessert', 'Coffee', 'Kids Meal'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'harum, Ruko, Jl. Pd. Mutiara No.1A blok B, Jati, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61226',
          addressLocality: 'Sidoarjo',
          addressRegion: 'Jawa Timur',
          addressCountry: 'ID',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '12:00',
            closes: '22:00',
          },
        ],
      },
      {
        '@type': 'Restaurant',
        '@id': `${SITE_URL}/visit-us/heavenland-park`,
        name: 'To Meet Cafe - Heavenland Park',
        image: `${SITE_URL}/logo-tomeet.svg`,
        url: SITE_URL,
        telephone: '+62 821-4160-9328',
        priceRange: '$$',
        servesCuisine: ['Indonesian', 'Western', 'Dessert', 'Coffee', 'Kids Meal'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ruko Heavenland Park, BB-26, Ngemplak, Klurak, Kec. Candi, Kabupaten Sidoarjo, Jawa Timur 61217',
          addressLocality: 'Sidoarjo',
          addressRegion: 'Jawa Timur',
          addressCountry: 'ID',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '12:00',
            closes: '21:00',
          },
        ],
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
        <link rel="icon" href="/logo-tomeet.svg" type="image/svg+xml" />
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