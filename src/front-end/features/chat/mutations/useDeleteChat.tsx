import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { LucideCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  assistantMessageWithContentAtom,
  currentChatAtom,
  messagesWithoutContentAtom,
  userMessageWithContentAtom,
} from '~/front-end/atoms/chat';
import { deleteChatAtom } from '~/front-end/atoms/dialog';
import { sessionAtom } from '~/front-end/atoms/session';
import { dxdb } from '~/front-end/lib/dexie';
import { useToast } from '~/hooks/use-toast';
import { deleteChatAction } from '~/server/actions/chat/delete';

export const useDeleteChat = () => {
  const { toast } = useToast();
  const [deleteChatState, setDeleteChatState] = useAtom(deleteChatAtom);
  const setMessages = useSetAtom(messagesWithoutContentAtom);
  const user = useAtomValue(sessionAtom);
  const setUserMessagesContent = useSetAtom(userMessageWithContentAtom);
  const setAssistantMessagesContent = useSetAtom(
    assistantMessageWithContentAtom,
  );
  const [currentChat, setCurrentChat] = useAtom(currentChatAtom);
  const navigate = useNavigate();
  return async () => {
    const chat = await dxdb.chats.where('id').equals(deleteChatState.id)
      .first();
    if (!chat) {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: `This chat doesn't exist`,
      });
    }
    await dxdb.chats.delete(deleteChatState.id);
    if (!user) {
      return toast({
        title: 'Deleted',
        description: (
          <div className='flex gap-2 items-center w-full justify-between'>
            <span>The chat has been deleted</span>
            <LucideCheck className='size-4' />
          </div>
        ),
      });
    }

    setDeleteChatState({ open: false, id: '' });

    const result = await deleteChatAction(deleteChatState.id);
    if (!result.success) {
      console.error(result.message);

      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Error while deleting the chat : ${result.message}`,
      });
      return await dxdb.chats.add(chat);
    }
    await dxdb.messages.where('chatId').equals(deleteChatState.id).delete();
    toast({
      title: 'Deleted',
      description: (
        <div className='flex gap-2 items-center w-full justify-between'>
          {result.message}
          <LucideCheck className='size-4' />
        </div>
      ),
    });
    if (currentChat == chat.id) {
      setMessages([]);
      setUserMessagesContent([]);
      setAssistantMessagesContent([]);
      setCurrentChat(undefined);
      navigate('/chat');
    }
  };
};
