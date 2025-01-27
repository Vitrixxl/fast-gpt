'use server';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

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
    const exist = await db.chat.count({
      where: {
        id,
        userId: session.user.id,
      },
    });
    if (exist == 0) {
      return {
        success: false,
        message: "This chat doesn't exist",
      };
    }
    await db.chat.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });
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
