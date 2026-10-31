import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { experiences } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const experience = await db.query.experiences.findFirst({
      where: eq(experiences.id, id),
    });

    if (!experience) {
      return NextResponse.json({ success: false, error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: experience });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { company, role, location, description, achievements, techStack, startDate, endDate, isCurrent, sortOrder, isVisible, companyLogoUrl, companyUrl } = body;

    const existing = await db.query.experiences.findFirst({
      where: eq(experiences.id, id),
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Experience not found' }, { status: 404 });
    }

    const [result] = await db
      .update(experiences)
      .set({
        company: company ?? existing.company,
        role: role ?? existing.role,
        location: location !== undefined ? location : existing.location,
        description: description !== undefined ? description : existing.description,
        achievements: achievements ?? existing.achievements,
        techStack: techStack ?? existing.techStack,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : (endDate === null ? null : existing.endDate),
        isCurrent: isCurrent ?? existing.isCurrent,
        sortOrder: sortOrder ?? existing.sortOrder,
        isVisible: isVisible ?? existing.isVisible,
        companyLogoUrl: companyLogoUrl !== undefined ? companyLogoUrl : existing.companyLogoUrl,
        companyUrl: companyUrl !== undefined ? companyUrl : existing.companyUrl,
        updatedAt: new Date(),
      })
      .where(eq(experiences.id, id))
      .returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await db.delete(experiences).where(eq(experiences.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}