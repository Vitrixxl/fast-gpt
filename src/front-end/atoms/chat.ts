import { atom } from 'jotai';
import {
  AssistantMessageType,
  ClientMessage,
  UserMessageType,
} from '~/front-end/types/chat';

export const rateLimitAtom = atom<number | null>(null);
export const currentChatAtom = atom<string | undefined | null>();

export const messagesAtom = atom<ClientMessage[]>([]);

export const isNewChatAtom = atom(false);

export const messagesWithoutContentAtom = atom<
  Omit<UserMessageType | AssistantMessageType, 'content'>[]
>(
  [],
);

export const userMessageWithContentAtom = atom<
  Omit<ClientMessage, 'chatId' | 'createdAt'>[]
>([]);

export const assistantMessageWithContentAtom = atom<
  Omit<ClientMessage, 'chatId' | 'createdAt'>[]
>([]);
