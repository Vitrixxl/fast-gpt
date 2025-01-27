import Anthropic from '@anthropic-ai/sdk';
import { claudeModels, gptModels, models } from '~/lib/ai-models';

import OpenAI from 'openai';
import { env } from '~/env';

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
  messages: { role: 'user' | 'assistant'; content: string }[],
) {
  if (gptModels.find((m) => m == model)) {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    });
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  } else if (claudeModels.find((m) => m == model)) {
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

export async function getTitle(prompt: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'system',
      content:
        "Your role extract the main idea and a title that sum up the message. The title shouldn't be longer that really few words and always in the same language than the user. You'll response simply by the title nothing else, I don't want you to answere with \"\" at all just the title,",
    }, { role: 'user', content: prompt }],
  });
  if (!completion || !completion.choices[0]) return;
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}
