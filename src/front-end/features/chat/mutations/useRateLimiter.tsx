import { useAtom, useAtomValue } from 'jotai';
import { rateLimiter } from '~/app/api/chat/utils';
import { rateLimitAtom } from '~/front-end/atoms/chat';
import { useToast } from '~/hooks/use-toast';
import { getRateLimitAction } from '~/server/actions/chat/rateLimit';

export const useRateLimiter = () => {
  const { toast } = useToast();
  const [rateLimit, setRateLimit] = useAtom(rateLimitAtom);
  return async () => {
    if (rateLimit) return;
    const currentCount = await getRateLimitAction();
    setRateLimit(currentCount);

    if (currentCount == 0) {
      toast({
        title: 'Welcome !',
        description: 'You have 20 free request with GPT-4o-mini model !',
      });
    }
  };
};
