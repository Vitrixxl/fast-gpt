import Dexie, { Table } from 'dexie';

export type Assistant = {
  model: 'GPT-o4-mini';
  name: 'GPT';
} | {
  model: '3.5 Sonnet';
  name: 'Claude';
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
  loading: boolean;
  role: 'assistant';
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

export const dxdb = new Db();
