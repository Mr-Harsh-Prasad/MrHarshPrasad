import { auth } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
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
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    const [data, totalResult, unreadResult] = await Promise.all([
      db.query.contactMessages.findMany({
        orderBy: [desc(contactMessages.createdAt)],
        limit,
        offset,
      }),
      db.select({ count: count() }).from(contactMessages),
      db.select({ count: count() }).from(contactMessages).where(eq(contactMessages.isRead, false)),
    ]);

    return NextResponse.json({
      success: true,
      data,
      total: totalResult[0]?.count || 0,
      unread: unreadResult[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}