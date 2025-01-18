'use client';
import { ChatRequestSchema, DBSchema } from '@/lib/validation/chat.validation';
import Dexie, { Table } from 'dexie';

export type Assistant = {
  model: 'GPT-o4-mini';
  name: 'GPT';
} | {
  model: '3.5 Sonnet';
  name: 'Claude';
};

type BaseMessage<T extends 'user' | 'assistant'> = {
  id: string;
  chatId: string;
  content: string;
  createdAt: Date;
  role: T;
};
export type UserClientMessage = {
  id: string;
  chatId: string;
  content: string;
  createdAt: Date;
  role: 'user';
};

export type AIClientMessage = {
  id: string;
  chatId: string;
  content: string;
  createdAt: Date;
  role: 'assistant';
  loading?: boolean;
  error?: string | null;
  ai: 'gpt' | 'claude';
};

export type ClientMessage = UserClientMessage | AIClientMessage;
class Db extends Dexie {
  chats!: Table<typeof DBSchema._type.chats[number]>;
  messages!: Table<
    ClientMessage
  >;

  constructor() {
    super('chat-db');

    this.version(1).stores({
      chats: 'id, title, createdAt, updatedAt',
      messages: 'id, content, role, chatId, createdAt',
    });
  }
}

export const clientDb = new Db();
