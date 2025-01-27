import { models } from '~/lib/ai-models';

export type UserMessageType = {
  id: string;
  chatId: string;
  content: string;
  role: 'user';
  createdAt: Date;
};
export type AssistantMessageType = {
  id: string;
  chatId: string;
  content: string;
  role: 'assistant';
  ai: typeof models[number];
  error?: string | undefined;
  loading: boolean;
  createdAt: Date;
};

export type ClientMessage = UserMessageType | AssistantMessageType;
