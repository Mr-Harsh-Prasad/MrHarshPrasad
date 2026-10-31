import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { skills } from '@/db/schema';
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
    const skill = await db.query.skills.findFirst({
      where: eq(skills.id, id),
    });

    if (!skill) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skill' },
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
    const { category, skillList, icon, color, sortOrder, isVisible } = body;

    const existing = await db.query.skills.findFirst({
      where: eq(skills.id, id),
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }

    const [result] = await db
      .update(skills)
      .set({
        category: category ?? existing.category,
        skillList: skillList ?? existing.skillList,
        icon: icon !== undefined ? icon : existing.icon,
        color: color !== undefined ? color : existing.color,
        sortOrder: sortOrder ?? existing.sortOrder,
        isVisible: isVisible ?? existing.isVisible,
        updatedAt: new Date(),
      })
      .where(eq(skills.id, id))
      .returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update skill' },
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
    await db.delete(skills).where(eq(skills.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}