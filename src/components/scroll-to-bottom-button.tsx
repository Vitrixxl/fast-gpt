import { forceScrollAtom, isAtBottomAtom } from '~/front-end/atoms/scroll';
import { useAtom, useSetAtom } from 'jotai';
import { LucideChevronDown } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const ScrollToBottomButton = () => {
  const [isAtBottom] = useAtom(isAtBottomAtom);
  const setForceScroll = useSetAtom(forceScrollAtom);
  return (
    <Button
      className={`duration-100 hover:w-14 absolute -top-12 left-1/2 -translate-x-1/2 transition-[width,opacity]  hover:bg-primary ${
        isAtBottom ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } `}
      onClick={() => setForceScroll(true)}
      size='icon'
    >
      <LucideChevronDown />
    </Button>
  );
};
