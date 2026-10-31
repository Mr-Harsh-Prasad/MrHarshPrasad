import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await db.query.siteSettings.findFirst();

    if (!settings) {
      // Return default settings
      return NextResponse.json({
        success: true,
        data: {
          themePrimaryColor: '#ccff00',
          themeSecondaryColor: '#00ffcc',
          themeAccentColor: '#88ff00',
          fontFamilyBase: 'Inter, system-ui, sans-serif',
          fontFamilyDisplay: 'Bebas Neue, sans-serif',
          fontFamilyMono: 'Space Mono, monospace',
          fontSizeBase: '16px',
          fontSizeScale: '1.2',
          animationPreference: 'fade-up',
          animationDuration: '0.6s',
          animationEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          reducedMotion: false,
          heroTitle: 'Harsh Prasad',
          heroSubtitle: 'Computer Science Engineering Student | Frontend Developer | Cybersecurity Enthusiast',
          heroDescription: 'Building accessible, performant web experiences with modern technologies.',
          heroImageUrl: '',
          heroCtaText: 'View Work',
          heroCtaLink: '#projects',
          heroSecondaryCtaText: 'Contact Me',
          heroSecondaryCtaLink: '#contact',
          siteTitle: 'Mr Harsh Prasad | Portfolio',
          siteDescription: 'Personal portfolio of Harsh Prasad - Computer Science student and Frontend Developer',
          siteUrl: 'https://mrharshprasad-portfolio.vercel.app',
          githubUrl: 'https://github.com/harshprasad',
          linkedinUrl: 'https://linkedin.com/in/harshprasad',
          twitterUrl: '',
          email: 'harsh@example.com',
          footerText: 'Built with Next.js, React, and Tailwind CSS',
          footerShowGithub: true,
          footerShowLinkedin: true,
          isPublished: true,
          maintenanceMode: false,
        }
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Updating settings with body:', JSON.stringify(body, null, 2));
    
    const existing = await db.query.siteSettings.findFirst();

    let result;
    if (existing) {
      [result] = await db
        .update(siteSettings)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id))
        .returning();
    } else {
      [result] = await db.insert(siteSettings).values(body).returning();
    }

    console.log('Settings updated successfully:', result);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating settings:', error);
    // Return the actual error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Failed to update settings';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}