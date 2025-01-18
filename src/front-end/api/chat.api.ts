import { sync } from '@/front-end/api/sync.api';
import { messagesAtom } from '@/front-end/atoms/chat.atoms';
import { forceScrollAtom } from '@/front-end/atoms/scroll.atoms';
import { clientDb, ClientMessage } from '@/lib/dexie-db';
import { gptSet, models } from '@/lib/models';
import { ChatRequestSchema } from '@/lib/validation/chat.validation';
import { getDefaultStore } from 'jotai';
import { v4 as uuid } from 'uuid';

const store = getDefaultStore();
export async function sendMessage(chatId: string, inputValue: string) {
  const messages = store.get(messagesAtom);
  const model = localStorage.getItem('assistant') as typeof models[number] ||
    'gpt-4o-mini';

  if (!chatId || !inputValue.trim()) return;
  const responseId = uuid();

  const newMessages: ClientMessage[] = [{
    id: uuid(),
    content: inputValue,
    role: 'user',
    chatId,
    createdAt: new Date(),
  }, {
    id: responseId,
    content: '',
    role: 'assistant',
    chatId,
    createdAt: new Date(),
    loading: true,
    //@ts-ignore
    ai: gptSet.includes(model) ? 'gpt' : 'claude',
  }];

  store.set(messagesAtom, (m) => [...m, ...newMessages]);

  store.set(forceScrollAtom, true);

  const body: typeof ChatRequestSchema._type = {
    model: model,
    chatId,
    messages: [
      ...messages?.map(({ content, role }) => ({ content, role })).filter((
        m,
      ) => m.content != '') || [],
      { content: inputValue, role: 'user' },
    ],
  };

  const result = await fetch('http://localhost:3000/api/chat', {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    const data = await result.json();
    console.log(data);
    alert('errror:');
  }

  const reader = result.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let responseBuffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done || !value) break;
      const decodedValue = decoder.decode(value);

      if (decodedValue.startsWith('ERROR:')) {
        throw new Error(decodedValue.replace('ERROR:', ''));
      }
      responseBuffer += decodedValue;

      store.set(
        messagesAtom,
        (prevMessages) =>
          prevMessages?.map((m) =>
            m.id == responseId
              ? ({
                ...m,
                loading: false,
                content: m.content + decodedValue,
              })
              : m
          ),
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      store.set(
        messagesAtom,
        (prevMessages) =>
          prevMessages?.map((m) =>
            m.id == responseId
              ? {
                ...m,
                error: error.message,
              }
              : m
          ),
      );
    }
  }

  newMessages[1] = {
    ...newMessages[1],
    createdAt: new Date(),
    content: responseBuffer,
  };
  await clientDb.messages.bulkAdd(newMessages);
  await sync();
}
