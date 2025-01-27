import { AssistantMessage, UserMessage } from '~/components/messages';
import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { messagesWithoutContentAtom } from '~/front-end/atoms/chat';
import { sessionAtom } from '~/front-end/atoms/session';
import { Welcome } from '~/components/welcome';

export const MessageContainer = () => {
  const messages = useAtomValue(messagesWithoutContentAtom);
  const session = useAtomValue(sessionAtom);
  console.log({ containerMessages: messages });

  return (
    messages.length > 0
      ? (
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
      )
      : <Welcome />
  );
};
