import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { achievements } from '@/db/schema';
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
    const achievement = await db.query.achievements.findFirst({
      where: eq(achievements.id, id),
    });

    if (!achievement) {
      return NextResponse.json({ success: false, error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: achievement });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievement' },
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
    const { title, issuer, description, imageUrl, credentialUrl, credentialId, issueDate, expiryDate, sortOrder, isVisible } = body;

    const existing = await db.query.achievements.findFirst({
      where: eq(achievements.id, id),
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Achievement not found' }, { status: 404 });
    }

    const [result] = await db
      .update(achievements)
      .set({
        title: title ?? existing.title,
        issuer: issuer !== undefined ? issuer : existing.issuer,
        description: description !== undefined ? description : existing.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        credentialUrl: credentialUrl !== undefined ? credentialUrl : existing.credentialUrl,
        credentialId: credentialId !== undefined ? credentialId : existing.credentialId,
        issueDate: issueDate ? new Date(issueDate) : (issueDate === null ? null : existing.issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : (expiryDate === null ? null : existing.expiryDate),
        sortOrder: sortOrder ?? existing.sortOrder,
        isVisible: isVisible ?? existing.isVisible,
        updatedAt: new Date(),
      })
      .where(eq(achievements.id, id))
      .returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update achievement' },
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
    await db.delete(achievements).where(eq(achievements.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete achievement' },
      { status: 500 }
    );
  }
}