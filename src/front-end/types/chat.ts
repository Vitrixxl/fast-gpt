import { models } from '~/lib/ai-models';

export type UserMessage = {
  id: string;
  chatId: string;
  content: string;
  role: 'user';
  createdAt: Date;
};
export type AssistantMessage = {
  id: string;
  chatId: string;
  content: string;
  role: 'assistant';
  ai: typeof models[number];
  error?: string | undefined;
  loading: boolean;
  createdAt: Date;
};

export type ClientMessage = UserMessage | AssistantMessage;
