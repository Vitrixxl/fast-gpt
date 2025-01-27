'use client';
import { AutoresizeTextarea } from '~/components/auto-resize-textarea';
import { Button } from '~/components/ui/button';
import { isImportantKey } from '~/lib/keyboard-utils';
import { LucideArrowUp, LucidePaperclip } from 'lucide-react';
import React from 'react';
import { AISelect } from '~/components/ai-selector';
import { useAtomValue } from 'jotai';
import { renameChatAtom } from '~/front-end/atoms/dialog';
import { useSendMessage } from '~/front-end/features/chat/mutations/useSendMessage';
import { setPriority } from 'os';

export const ChatForm = () => {
  const [prompt, setPrompt] = React.useState('');
  const isRenameChatOpen = useAtomValue(renameChatAtom);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const sendMessage = useSendMessage();

  const handleGlobalKeyDown = (e: KeyboardEvent) => {
    if (
      !isImportantKey(e) && inputRef.current &&
      (document.activeElement !== inputRef.current)
    ) {
      const textarea = inputRef.current;
      textarea.focus();
      textarea.selectionStart = textarea.value
        .length;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setPrompt('');
      return sendMessage(prompt);
    }
  };

  React.useEffect(() => {
    if (!isRenameChatOpen.open) {
      document.addEventListener('keydown', handleGlobalKeyDown);
      return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }
    document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isRenameChatOpen]);

  return (
    <div className=' gap-2 bg-card border-border border flex-1 px-4 pt-4 pb-2 pl-4 rounded-t-2xl border-b-0 items-end min-h-0 space-y-4'>
      <AutoresizeTextarea
        maxRows={20}
        autoFocus
        placeholder='How can i grow my d*ck ?'
        className='bg-transparent text-card-foreground w-full outline-none resize-none p-0 '
        onKeyDown={handleKeyDown}
        value={prompt}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        ref={inputRef}
      />
      <div className='flex justify-between items-center w-full'>
        <AISelect />
        <div className='flex gap-2 w-fit'>
          <FileButton></FileButton>
          <Button
            size='icon'
            onMouseDown={() => sendMessage(prompt)}
            disabled={prompt == ''}
          >
            <LucideArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
};
const FileButton = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      variant={'ghost'}
      size='icon'
      {...props}
    >
      <LucidePaperclip />
    </Button>
  );
};
