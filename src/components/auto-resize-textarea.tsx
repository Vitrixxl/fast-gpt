'use client';
import React from 'react';
import { AutoScrollContainer } from '~/components/auto-scoll';
interface AutoresizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
  minRows?: number;
}

export const AutoresizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoresizeTextareaProps
>((
  { onChange, maxRows, minRows, onKeyDown, value, ...props },
  ref,
) => {
  const localRef = React.useRef<HTMLTextAreaElement | null>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown && onKeyDown(e);
    if (e.key == 'Enter' && e.ctrlKey) {
      const textarea = e.target as HTMLTextAreaElement;
      const cursorPosition = textarea.selectionStart;

      textarea.value = textarea.value.slice(0, cursorPosition) + '\n' +
        textarea.value.slice(cursorPosition);
      resize(textarea);
    }
  };

  const resize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    const maxHeight = maxRows
      ? parseInt(getComputedStyle(textarea).fontSize) * maxRows
      : Infinity;
    const newHeight = Math.max(
      Math.min(maxHeight, textarea.scrollHeight),
      24 * (minRows || 1),
    );

    document.documentElement.style.setProperty(
      'chat-form-height',
      (newHeight + 32) + 'px',
    );
    textarea.style.height = `${newHeight}px`;
  };

  React.useEffect(() => {
    if (localRef.current) {
      resize(localRef.current);
    }
  }, [value, maxRows, minRows]);

  return (
    <textarea
      onChange={onChange}
      value={value}
      onLoad={(e) => resize(e.currentTarget)}
      onKeyDown={handleKeyDown}
      rows={1}
      style={{
        height: 24 * (minRows || 1),
      }}
      {...props}
      ref={(el) => {
        typeof ref === 'function' ? ref(el) : (ref && (ref.current = el));
        localRef.current = el;
      }}
    />
  );
});

AutoScrollContainer.displayName = 'AutoScrollContainer';
