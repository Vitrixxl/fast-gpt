import { auth } from '@/auth';
import { db } from '@/lib/db';
import { chats, messages } from '@/schema';
import { base64Decompress } from '@/lib/utils';
import { DBSchema, SyncRequestSchema } from '@/lib/validation/chat.validation';
import { NextResponse } from 'next/server';
import { eq, inArray, sql } from 'drizzle-orm';
import { warn } from 'console';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { error, data } = SyncRequestSchema.safeParse(body);
    const session = await auth();

    if (!session || !session.user.id) {
      return NextResponse.json({
        error: true,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { user: { id } } = session;
    if (!id) {
      return NextResponse.json({
        error: true,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    if (error || !data) {
      return NextResponse.json(
        { error: true, message: 'Invalid request' },
        { status: 400 },
      );
    }

    const decompressedData = JSON.parse(base64Decompress(data.compressedData));
    {
      const { error, data } = DBSchema.safeParse(decompressedData);
      if (error || !data) {
        return NextResponse.json(
          { error: true, message: error.message },
          { status: 400 },
        );
      }

      const newChats = data.chats.map((m) => ({
        userId: id,
        ...m,
      }));

      data.chats.length > 0 &&
        await db.insert(chats).values(newChats).onConflictDoUpdate({
          target: chats.id,
          set: {
            title: sql`EXCLUDED.title`,
            updatedAt: new Date(),
          },
        });
      data.messages.length > 0 &&
        await db.insert(messages).values(data.messages).onConflictDoUpdate({
          target: chats.id,
          set: {
            content: sql`EXCLUDED.content`,
          },
        });
    }
    return NextResponse.json({
      success: true,
      message: 'You get synchronized',
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return NextResponse.json({ message: e.message }, { status: 500 });
    }
  }
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: true, message: 'Unauthorized' }, {
      status: 401,
    });
  }
  const { user: { id } } = session;
  if (!id) {
    return NextResponse.json({ error: true, message: 'Unauthorized' }, {
      status: 401,
    });
  }
  const userChats = await db.select().from(chats).where(
    eq(chats.userId, id),
  );

  const userMessages = await db.select().from(messages).where(
    inArray(messages.chatId, userChats.map((c) => c.id)),
  );

  return NextResponse.json({ chats: userChats, messages: userMessages }, {
    status: 200,
  });
}
