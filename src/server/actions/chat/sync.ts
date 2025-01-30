'use server';
import { eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import { chats, messages } from '~/server/db/schema';
import { Chat, Message } from '~/server/db/types';
import { ChatSchema, MessageSchema } from '~/server/db/zod';

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
    const result = await db.transaction(async (tx) => {
      if (chatsParsed.data.length > 0) {
        tx.insert(chats).values(chatsWithUserId).onConflictDoUpdate({
          target: chats.id,
          set: {
            title: sql`EXCLUDED title`,
            updatedAt: sql`EXCLUDED title`,
          },
        });
      }
      if (chatData.messages.length > 0) {
        await tx.insert(messages).values(chatData.messages)
          .onConflictDoNothing();
      }

      const syncChats = await tx.select().from(chats).where(
        eq(chats.userId, session.user.id),
      );
      const chatIds = syncChats.map((m) => m.id);
      const syncMessages = await tx.select().from(messages).where(
        inArray(messages.chatId, chatIds),
      );
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
