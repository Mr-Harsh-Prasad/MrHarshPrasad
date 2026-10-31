import { db } from '@/db';
import { achievements } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.query.achievements.findMany({
      where: eq(achievements.isVisible, true),
      orderBy: [desc(achievements.issueDate), asc(achievements.sortOrder)],
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching public achievements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}