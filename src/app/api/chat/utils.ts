import Anthropic from '@anthropic-ai/sdk';
import { claudeSet, gptSet, models } from '@/lib/models';

import { ChatRequestSchema } from '@/lib/validation/chat.validation';
import OpenAI from 'openai';
import { env } from '@/lib/env';

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  defaultHeaders: {
    'OpenAI-Beta': 'azure',
    'Azure-ReplicaRegion': 'westeurope',
  },
});

export async function* getCompletion(
  model: typeof models[number],
  messages: typeof ChatRequestSchema._type.messages,
) {
  if (gptSet.includes(model)) {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    });
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  } else if (claudeSet.includes(model)) {
    const stream = anthropic.messages.stream({
      model,
      max_tokens: 4000,
      messages,
      stream: true,
    });
    for await (const chunk of stream) {
      const content = chunk.delta?.text;
      if (content) yield content;
    }
  }
}
