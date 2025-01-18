import { ClaudeLogo } from '@/components/claude-logo';
import { GPTLogo } from '@/components/gpt-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { OptimizedMarkdown } from '@/components/ui/code-block';
import { AIClientMessage, Assistant } from '@/lib/dexie-db';
import { LucideClipboard } from 'lucide-react';
import React from 'react';

export const AIMessage = React.memo((
  { content, ai, error, loading }: AIClientMessage,
) => {
  const copyMessage = () => {
    navigator.clipboard.writeText(error ? error : content);
  };

  const Component = () => {
    if (error) {
      return <span className='mt-1  text-destructive'>Error: {error}</span>;
    }
    if (loading) {
      return <div className='bg-foreground size-4 rounded-full mt-2 -mr-2' />;
    }
    return (
      <OptimizedMarkdown
        className={'markdown-content text-card-foreground py-1 flex-1 min-w-0'}
        content={content}
      />
    );
  };
  return (
    <article className='relative flex gap-2 bg-card rounded-xl border border-border py-2 pr-6 w-fit max-w-full pl-2 group'>
      <div className='size-8 shrink-0 flex items-center justify-center'>
        {ai == 'gpt'
          ? <GPTLogo className='!size-6 ' />
          : <ClaudeLogo className='!size-6 ' />}
      </div>
      <Component />
      <Button
        className='group-hover:delay-200 absolute opacity-0 -right-2 !rounded-sm -bottom-2 group-hover:opacity-100 transition-opacity !py-1 h-fit'
        size='sm'
        onClick={copyMessage}
      >
        <LucideClipboard className='!size-3' />
        {/* <span className='!text-xs'>Copy</span> */}
      </Button>
    </article>
  );
});
