import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { projects } from '@/db/schema';
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

    const where = includeHidden ? undefined : eq(projects.isVisible, true);
    
    const [data, totalResult] = await Promise.all([
      db.query.projects.findMany({
        where,
        orderBy: [asc(projects.sortOrder), desc(projects.createdAt)],
        limit,
        offset,
      }),
      db.select({ count: count() }).from(projects).where(where),
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
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
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
    const { title, slug, description, shortDescription, imageUrl, thumbnailUrl, techStack, liveLink, githubLink, demoVideoUrl, sortOrder, isVisible, isFeatured, startDate, endDate } = body;

    if (!title || !slug || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await db.query.projects.findFirst({
      where: eq(projects.slug, slug),
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'A project with this slug already exists' }, { status: 400 });
    }

    const [result] = await db.insert(projects).values({
      title,
      slug,
      description,
      shortDescription,
      imageUrl: imageUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      techStack: techStack || [],
      liveLink: liveLink || null,
      githubLink: githubLink || null,
      demoVideoUrl: demoVideoUrl || null,
      sortOrder: sortOrder || 0,
      isVisible: isVisible !== false,
      isFeatured: isFeatured || false,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    }).returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}