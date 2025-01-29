import { z } from 'zod';

export const deleteChatSchema = z.object({
  id: z.string().uuid(),
});

export const renameChatSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(75).min(3),
});
