'use server';
import { and, eq } from 'drizzle-orm';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import { chats } from '~/server/db/schema';

export const deleteChatAction = async (
  id: string,
) => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }
    if (!id) {
      return {
        success: false,
        message: 'Please provide an id',
      };
    }

    const exist = await db.select().from(chats).limit(1).then((data) =>
      data.length > 0
    );

    if (!exist) {
      return {
        success: false,
        message: "This chat doesn't exist",
      };
    }
    await db.delete(chats).where(
      and(eq(chats.id, id), eq(chats.userId, session.user.id)),
    );
    return {
      success: true,
      message: 'Chat deleted',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Internal server error',
    };
  }
};
