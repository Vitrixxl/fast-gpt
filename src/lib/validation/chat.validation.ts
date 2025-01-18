import { models } from '@/lib/models';
import { z } from 'zod';
import { chatSchema, messagesSchema } from '@/schema';

export const DBSchema = z.object({
  chats: z.array(chatSchema.omit({ userId: true })).min(0),
  messages: z.array(messagesSchema).min(0),
});

export const ChatRequestSchema = z.object({
  chatId: z.string(),
  model: z.enum(models),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});

export const SyncRequestSchema = z.object({
  compressedData: z.string(),
});

export const SyncResponseSchema = z.object({
  error: z.boolean(),
  message: z.string(),
});
