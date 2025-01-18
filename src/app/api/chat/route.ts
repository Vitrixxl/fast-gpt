import { getCompletion } from '@/app/api/chat/utils';
import { auth } from '@/auth';
import { ChatRequestSchema } from '@/lib/validation/chat.validation';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { error, data } = ChatRequestSchema.safeParse(body);

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid body' },
        { status: 400 },
      );
    }

    const { messages, model } = data;
    const session = await auth();
    if (!session && model != 'gpt-4o-mini') {
      return NextResponse.json(
        { error: 'Tu te crois intelligent petit pd' },
        { status: 401 },
      );
    }

    const encoder = new TextEncoder();
    let messageBuffer: string[] = [];
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = getCompletion(model, messages);

          for await (const chunk of completion) {
            if (chunk) {
              const content = encoder.encode(chunk);
              controller.enqueue(content);
            }
          }

          controller.enqueue('');

          controller.close();
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
