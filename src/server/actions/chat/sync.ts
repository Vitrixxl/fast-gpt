'use server';
import { Chat, Message, Prisma } from '@prisma/client';
import { ChatSchema, MessageSchema } from 'prisma/generated/zod';
import { z } from 'zod';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

export const syncChatAction = async (
  chatData: { chats: Omit<Chat, 'userId'>[]; messages: Message[] },
) => {
  const session = await auth();
  if (!session) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }
  const chatsParsed = z.array(ChatSchema.omit({
    userId: true,
  })).safeParse(chatData.chats);
  const messagesParsed = z.array(MessageSchema).safeParse(chatData.messages);

  if (!chatsParsed.success || !chatsParsed.data) {
    return {
      success: false,
      message: chatsParsed.error.message,
    };
  }
  if (!messagesParsed.success || !messagesParsed.data) {
    return {
      success: false,
      message: messagesParsed.error.message,
    };
  }
  const chatsWithUserId = chatsParsed.data.map((c) => ({
    ...c,
    userId: session.user.id,
  }));

  try {
    const result = await db.$transaction(async (tx) => {
      if (chatsParsed.data.length > 0) {
        const values = chatsWithUserId.map((_, index) =>
          `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
            index * 5 + 4
          }, $${index * 5 + 5})`
        ).join(',');
        const params = chatsWithUserId.flatMap((c) => [
          c.id,
          c.title,
          c.userId,
          c.createdAt,
          c.updatedAt,
        ]);
        const query = `
  INSERT INTO chats (id, title, "userId", created_at, updated_at)
  VALUES ${values}
  ON CONFLICT (id)
  DO UPDATE SET title = EXCLUDED.title, updated_at = EXCLUDED.updated_at;
`;
        // Ajout des paramètres ici
        await tx.$executeRawUnsafe(query, ...params);
        await tx.message.createMany({
          data: messagesParsed.data,
          skipDuplicates: true,
        });
      }
      const syncChats = await tx.chat.findMany({
        where: {
          userId: session.user.id,
        },
      });
      const chatIds = syncChats.map((m) => m.id);
      const syncMessages = await tx.message.findMany({
        where: {
          chatId: {
            in: chatIds,
          },
        },
      });
      return { syncChats, syncMessages };
    });
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message,
    };
  }
};
