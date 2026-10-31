import { db } from '@/db';
import { educations } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.query.educations.findMany({
      where: eq(educations.isVisible, true),
      orderBy: [desc(educations.startDate), asc(educations.sortOrder)],
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching public educations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch educations' },
      { status: 500 }
    );
  }
}