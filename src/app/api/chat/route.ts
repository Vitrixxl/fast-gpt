import { v4 as uuid } from 'uuid';
import { NextResponse } from 'next/server';
import { auth } from '~/server/auth';
import { getCompletion, getTitle } from '~/server/utils/chat-completion';
import { db } from '~/server/db';
import { ChatRequestSchema } from '~/app/api/chat/schema';

export async function POST(request: Request) {
  try {
    const requestTimestamp = new Date();
    const requestId = uuid();
    const responseId = uuid();
    const body = await request.json();
    console.log(body);
    console.log(typeof body);
    const { error, data } = ChatRequestSchema.safeParse(body);

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid body', ...error },
        { status: 400 },
      );
    }

    const { messages, model, chatId } = data;
    const session = await auth();
    if (!session && model != 'gpt-4o-mini') {
      return NextResponse.json(
        { error: 'Do not try this again dumbass' },
        { status: 401 },
      );
    }

    const encoder = new TextEncoder();
    /**
     * used to insert into the db the response once it's fully generated
     */
    let responseBuffer = '';

    const sessionPromise = auth();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(`START:${requestId}|${responseId}|`);

          const completion = getCompletion(model, messages);

          let titlePromise;
          if (messages.length < 2) {
            titlePromise = getTitle(
              messages[messages.length - 1]?.content || '',
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

          const session = await sessionPromise;
          if (!session) controller.close();
          else {
            const exist = await db.chat.count({
              where: {
                id: chatId,
              },
            });
            if (exist == 0) {
              await db.chat.create({
                data: {
                  id: chatId,
                  title: title || 'New chat',
                  userId: session.user.id,
                },
              });
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
          }
        } catch (error) {
          if (error instanceof Error) {
            controller.enqueue(encoder.encode(`ERROR:${error.message}`));
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Erreur streaming:', error);
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 },
    );
  }
}
