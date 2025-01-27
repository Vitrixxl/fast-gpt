import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { models } from '~/lib/ai-models';
import { getCompletion, getTitle } from '~/server/utils/chat-completion';

export const chatRouter = createTRPCRouter({
  getResponse: publicProcedure.input(
    z.object({
      chatId: z.string(),
      model: z.enum(models),
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })),
    }),
  ).mutation(
    (
      { input: { chatId, messages, model }, ctx: { session, db } },
    ) => {
      const requestTimestamp = new Date();
      const requestId = uuid();
      const responseId = uuid();
      if (session && !session.user.premium && model != 'gpt-4o-mini') {
        return {
          success: false,
          message: 'Do no try this again dumbass',
        };
      }

      let responseBuffer = '';

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            controller.enqueue(`START:${requestId}|${responseId}`);
            const completion = getCompletion(model, messages);

            let titlePromise;
            const test = messages[0];
            if (messages.length < 2 && messages[0]) {
              titlePromise = getTitle(
                messages[0].content,
              );
            }

            for await (const chunk of completion) {
              if (chunk) {
                const content = encoder.encode(chunk);
                responseBuffer += chunk;

                controller.enqueue(content);
              }
            }
            const title = await titlePromise;
            if (title) {
              controller.enqueue(`TITLE:${title}`);
            }

            await db.message.createMany({
              data: [
                //request message
                {
                  id: requestId,
                  content: messages[messages.length - 1]?.content || '',
                  chatId,
                  sender: 'user',
                  createdAt: requestTimestamp,
                },
                //response message
                {
                  id: responseId,
                  content: responseBuffer,
                  chatId,
                  sender: 'assistant',
                  ai: model.startsWith('gpt') ? 'GPT' : 'CLAUDE',
                  createdAt: new Date(),
                },
              ],
            });

            controller.close();
          } catch (error) {
            if (error instanceof Error) {
              controller.enqueue(encoder.encode(`ERROR:${error.message}`));
            }
          }
        },
      });

      return stream;
    },
  ),
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
