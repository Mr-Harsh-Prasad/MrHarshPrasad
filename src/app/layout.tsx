import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import Navbar from '@/components/ui/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';

// Body font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Monospace font
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-space-mono',
});

async function getSiteSettings() {
  // During static generation, database might not be available
  if (!process.env.DATABASE_URL) {
    return null;
  }
  
  try {
    const settings = await db.query.siteSettings.findFirst();
    return settings;
  } catch {
    return null;
  }
}

function buildMetadata(settings: Awaited<ReturnType<typeof getSiteSettings>>): Metadata {
  const title = settings?.siteTitle || 'Mr Harsh Prasad | Personal Portfolio | Computer Science Student';
  const description = settings?.siteDescription || 'Mr Harsh Prasad personal portfolio. Computer science engineering student skilled in C, Python, HTML, CSS, data structures, cybersecurity, and web development.';
  const siteUrl = settings?.siteUrl || 'https://mrharshprasad-portfolio.vercel.app';

  return {
    title,
    description,
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
      url: siteUrl,
      title,
      description,
      siteName: 'Mr Harsh Prasad Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
      canonical: siteUrl,
    },
  };
}

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata(settings);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  // Build inline styles for dynamic theming
  const style: React.CSSProperties & Record<string, string> = {
    '--accent-primary': settings?.themePrimaryColor || '#ccff00',
    '--accent-secondary': settings?.themeSecondaryColor || '#00ffcc',
    '--accent-tertiary': settings?.themeAccentColor || '#88ff00',
    '--font-body': settings?.fontFamilyBase || 'Inter, system-ui, sans-serif',
    '--font-display': settings?.fontFamilyDisplay || 'Bebas Neue, sans-serif',
    '--font-mono': settings?.fontFamilyMono || 'Space Mono, monospace',
    '--base-font-size': settings?.fontSizeBase || '16px',
    '--font-scale': settings?.fontSizeScale || '1.2',
    '--animation-duration': settings?.animationDuration || '0.6s',
    '--ease-expo': settings?.animationEasing || 'cubic-bezier(0.16, 1, 0.3, 1)',
  };

  // Calculate glow colors from primary
  if (settings?.themePrimaryColor) {
    const r = parseInt(settings.themePrimaryColor.slice(1, 3), 16);
    const g = parseInt(settings.themePrimaryColor.slice(3, 5), 16);
    const b = parseInt(settings.themePrimaryColor.slice(5, 7), 16);
    style['--accent-glow'] = `rgba(${r}, ${g}, ${b}, 0.4)`;
    style['--border-glow'] = `rgba(${r}, ${g}, ${b}, 0.3)`;
    style['--shadow-glow'] = `0 0 50px rgba(${r}, ${g}, ${b}, 0.4)`;
    style['--shadow-lime'] = `0 0 30px rgba(${r}, ${g}, ${b}, 0.25)`;
  }

  // Apply reduced motion
  if (settings?.reducedMotion) {
    style['--animation-duration'] = '0.01ms';
  }

  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="antialiased" style={style}>
        <ThemeProvider>
          {/* Custom cursor (hidden on touch devices) */}
          <CustomCursor />

          {/* Navigation */}
          <Navbar />

          {/* Smooth scroll wrapper */}
          <SmoothScroll>
            {/* Noise texture overlay for premium feel */}
            <div className="noise-overlay" />

            {/* Main content */}
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}