import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'To Meet Cafe & Playground - About Us',
  description: 'Welcome to To Meet Universe!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="light bg-[#faf6f0]" style={{ colorScheme: 'light' }}>
      <body className="bg-[#faf6f0] text-[#3d2314] antialiased selection:bg-[#8c5a3c] selection:text-white min-h-screen flex flex-col">
        <SmoothScroll>
          <Navbar />
          <main className="bg-[#faf6f0] flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}