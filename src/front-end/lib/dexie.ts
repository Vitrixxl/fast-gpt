import { Chat } from '~/server/db/types';
import Dexie, { Table } from 'dexie';
import { ClientMessage } from '~/front-end/types/chat';

class Db extends Dexie {
  chats!: Table<Omit<Chat, 'userId'>>;
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
