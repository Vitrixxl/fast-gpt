import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'next-auth';
import React from 'react';

export const UserMessage = React.memo((
  { content, user }: { content: string; user?: User | null },
) => {
  return (
    <article className='flex gap-2 bg-primary/10 rounded-xl border border-border py-2 pr-6 w-fit max-w-full pl-2'>
      {user
        ? (
          <Avatar className='rounded-lg size-8 text-sm'>
            <AvatarImage src={user?.image} />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
        )
        : <div className='rounded-lg size-8 text-sm bg-secondary shrink-0' />}
      <p className='break-all whitespace-pre-wrap py-1 '>
        {content}
      </p>
    </article>
  );
});
