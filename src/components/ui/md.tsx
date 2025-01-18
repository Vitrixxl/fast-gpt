import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Processor } from 'unified';
import type { ReactNode } from 'react';
import * as prod from 'react/jsx-runtime';

// Types pour les props des composants
interface CodeBlockProps {
  className?: string;
  children: string;
}

interface MarkdownStreamProps {
  content: string;
  className?: string;
}

// Type pour le processor unifié
type MarkdownProcessor = Processor<any, any, any, any>;

// Composant optimisé pour le code avec memo
const CodeBlock: React.FC<CodeBlockProps> = memo(({ className, children }) => {
  // Extraire le langage de la classe CSS (format: language-xxx)
  const language = className?.replace('language-', '') || 'text';

  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        backgroundColor: '#24262b',
        textWrap: 'wrap' as const,
        wordBreak: 'break-word' as const,
        borderRadius: '0 0 0.75rem 0.75rem',
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
});

CodeBlock.displayName = 'CodeBlock';

// Configuration du processor Markdown optimisée
const createProcessor = (): MarkdownProcessor =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeReact, {
      jsx: prod.jsx,
      jsxs: prod.jsxs,
      Fragment: prod.Fragment,
      components: {
        code: CodeBlock,
      },
    }) as MarkdownProcessor;

const MarkdownStream: React.FC<MarkdownStreamProps> = (
  { content, className = '' },
) => {
  const [parsedContent, setParsedContent] = useState<ReactNode | null>(null);
  const processorRef = useRef<MarkdownProcessor | null>(null);

  // Initialisation mémoisée du processor
  useEffect(() => {
    if (!processorRef.current) {
      processorRef.current = createProcessor();
    }
  }, []);

  // Parser le markdown de manière optimisée
  useEffect(() => {
    const parseMarkdown = async (): Promise<void> => {
      if (!content || !processorRef.current) return;

      try {
        const result = await processorRef.current!.process(
          content,
        );
        setParsedContent(result.result);
      } catch (error) {
        console.error('Erreur de parsing markdown:', error);
      }
    };

    // Utiliser requestIdleCallback pour le parsing non-bloquant
    requestIdleCallback(() => parseMarkdown(), { timeout: 50 });
  }, [content]);

  // Wrapper mémoisé pour éviter les re-renders inutiles
  const MarkdownWrapper = useMemo(
    () => (
      <div className={`markdown-content ${className}`}>
        {parsedContent}
      </div>
    ),
    [parsedContent, className],
  );

  return MarkdownWrapper;
};

// Exporter le composant mémoisé avec types
export default memo(MarkdownStream);
