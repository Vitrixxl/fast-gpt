import { v4 as uuid } from 'uuid';
import {
  insertMessage,
  insertMessageContent,
  setMessageError,
  updateContentMessage,
} from '~/front-end/features/chat/utils';
import { dxdb } from '~/front-end/lib/dexie';
import { AssistantMessageType, UserMessageType } from '~/front-end/types/chat';
import { models } from '~/lib/ai-models';

export const sendMessage = async (prompt: string, chatId: string) => {
  const model = localStorage.getItem('assistant') as typeof models[number] ||
    'gpt-4o-mini';

  const clientRequestId = uuid();
  const clientResponseId = uuid();
  const newMessages: [
    UserMessageType,
    AssistantMessageType,
  ] = [{
    id: clientRequestId,
    role: 'user',
    chatId,
    content: prompt,
    createdAt: new Date(),
  }, {
    id: clientResponseId,
    role: 'assistant',
    chatId,
    content: '',
    createdAt: new Date(Date.now() + 1),
    ai: model,
    loading: true,
  }];
  insertMessage(newMessages);
  insertMessageContent(
    newMessages.map((m) => ({ content: m.content, id: m.id, role: m.role })),
  );
  try {
    await dxdb.chats.update(chatId, {
      updatedAt: new Date(),
    });
    const storedMessage = await dxdb.messages.where('chatId').equals(chatId)
      .toArray().then((data) =>
        data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );

    const chatMessages = [
      ...storedMessage,
      { role: 'user', content: newMessages[0].content },
    ];
    const body = JSON.stringify({
      chatId,
      messages: chatMessages,
      model,
    });
    const result = await fetch('http://84.234.19.41:80/api/chat', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: body,
    });

    const decoder = new TextDecoder();
    if (!result.ok) {
      const data = await result.json();
      throw new Error(data.message);
    }
    const reader = result.body?.getReader();
    if (!reader) return; // need a better error handler

    let responseBuffer = '';
    let serverRequestId: string | undefined,
      serverResponseId!: string | undefined;
    while (true) {
      let treat = true;
      const { value, done } = await reader.read();
      if (done || !value) break;
      const decodedValue = decoder.decode(value);

      if (decodedValue.startsWith('ERROR:')) {
        throw new Error(decodedValue.replace('ERROR:', ''));
      }

      if (decodedValue.startsWith('START:')) {
        [serverRequestId, serverResponseId] = decodedValue.replace('START:', '')
          .split('|');
        treat = false;
      }

      if (decodedValue.includes('TITLE:')) {
        const start = decodedValue.lastIndexOf('TITLE:');
        const title = decodedValue.slice(start, decodedValue.length).replace(
          'TITLE:',
          '',
        );
        // sometimes the last token come with the title, we need to split it and get the new title
        // Might optimize with .split("TITLE:")
        const token = decodedValue.slice(0, start);
        responseBuffer += token;

        updateContentMessage(clientResponseId, token);

        // We can break here because the title is the last chunk that we get
        await dxdb.chats.update(chatId, {
          title,
        });
        break;
      }

      if (treat) {
        responseBuffer += decodedValue;
        updateContentMessage(clientResponseId, decodedValue);
      }
    }
    await dxdb.messages.bulkAdd(
      newMessages.map((m) => ({
        ...m,
        id: m.role == 'user' ? serverRequestId || '' : serverResponseId || '',
        content: m.role == 'user' ? prompt : responseBuffer,
      })),
    );
  } catch (error) {
    if (error instanceof Error) {
      setMessageError(clientResponseId, error.message);
    }
  }
};
