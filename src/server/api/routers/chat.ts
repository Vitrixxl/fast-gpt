import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const chatRouter = createTRPCRouter({
  getResponse: publicProcedure.input(
    z.object({
      chatId: z.string(),
      model: z.enum(['gpt-4o-mini', 'claude-3.5-sonnet']),
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })),
    }),
  ).query(({ input: { chatId, messages, model }, ctx: { session, db } }) => {
    return 'heelo';
  }),
  create: protectedProcedure.input(z.object({
    id: z.string().uuid(),
    title: z.string().max(75),
    createdAt: z.coerce.date(),
  })).query(
    async (
      { input: { id, title, createdAt }, ctx: { session: { user }, db } },
    ) => {
      try {
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
            userId: user.id,
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
    },
  ),
});
