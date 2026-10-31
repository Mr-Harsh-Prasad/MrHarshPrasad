import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.query.projects.findMany({
      where: eq(projects.isVisible, true),
      orderBy: [asc(projects.sortOrder), asc(projects.createdAt)],
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}