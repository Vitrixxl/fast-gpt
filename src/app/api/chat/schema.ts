import { z } from 'zod';
import { models } from '~/lib/ai-models';

export const ChatRequestSchema = z.object({
  chatId: z.string(),
  model: z.enum(models),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});
