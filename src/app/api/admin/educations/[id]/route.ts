import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { educations } from '@/db/schema';
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
    const education = await db.query.educations.findFirst({
      where: eq(educations.id, id),
    });

    if (!education) {
      return NextResponse.json({ success: false, error: 'Education not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: education });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education' },
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
    const { institution, degree, fieldOfStudy, location, description, achievements, startDate, endDate, isCurrent, sortOrder, isVisible, institutionLogoUrl, institutionUrl, grade } = body;

    const existing = await db.query.educations.findFirst({
      where: eq(educations.id, id),
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Education not found' }, { status: 404 });
    }

    const [result] = await db
      .update(educations)
      .set({
        institution: institution ?? existing.institution,
        degree: degree ?? existing.degree,
        fieldOfStudy: fieldOfStudy !== undefined ? fieldOfStudy : existing.fieldOfStudy,
        location: location !== undefined ? location : existing.location,
        description: description !== undefined ? description : existing.description,
        achievements: achievements ?? existing.achievements,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : (endDate === null ? null : existing.endDate),
        isCurrent: isCurrent ?? existing.isCurrent,
        sortOrder: sortOrder ?? existing.sortOrder,
        isVisible: isVisible ?? existing.isVisible,
        institutionLogoUrl: institutionLogoUrl !== undefined ? institutionLogoUrl : existing.institutionLogoUrl,
        institutionUrl: institutionUrl !== undefined ? institutionUrl : existing.institutionUrl,
        grade: grade !== undefined ? grade : existing.grade,
        updatedAt: new Date(),
      })
      .where(eq(educations.id, id))
      .returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update education' },
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
    await db.delete(educations).where(eq(educations.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete education' },
      { status: 500 }
    );
  }
}