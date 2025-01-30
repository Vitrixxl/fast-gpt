import { AI } from '~/server/db/types';
import { dxdb } from '~/front-end/lib/dexie';
import { ClientMessage } from '~/front-end/types/chat';
import { useToast } from '~/hooks/use-toast';
import { syncChatAction } from '~/server/actions/chat/sync';

export const useSync = () => {
  const { toast } = useToast();

  return async () => {
    const chats = await dxdb.chats.toArray();
    const messages = await dxdb.messages.toArray().then((data) =>
      data.map((m) => {
        if (m.role == 'assistant') {
          const { error: _, loading: __, ...rest } = m;
          return {
            ...rest,
            role: 'assistant' as const,
            ai: m.ai.startsWith('gpt') ? 'gpt' as AI : 'claude' as AI,
          };
        }
        return { ...m, ai: null };
      })
    );
    const result = await syncChatAction({ chats, messages });
    if (!result.success || !result.data) {
      toast({
        variant: 'destructive',
        title: 'Sync',
        description: result.message,
      });
      throw new Error(result.message);
    }
    const newChats = result.data.syncChats.map((c) => {
      return c;
    });
    const newMessages = result.data.syncMessages.map((m) => {
      if (m.role == 'assistant') {
        return {
          ...m,
          loading: false,
          error: null,
        };
      }
      return m;
    });
    try {
      await dxdb.chats.bulkPut(newChats);
      await dxdb.messages.bulkPut(newMessages as ClientMessage[]);
      console.log('done');
    } catch (error) {
      console.error('whoups');
    }
  };
};
