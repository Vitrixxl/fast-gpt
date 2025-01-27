import { type ClassValue, clsx } from 'clsx';
import { marked } from 'marked';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const parseMarkdown = (content: string) => {
  return marked.lexer(content);
};
