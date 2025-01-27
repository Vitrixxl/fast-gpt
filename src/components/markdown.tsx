import React from 'react';
import highlight from 'highlight.js';

import { marked } from 'marked';
import ReactMarkDown from 'react-markdown';
import { useAtomValue } from 'jotai';
import { assistantMessageWithContentAtom } from '~/front-end/atoms/chat';
import { useToast } from '~/hooks/use-toast';
import { LucideCheck, LucideCopy } from 'lucide-react';
import { parseMarkdown } from '~/lib/utils';

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
  { content, lang, messageId, id }: {
    content: string;
    lang: string;
    messageId: string;
    id: string;
  },
) => {
  const { toast } = useToast();

  const lines = content.split('\n').slice(1);
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
        <span className='text-sm  font-medium'>
          {lang || 'text'}
        </span>
        <button
          className='text-sm text-primary hover:text-primary/80'
          onClick={copy}
        >
          <LucideCopy className='size-4' />
        </button>
      </div>
      <div className='overflow-x-auto w-full bg-accent'>
        {/* <ScrollArea> */}
        <pre className='whitespace-pre-wrap p-2 text-sm bg-accent px-4 min-w-full w-max'>
      <code className='w-max'>
      {escapedLines.map((m, id) => (
        <Line
          content={m}
          lang={lang || 'text'}
          key={`${messageId}-${id}`}
        />
      ))}
      </code>
        </pre>
        {/*   <ScrollBar orientation='horizontal' /> */}
        {/* </ScrollArea> */}
      </div>
    </div>
  );
});

export const MarkdownRenderer = React.memo(
  ({ id }: { id: string }) => {
    const messagesWithContent = useAtomValue(
      assistantMessageWithContentAtom,
    );
    const content = messagesWithContent.find((m) => m.id == id)?.content;
    if (!content) return;

    const parsedContent = parseMarkdown(content);

    if (parsedContent.length == 0) {
      return <div className='bg-foreground size-4 rounded-full -mr-2 mt-1' />;
    }

    return (
      parsedContent.map((m, i) =>
        m.type == 'code'
          ? (
            <OptimizedCodeBlock
              content={m.raw}
              messageId={id}
              id={id}
              lang={m.lang}
              key={`${id}-${i}`}
            />
          )
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
