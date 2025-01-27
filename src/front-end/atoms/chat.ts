import { atom } from 'jotai';
import { TokensList } from 'marked';
import { ClientMessage } from '~/front-end/types/chat';

export const currentChatAtom = atom<string | undefined>();

export const messagesAtom = atom<ClientMessage[]>([]);

export const isNewChatAtom = atom(false);

export const messagesWithoutContent = atom<Omit<ClientMessage, 'content'>[]>(
  [],
);

export const userMessageWithContentAtom = atom<
  (Omit<ClientMessage, 'chatId' | 'createdAt' | 'content'> & {
    content: TokensList;
  })[]
>();

export const assistantMessageWithContentAtom = atom<
  (Omit<ClientMessage, 'chatId' | 'createdAt' | 'content'> & {
    content: TokensList;
  })[]
>();
