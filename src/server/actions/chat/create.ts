'use server';

import { createChatSchema } from '~/server/actions/chat/schemas';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

export const createChatAction = async (
  chatData: typeof createChatSchema._type,
) => {
  try {
    const { data, error } = createChatSchema.safeParse(chatData);
    if (!data || error) {
      return {
        success: false,
        message: error.message,
        details: error.issues,
      };
    }
    const session = await auth();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }
    const { id, title, createdAt } = data;
    const exist = await db.chat.count({
      where: {
        id,
      },
    });
    if (exist != 0) {
      return {
        success: false,
        message: 'what are you trying to do buddy',
      };
    }

    await db.chat.create({
      data: {
        id,
        title,
        createdAt,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      message: 'new chat created',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Internal server error',
    };
  }
};
