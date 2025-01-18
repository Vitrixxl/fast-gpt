'use client';
import { messagesAtom } from '@/front-end/atoms/chat.atoms';
import {
  forceScrollAtom,
  isAtBottomAtom,
} from '@/front-end/atoms/scroll.atoms';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { LucideChevronDown } from 'lucide-react';
import React from 'react';

export interface AutoScrollContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  forceScroll?: boolean;
}

export const AutoScrollContainer: React.FC<AutoScrollContainerProps> = ({
  className,
  children,
  ...props
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useAtom(isAtBottomAtom);
  const [messages] = useAtom(messagesAtom);
  const [forceScroll, setForceScroll] = useAtom(forceScrollAtom);

  const scrollDown = (container: HTMLDivElement) => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'auto',
    });
  };

  // Fonction pour gérer le défilement
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const scrollTop = container.scrollTop;
    setIsAtBottom(scrollTop + 15 > scrollHeight);
  };

  React.useEffect(() => {
    if (forceScroll && ref.current) {
      scrollDown(ref.current);
      setForceScroll(false);
    }
  }, [forceScroll]);

  React.useEffect(() => {
    const container = ref.current;
    container && isAtBottom && scrollDown(container);
  }, [messages]);

  return (
    <div
      className={cn('relative', className)}
      {...props}
      ref={ref}
      onScroll={handleScroll}
    >
      {children}
    </div>
  );
};
