'use client';
import { AutoresizeTextarea } from '@/components/ui/auto-resize-textarea';
import { Button } from '@/components/ui/button';
import { isImportantKey } from '@/lib/keyboard.utils';
import { LucideArrowUp, LucidePaperclip } from 'lucide-react';
import React, { useTransition } from 'react';
import { useParams } from 'react-router';
import { AISelect } from '@/components/ai-select';
import { sendMessage } from '@/front-end/api/chat.api';

export const ChatForm = () => {
  const params = useParams();
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  async function handleSubmit() {
    if (!params.id) return;
    setInputValue('');
    sendMessage(params.id, inputValue);
  }

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
      return handleSubmit();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown, {
      capture: true,
    });
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className=' gap-2 bg-card border-border border flex-1 px-4 pt-4 pb-2 pl-4 rounded-t-2xl border-b-0 items-end min-h-0 space-y-4'>
      <AutoresizeTextarea
        maxRows={20}
        autoFocus
        placeholder='How can i grow my d*ck ?'
        className='bg-transparent text-card-foreground w-full outline-none resize-none p-0 '
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        ref={inputRef}
      />
      <div className='flex justify-between items-center w-full'>
        <AISelect />
        <div className='flex gap-2 w-fit'>
          <Button variant={'ghost'} size='icon'>
            <LucidePaperclip />
          </Button>
          <Button size='icon' onClick={handleSubmit}>
            <LucideArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
};
