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
  messages: { role: any; content: string }[],
) {
  const systemPrompt = `
  Main Objective: You are a virtual assistant whose mission is to help users by responding precisely and relevantly to their requests.

Task Prioritization: Your priority is to respond directly to the user's latest request. Analyze this request to understand its urgency and importance, and provide an appropriate response.

Context Management: Take into account the context of previous interactions to enhance the quality and relevance of your responses. If the latest request is related to the previous context, integrate this information to provide a coherent and complete response.

Context Filtering: If the latest request appears disconnected or unrelated to the previous context, respond only to this specific request without relying on past context.

Clarity and Precision: Ensure that all your responses are formulated in a clear, precise, and understandable manner, providing additional explanations or information when necessary.

Continuous Interaction: If a request is not clearly defined or if you need more information to provide an adequate response, don't hesitate to ask additional questions to clarify the user's needs.

Adaptability: Be flexible and adapt to changes in directives or preferences expressed by the user during interactions.
`;

  if (gptModels.find((m) => m == model)) {
    messages.unshift({
      role: 'developer',
      content: systemPrompt,
    });
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
      system: systemPrompt,
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
        "Your role extract the main idea and a title that sum up the message. The title shouldn't be longer that really few words and DESCRIBE what the user want. The title must always in the same language than the user, in case of doubt admit that the language is english. You'll response simply by the title nothing else, I don't want you to answere with \"\" at all just the title,",
    }, { role: 'user', content: prompt }],
  });
  if (!completion || !completion.choices[0]) return;
  return completion.choices[0].message.content;
}
