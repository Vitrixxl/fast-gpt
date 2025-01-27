import { z } from 'zod';

export const createChatSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(75),
  createdAt: z.coerce.date(),
});

export const deleteChatSchema = z.object({
  id: z.string().uuid(),
});
