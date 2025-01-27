import React from 'react';
import highlight from 'highlight.js';

import { marked } from 'marked';
import ReactMarkDown from 'react-markdown';
import { useAtom, useAtomValue } from 'jotai';
import {
  aiMessageWithContentAtom,
  messagesContentTemp,
  userMessageWithContentAtom,
} from '~/front-end/atoms/chat';
import { useToast } from '~/hooks/use-toast';
import { LucideCheck } from 'lucide-react';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';

export const MemoizedMarkdownBlock = React.memo(
  (props: { content: string }) => {
    return (
      <ReactMarkDown
        components={{
          code: (props) => (
            <code
              className='bg-accent px-1.5 py-0.5 rounded text-primary '
              {...props}
            />
          ),
        }}
        className={`markdown-content text-card-foreground flex-1 min-w-0 max-w-full `}
      >
        {props.content}
      </ReactMarkDown>
    );
  },
);

export const parseContent = (
  content: string,
) => {
  return marked.lexer(content);
};

const Line = React.memo(
  ({ content, lang }: { content: string; lang: string }) => {
    const exist = Boolean(highlight.getLanguage(lang));

    const parsedContent = highlight.highlight(content, {
      language: exist ? lang : 'text',
    });

    return (
      <span
        dangerouslySetInnerHTML={{ __html: parsedContent.value + '\n' }}
        className={`text-nowrap language-${lang} `}
      >
      </span>
    );
  },
);

const OptimizedCodeBlock = React.memo((
  { id, messageId, role }: {
    id: number;
    messageId: string;
    role: 'user' | 'assistant';
  },
) => {
  const { toast } = useToast();
  const messagesContent = useAtomValue(aiMessageWithContentAtom);

  const currentContent = messagesContent.find((m) => m.id == messageId)
    ?.parsedContent[id];
  if (!currentContent || currentContent.type != 'code') return;

  const lines = currentContent.raw.split('\n').slice(1);
  const escapedLines = lines.slice(0, lines.length - 1);

  const copy = () => {
    navigator.clipboard.writeText(escapedLines.join('\n'));
    toast({
      title: 'Copy',
      description: (
        <div className='flex gap-2 items-center w-full justify-between'>
          This code block is copied into your clipboard{' '}
          <LucideCheck className='size-4' />
        </div>
      ),
    });
  };

  return (
    <div className='border-border border rounded-lg overflow-hidden min-w-0 max-w-full mt-4 '>
      <div className='bg-card border-b border-border flex justify-between items-center py-2 px-4'>
        <span className='text-sm text-gray-200 font-medium'>
          {currentContent.lang || 'text'}
        </span>
        <button
          className='text-sm text-primary hover:text-primary/80'
          onClick={copy}
        >
          Copy
        </button>
      </div>
      <div className='overflow-x-auto w-full bg-accent'>
        <ScrollArea>
          <pre className='whitespace-pre-wrap p-2 text-sm bg-accent px-4 min-w-full w-max'>
      <code className='w-max'>
      {escapedLines.map((m, id) => (
        <Line
          content={m}
          lang={currentContent.lang || 'text'}
          key={`${messageId}-${id}`}
        />
      ))}
      </code>
          </pre>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </div>
  );
});

export const MarkdownRenderer = React.memo(
  ({ id, role }: { id: string; role: 'user' | 'assistant' }) => {
    const messagesWithContent = useAtomValue(
      aiMessageWithContentAtom,
    );
    const content = messagesWithContent.find((m) => m.id == id)?.parsedContent;
    if (!content) return;

    if (content.length == 0) {
      return <div className='bg-foreground size-4 rounded-full -mr-2 mt-1' />;
    }

    return (
      content.map((m, i) =>
        m.type == 'code'
          ? <OptimizedCodeBlock messageId={id} id={i} key={i} role={role} />
          : (
            <MemoizedMarkdownBlock
              key={i}
              content={m.raw}
            />
          )
      )
    );
  },
);
