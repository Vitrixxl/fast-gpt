import {
  forceScrollAtom,
  isAtBottomAtom,
} from '@/front-end/atoms/scroll.atoms';
import { useAtom, useSetAtom } from 'jotai';
import { LucideChevronDown } from 'lucide-react';

export const ScrollToBottomButton = () => {
  const [isAtBottom] = useAtom(isAtBottomAtom);
  const setForceScroll = useSetAtom(forceScrollAtom);
  return (
    <button
      className={`absolute -top-12 size-8 bg-secondary text-secondary-foreground left-1/2 -translate-x-1/2 flex items-center justify-center  rounded-md hover:w-14 hover:rounded-2xl transition-[width,border-radius] ${
        isAtBottom ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } `}
      onClick={() => setForceScroll(true)}
    >
      <LucideChevronDown className='' />
    </button>
  );
};
