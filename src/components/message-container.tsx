import { AIMessage } from '@/components/bot-message';
import { UserMessage } from '@/components/user-message';
import { clientDb } from '@/lib/dexie-db';
import React, { useTransition } from 'react';
import { useParams } from 'react-router';
import { useAtom } from 'jotai';
import { messagesAtom } from '@/front-end/atoms/chat.atoms';
import { sessionAtom } from '@/front-end/atoms/session.atoms';

export const MessageContainer = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useAtom(messagesAtom);
  const [_, startTransition] = useTransition();
  const [session] = useAtom(sessionAtom);

  const loadMessages = React.useCallback(async () => {
    if (!id) return;
    const storedMess = await clientDb.messages
      .where('chatId')
      .equals(id)
      .sortBy('createdAt');
    startTransition(() => {
      setMessages(storedMess);
    });
  }, [id]);

  React.useEffect(() => {
    loadMessages();
  }, [id]);
  return (
    <div className='flex-1  flex  flex-col  gap-2  max-w-3xl  mx-auto  w-full pt-1 pb-2 px-4'>
      {messages && messages.map((m) => (
        m.role == 'user'
          ? <UserMessage content={m.content} key={m.id} user={session} />
          : (
            <AIMessage
              {...m}
              key={m.id}
            />
          )
      ))}
    </div>
  );
};
