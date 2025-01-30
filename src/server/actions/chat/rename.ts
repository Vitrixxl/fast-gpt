'use server';
import { eq } from 'drizzle-orm';
import { renameChatSchema } from '~/server/actions/chat/schemas';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import { chats } from '~/server/db/schema';

export const renameChatAction = async (
  renameChatData: typeof renameChatSchema._type,
) => {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  const { data, error } = renameChatSchema.safeParse(renameChatData);

  if (error || !data) {
    return {
      success: false,
      message: error.message,
      details: error.errors,
    };
  }

  await db.delete(chats).where(eq(chats.id, data.id));

  return {
    success: true,
    message: 'Chat renamed',
  };
};
