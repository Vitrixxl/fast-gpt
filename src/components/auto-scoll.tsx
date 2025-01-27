'use client';
import { userMessageWithContentAtom } from '~/front-end/atoms/chat';
import { forceScrollAtom, isAtBottomAtom } from '~/front-end/atoms/scroll';
import { cn } from '~/lib/utils';
import { useAtom, useAtomValue } from 'jotai';
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
  const messages = useAtomValue(userMessageWithContentAtom);
  const [forceScroll, setForceScroll] = useAtom(forceScrollAtom);

  const scrollDown = (container: HTMLDivElement) => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  };

  // Fonction pour gérer le défilement
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const scrollTop = container.scrollTop;
    setIsAtBottom(scrollTop + 200 > scrollHeight);
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
