import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { projects } from '@/db/schema';
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
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
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
    const { title, slug, description, shortDescription, imageUrl, thumbnailUrl, techStack, liveLink, githubLink, demoVideoUrl, sortOrder, isVisible, isFeatured, startDate, endDate } = body;

    // Check if project exists
    const existing = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existing.slug) {
      const slugExists = await db.query.projects.findFirst({
        where: eq(projects.slug, slug),
      });
      if (slugExists) {
        return NextResponse.json({ success: false, error: 'A project with this slug already exists' }, { status: 400 });
      }
    }

    const [result] = await db
      .update(projects)
      .set({
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        description: description ?? existing.description,
        shortDescription: shortDescription ?? existing.shortDescription,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
        techStack: techStack ?? existing.techStack,
        liveLink: liveLink !== undefined ? liveLink : existing.liveLink,
        githubLink: githubLink !== undefined ? githubLink : existing.githubLink,
        demoVideoUrl: demoVideoUrl !== undefined ? demoVideoUrl : existing.demoVideoUrl,
        sortOrder: sortOrder ?? existing.sortOrder,
        isVisible: isVisible ?? existing.isVisible,
        isFeatured: isFeatured ?? existing.isFeatured,
        startDate: startDate ? new Date(startDate) : (startDate === null ? null : existing.startDate),
        endDate: endDate ? new Date(endDate) : (endDate === null ? null : existing.endDate),
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
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
    await db.delete(projects).where(eq(projects.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}