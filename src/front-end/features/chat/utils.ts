import { warn } from 'console';
import { getDefaultStore } from 'jotai';
import {
  assistantMessageWithContentAtom,
  messagesWithoutContentAtom,
  userMessageWithContentAtom,
} from '~/front-end/atoms/chat';
import { dxdb } from '~/front-end/lib/dexie';
import {
  AssistantMessageType,
  ClientMessage,
  UserMessageType,
} from '~/front-end/types/chat';

const store = getDefaultStore();

export function insertMessageContent(
  newContents: Omit<ClientMessage, 'chatId' | 'createdAt'>[],
) {
  const assistantMessageWithContent: Omit<
    ClientMessage,
    'chatId' | 'createdAt'
  >[] = [];
  const userMessageWithContent: Omit<
    ClientMessage,
    'chatId' | 'createdAt'
  >[] = [];

  newContents.forEach((m) => {
    m.role == 'user'
      ? userMessageWithContent.push(m)
      : assistantMessageWithContent.push(m);
  });

  store.set(
    userMessageWithContentAtom,
    (prev) => [...prev, ...userMessageWithContent],
  );
  store.set(
    assistantMessageWithContentAtom,
    (prev) => [...prev, ...assistantMessageWithContent],
  );
}

export function updateContentMessage(clientResponseId: string, token: string) {
  store.set(assistantMessageWithContentAtom, (prev) => {
    return prev.map((m) =>
      m.id == clientResponseId ? { ...m, content: m.content + token } : m
    );
  });
}
export function insertMessage(newMessages: Omit<ClientMessage, 'content'>[]) {
  store.set(messagesWithoutContentAtom, (prev) => {
    return [...prev, ...newMessages];
  });
  store.get(messagesWithoutContentAtom);
}

export function setMessageError(id: string, errorMessage: string) {
  store.set(messagesWithoutContentAtom, (prev) => {
    return prev.map((m) => m.id == id ? { ...m, error: errorMessage } : m);
  });
}

export async function setChatMessages(id: string) {
  const newMessages = await dxdb.messages.where('chatId').equals(id).toArray();

  const sortedMessages = newMessages.sort((a, b) =>
    a.createdAt.getTime() - b.createdAt.getTime()
  );
  const userMessageWithContent: Omit<
    UserMessageType,
    'chatId' | 'createdAt'
  >[] = [];
  const assistantMessageWithContent: Omit<
    AssistantMessageType,
    'chatId' | 'createdAt'
  >[] = [];

  const messagesWithoutContent: Omit<ClientMessage, 'content'>[] = [];

  sortedMessages.forEach((m) => {
    const { content, ...rest } = m;
    messagesWithoutContent.push(rest);
    m.role == 'assistant'
      ? assistantMessageWithContent.push({
        id: m.id,
        loading: m.loading,
        error: m.error,
        ai: m.ai,
        role: m.role,
        content,
      })
      : userMessageWithContent.push({
        id: m.id,
        role: m.role,
        content,
      });
  });
  store.set(messagesWithoutContentAtom, messagesWithoutContent);
  store.set(userMessageWithContentAtom, userMessageWithContent);
  store.set(assistantMessageWithContentAtom, assistantMessageWithContent);
}
