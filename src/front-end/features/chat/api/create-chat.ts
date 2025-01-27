import { getDefaultStore } from 'jotai';
import { redirect } from 'react-router';
import { v4 as uuid } from 'uuid';
import {
  assistantMessageWithContentAtom,
  currentChatAtom,
  messagesWithoutContentAtom,
  userMessageWithContentAtom,
} from '~/front-end/atoms/chat';
import { sessionAtom } from '~/front-end/atoms/session';
import { dxdb } from '~/front-end/lib/dexie';
import { createChatAction } from '~/server/actions/chat/create';

const store = getDefaultStore();
export const createChat = async () => {
  const currentChat = store.get(currentChatAtom);
  const messages = store.get(messagesWithoutContentAtom);
  if (messages.length == 0 && currentChat) return;

  const id = uuid();
  redirect(`/chat/${id}`);
  const newChat = {
    id,
    title: 'New chat',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await dxdb.chats.add(newChat);
  store.set(messagesWithoutContentAtom, []);
  store.set(userMessageWithContentAtom, []);
  store.set(assistantMessageWithContentAtom, []);
  store.set(currentChatAtom, id);
  return id;
};
