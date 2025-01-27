import { atom } from 'jotai';
import { ClientMessage } from '~/front-end/types/chat';

export const currentChatAtom = atom<string | undefined>();

export const messagesAtom = atom<ClientMessage[]>([]);

export const isNewChatAtom = atom(false);

export const messagesWithoutContentAtom = atom<
  Omit<ClientMessage, 'content'>[]
>(
  [],
);

export const userMessageWithContentAtom = atom<
  Omit<ClientMessage, 'chatId' | 'createdAt'>[]
>([]);

export const assistantMessageWithContentAtom = atom<
  Omit<ClientMessage, 'chatId' | 'createdAt'>[]
>([]);
