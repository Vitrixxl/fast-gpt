import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { ClaudeLogo } from '~/components/icons';
import { GPTLogo } from '~/components/icons';
import { AssistantMessageType } from '~/front-end/types/chat';

import { userMessageWithContentAtom } from '~/front-end/atoms/chat';
import { useAtomValue } from 'jotai';

import { User } from 'next-auth';
import { MarkdownRenderer } from '~/components/markdown';
import React from 'react';

const UserMessageContent = React.memo(({ id }: { id: string }) => {
  const messages = useAtomValue(userMessageWithContentAtom);
  const content = messages.find((m) => m.id == id)?.content;
  if (!content) return;
  return (
    <p>
      {content}
    </p>
  );
});

export const UserMessage = React.memo((
  { user, id }: { id: string; user?: User | null },
) => {
  return (
    <article className='flex gap-2 bg-accent rounded-xl border border-border py-2 pr-6 w-fit max-w-full pl-2'>
      {user
        ? (
          <Avatar className='rounded-lg size-8 text-sm'>
            {user?.image && <AvatarImage src={user?.image} />}
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
        )
        : <div className='rounded-lg size-8 text-sm bg-secondary shrink-0' />}
      <div className='break-all whitespace-pre-wrap py-1 '>
        <UserMessageContent id={id} />
      </div>
    </article>
  );
});

UserMessage.displayName = 'UserMessage';
const MemoizedLogo = ({ ai }: { ai: 'gpt' | string }) => (
  <div className='size-8 shrink-0 flex items-center justify-center '>
    {ai.startsWith('gpt')
      ? <GPTLogo className='!size-6 ' />
      : <ClaudeLogo className='!size-6 ' />}
  </div>
);

export const AssistantMessage = React.memo((
  { ai, error, id }: Omit<AssistantMessageType, 'content' | 'role'>,
) => {
  const Content = () => {
    if (error) {
      return <span className='mt-1  text-destructive'>Error: {error}</span>;
    }
    return (
      <div className='min-w-0 mt-0.5'>
        <MarkdownRenderer
          id={id}
        />
      </div>
    );
  };
  return (
    <article
      className={`relative flex gap-2 bg-card rounded-xl border border-border py-2 pr-6 w-fit max-w-full pl-2 group`}
      data-message-id={id}
    >
      <MemoizedLogo ai={ai} />
      <Content />
    </article>
  );
});
AssistantMessage.displayName = 'AssistantMessage';
