import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { educations } from '@/db/schema';
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
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    const where = includeHidden ? undefined : eq(educations.isVisible, true);

    const [data, totalResult] = await Promise.all([
      db.query.educations.findMany({
        where,
        orderBy: [desc(educations.startDate), asc(educations.sortOrder)],
        limit,
        offset,
      }),
      db.select({ count: count() }).from(educations).where(where),
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
    console.error('Error fetching educations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch educations' },
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
    const { institution, degree, fieldOfStudy, location, description, achievements, startDate, endDate, isCurrent, sortOrder, isVisible, institutionLogoUrl, institutionUrl, grade } = body;

    if (!institution || !degree || !startDate) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.insert(educations).values({
      institution,
      degree,
      fieldOfStudy: fieldOfStudy || null,
      location: location || null,
      description: description || null,
      achievements: achievements || [],
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      isCurrent: isCurrent || false,
      sortOrder: sortOrder || 0,
      isVisible: isVisible !== false,
      institutionLogoUrl: institutionLogoUrl || null,
      institutionUrl: institutionUrl || null,
      grade: grade || null,
    }).returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create education' },
      { status: 500 }
    );
  }
}