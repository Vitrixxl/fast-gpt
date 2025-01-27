import { AssistantMessage, UserMessage } from '~/components/messages';
import { dxdb } from '~/front-end/lib/dexie';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { getDefaultStore, useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  isNewChatAtom,
  messagesAtom,
  messagesWithoutContent,
} from '~/front-end/atoms/chat';
import { sessionAtom } from '~/front-end/atoms/session';
import { forceScrollAtom } from '~/front-end/atoms/scroll';

const store = getDefaultStore();
const switchChat = async (id: string) => {
  if (store.get(isNewChatAtom)) {
    store.set(isNewChatAtom, false);
    return;
  }
  const storedMess = await dxdb.messages
    .where('chatId')
    .equals(id)
    .sortBy('createdAt');
  store.set(
    messagesAtom,
    storedMess,
  );
};

export const MessageContainer = () => {
  const { id } = useParams<{ id: string }>();
  const messages = useAtomValue(messagesWithoutContent);
  const [session] = useAtom(sessionAtom);
  const navigate = useNavigate();
  const setForceScroll = useSetAtom(forceScrollAtom);

  const loadMessages = React.useCallback(async () => {
    if (!id) return;
    setForceScroll(true);

    const currentChat = await dxdb.chats.where('id').equals(id).count();
    if (currentChat == 0) {
      navigate('/chat');
    }

    switchChat(id);
  }, [id]);

  React.useLayoutEffect(() => {
    loadMessages();
  }, [id]);

  return (
    <div className='flex-1  flex  flex-col  gap-2  max-w-3xl  mx-auto  w-full pt-1 pb-2 px-4'>
      {messages && messages.map((m) => (
        m.role == 'user'
          ? <UserMessage id={m.id} key={m.id} user={session} />
          : (
            <AssistantMessage
              {...m}
              key={m.id}
            />
          )
      ))}
    </div>
  );
};
