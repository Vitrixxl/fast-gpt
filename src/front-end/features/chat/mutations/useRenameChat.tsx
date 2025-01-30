import { useAtom, useAtomValue } from 'jotai';
import { useNavigate } from 'react-router';
import { renameChatAtom } from '~/front-end/atoms/dialog';
import { sessionAtom } from '~/front-end/atoms/session';
import { dxdb } from '~/front-end/lib/dexie';
import { useToast } from '~/hooks/use-toast';
import { renameChatAction } from '~/server/actions/chat/rename';

export const useRenameChat = () => {
  const [renameChatState, setRenameChatState] = useAtom(renameChatAtom);
  const { toast } = useToast();
  const user = useAtomValue(sessionAtom);

  return async (newTitle: string) => {
    const initialTitle = renameChatState.title;
    await dxdb.chats.update(renameChatState.id, {
      title: newTitle,
    });
    setRenameChatState({
      open: false,
      id: '',
      title: '',
    });
    if (!user) {
      return toast({
        title: 'Rename',
        description: 'Chat renamed',
      });
    }
    const result = await renameChatAction({
      id: renameChatState.id,
      title: newTitle,
    });
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
      await dxdb.chats.update(renameChatState.id, {
        title: initialTitle,
      });
      return;
    }
    return toast({
      title: 'Rename',
      description: result.message,
    });
  };
};
