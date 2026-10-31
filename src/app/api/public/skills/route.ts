import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.query.skills.findMany({
      where: eq(skills.isVisible, true),
      orderBy: [asc(skills.sortOrder), asc(skills.category)],
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching public skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}