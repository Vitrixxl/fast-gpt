import { clientDb } from '@/lib/dexie-db';
import { messagesAtom } from '@/front-end/atoms/chat.atoms';

import { base64Compress, dumpDb } from '@/lib/utils';
import {
  SyncRequestSchema,
  SyncResponseSchema,
} from '@/lib/validation/chat.validation';
import { chatSchema, messagesSchema } from '@/schema';
import { getDefaultStore } from 'jotai';

const store = getDefaultStore();
export const sync = async () => {
  const jsonDb = await dumpDb();
  const compressedJson = base64Compress(jsonDb);
  const body: typeof SyncRequestSchema._type = {
    compressedData: compressedJson,
  };
  const result = await fetch('http://localhost:3000/api/chat/sync', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data: typeof SyncResponseSchema._type = await result.json();
  if (data.error) {
    console.error(data.message);
    throw new Error(data.message);
  }

  console.log(data.message);
};

export const getSync = async (id: string | undefined) => {
  // await sync();
  await clientDb.messages.clear();
  await clientDb.chats.clear();

  const result = await fetch('http://localhost:3000/api/chat/sync', {
    credentials: 'include',
  });

  const { messages, chats }: {
    messages: typeof messagesSchema._type[];
    chats: typeof chatSchema._type[];
  } = await result.json();

  console.log({ messages });

  //@ts-ignore
  await clientDb.messages.bulkPut(messages);
  await clientDb.chats.bulkPut(chats);
  if (id) {
    store.set(messagesAtom, messages.filter((m) => m.chatId == id));
  }
};
