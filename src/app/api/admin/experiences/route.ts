import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { experiences } from '@/db/schema';
import { eq, desc, asc, count } from 'drizzle-orm';
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

    const offset = (page - 1) * limit;
    const where = includeHidden ? undefined : eq(experiences.isVisible, true);

    const [data, totalResult] = await Promise.all([
      db.query.experiences.findMany({
        where,
        orderBy: [desc(experiences.startDate), asc(experiences.sortOrder)],
        limit,
        offset,
      }),
      db.select({ count: count() }).from(experiences).where(where),
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
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experiences' },
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
    const { company, role, location, description, achievements, techStack, startDate, endDate, isCurrent, sortOrder, isVisible, companyLogoUrl, companyUrl } = body;

    if (!company || !role || !startDate) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.insert(experiences).values({
      company,
      role,
      location: location || null,
      description: description || null,
      achievements: achievements || [],
      techStack: techStack || [],
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      isCurrent: isCurrent || false,
      sortOrder: sortOrder || 0,
      isVisible: isVisible !== false,
      companyLogoUrl: companyLogoUrl || null,
      companyUrl: companyUrl || null,
    }).returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}