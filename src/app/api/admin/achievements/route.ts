import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { achievements } from '@/db/schema';
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

    const where = includeHidden ? undefined : eq(achievements.isVisible, true);

    const [data, totalResult] = await Promise.all([
      db.query.achievements.findMany({
        where,
        orderBy: [desc(achievements.issueDate), asc(achievements.sortOrder)],
        limit,
        offset,
      }),
      db.select({ count: count() }).from(achievements).where(where),
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
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
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
    const { title, issuer, description, imageUrl, credentialUrl, credentialId, issueDate, expiryDate, sortOrder, isVisible } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.insert(achievements).values({
      title,
      issuer: issuer || null,
      description: description || null,
      imageUrl: imageUrl || null,
      credentialUrl: credentialUrl || null,
      credentialId: credentialId || null,
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      sortOrder: sortOrder || 0,
      isVisible: isVisible !== false,
    }).returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}