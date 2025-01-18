import React from 'react';
import ReactMarkdown, { ExtraProps } from 'react-markdown';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Extraire les styles constants
const customStyle = {
  margin: 0,
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  backgroundColor: '#24262b',
  textWrap: 'wrap' as const,
  wordBreak: 'break-word' as const,
  borderRadius: '0 0 0.75rem 0.75rem',
};

type CustomStyle = typeof customStyle;

const MemoizedCodeBlock = React.memo((
  { language, children, customStyle, codeTagProps }: {
    language: string;
    children: string;
    customStyle: CustomStyle;
    codeTagProps: { className: string };
  },
) => {
  return (
    <div className='max-w-full border-border border rounded-lg overflow-hidden'>
      {
        /* Ne need to memoize the header because of the copy function
  that need to be recreated at content change*/
      }
      <div className='bg-card sticky top-0 border-b border-border flex justify-between items-center py-2 px-4'>
        <span className='text-sm text-gray-200'>{language}</span>
        <button
          className='text-sm text-primary hover:text-primary/80'
          onClick={() => navigator.clipboard.writeText(children)}
        >
          Copy
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={customStyle}
        codeTagProps={codeTagProps}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
});

interface MarkdownProps {
  content: string;
  className?: string;
}

export const OptimizedMarkdown: React.FC<MarkdownProps> = React.memo(({
  content,
  className = '',
}) => {
  const codeTagProps = React.useMemo(() => ({
    className: 'bg-inherit',
  }), []);

  // Memoize markdown components configuration
  const components = React.useMemo(() => ({
    code: (
      props:
        & React.ClassAttributes<HTMLElement>
        & React.HTMLAttributes<HTMLElement>
        & ExtraProps,
    ) => {
      const { children, className } = props;
      const match = /language-(\w+)/.exec(className || '');

      if (match) {
        return (
          <MemoizedCodeBlock
            language={match[1]}
            customStyle={customStyle}
            codeTagProps={codeTagProps}
          >
            {String(children).replace(/\n$/, '')}
          </MemoizedCodeBlock>
        );
      }

      return (
        <code className='text-primary font-semibold'>
          {children}
        </code>
      );
    },
    a: (
      props:
        & React.ClassAttributes<HTMLAnchorElement>
        & React.HTMLAttributes<HTMLAnchorElement>
        & ExtraProps,
    ) => {
      return <a {...props} target='_blank'>{props.children}</a>;
    },
  }), [customStyle, codeTagProps]);

  return (
    <ReactMarkdown
      className={`markdown-content text-card-foreground py-1 flex-1 min-w-0 ${className}`}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
});
