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

// SEO Metadata - Optimized for "Mr Harsh Prasad portfolio" search
export const metadata: Metadata = {
  title: 'Mr Harsh Prasad | Personal Portfolio | Computer Science Student',
  description:
    'Mr Harsh Prasad personal portfolio. Computer science engineering student skilled in C, Python, HTML, CSS, data structures, cybersecurity, and web development.',
  keywords: [
    'Mr Harsh Prasad',
    'Harsh Prasad',
    'personal portfolio',
    'computer science engineering',
    'C',
    'Python',
    'HTML',
    'CSS',
    'data structures',
    'cybersecurity',
    'web development',
    'B.Tech CS',
    'Frontend Developer',
    'JavaScript',
    'React',
    'Next.js',
  ],
  authors: [{ name: 'Mr Harsh Prasad' }],
  creator: 'Mr Harsh Prasad',
  verification: {
    google: 'HVyk8tiOa8GaEonBfZ2EDkM24cxpXOUqKP_2eeEw1Sw',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mr-harsh-prasad-portfolio.vercel.app',
    title: 'Mr Harsh Prasad | Personal Portfolio | Computer Science Student',
    description:
      'Mr Harsh Prasad personal portfolio. Computer science engineering student skilled in C, Python, HTML, CSS, data structures, cybersecurity, and web development.',
    siteName: 'Mr Harsh Prasad Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr Harsh Prasad | Personal Portfolio | Computer Science Student',
    description:
      'Mr Harsh Prasad personal portfolio. Computer science engineering student skilled in C, Python, HTML, CSS, data structures, cybersecurity, and web development.',
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
  alternates: {
    canonical: 'https://mr-harsh-prasad-portfolio.vercel.app',
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
