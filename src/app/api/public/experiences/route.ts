import { db } from '@/db';
import { experiences } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.query.experiences.findMany({
      where: eq(experiences.isVisible, true),
      orderBy: [desc(experiences.startDate), asc(experiences.sortOrder)],
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching public experiences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}