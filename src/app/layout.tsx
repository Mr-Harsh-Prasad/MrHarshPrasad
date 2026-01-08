import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';

// Load Inter font with variable weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// SEO Metadata
export const metadata: Metadata = {
  title: 'Harsh Kumar | Developer Portfolio',
  description:
    'B.Tech CSE Student | Cybersecurity Enthusiast | Web Developer - Turning ideas into secure, beautiful digital experiences.',
  keywords: [
    'Harsh Kumar',
    'Portfolio',
    'Web Developer',
    'Cybersecurity',
    'B.Tech CSE',
    'Frontend Developer',
    'JavaScript',
    'React',
    'Next.js',
  ],
  authors: [{ name: 'Harsh Kumar' }],
  creator: 'Harsh Kumar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Harsh Kumar | Developer Portfolio',
    description:
      'B.Tech CSE Student | Cybersecurity Enthusiast | Web Developer',
    siteName: 'Harsh Kumar Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harsh Kumar | Developer Portfolio',
    description:
      'B.Tech CSE Student | Cybersecurity Enthusiast | Web Developer',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {/* Custom cursor (hidden on touch devices) */}
        <CustomCursor />

        {/* Smooth scroll wrapper */}
        <SmoothScroll>
          {/* Noise texture overlay for premium feel */}
          <div className="noise-overlay" />

          {/* Main content */}
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
