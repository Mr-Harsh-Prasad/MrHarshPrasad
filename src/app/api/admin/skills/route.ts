import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq, asc, count } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeHidden = searchParams.get('includeHidden') === 'true';
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    const where = includeHidden ? undefined : eq(skills.isVisible, true);

    const [data, totalResult] = await Promise.all([
      db.query.skills.findMany({
        where,
        orderBy: [asc(skills.sortOrder), asc(skills.category)],
        limit,
        offset,
      }),
      db.select({ count: count() }).from(skills).where(where),
    ]);

    return NextResponse.json({
      success: true,
      data,
      total: totalResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, skillList, icon, color, sortOrder, isVisible } = body;

    if (!category || !skillList || !Array.isArray(skillList)) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.insert(skills).values({
      category,
      skillList,
      icon: icon || null,
      color: color || null,
      sortOrder: sortOrder || 0,
      isVisible: isVisible !== false,
    }).returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}