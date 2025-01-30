import { chats, messages } from '~/server/db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const ChatSchema = createSelectSchema(chats);
export const CreateChatSchema = createInsertSchema(chats);
export const MessageSchema = createSelectSchema(messages);
export const CreateMessageSchema = createInsertSchema(messages);
