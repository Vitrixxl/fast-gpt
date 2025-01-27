import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router';
import { currentChatAtom, isNewChatAtom } from '~/front-end/atoms/chat';
import { createChat } from '~/front-end/features/chat/api/create-chat';
import { sendMessage } from '~/front-end/features/chat/api/sendMessage';
import { useSwitchChat } from '~/front-end/features/chat/mutations/useSwitchChat';

export const useSendMessage = () => {
  const currentChat = useAtomValue(currentChatAtom);
  const setIsNewChat = useSetAtom(isNewChatAtom);
  const switchChat = useSwitchChat();

  return async (prompt: string) => {
    let chatId = currentChat;
    if (!chatId) {
      const newId = await createChat();

      if (!newId) return;
      setIsNewChat(true);

      chatId = newId;
      await switchChat(chatId);
    }

    await sendMessage(prompt, chatId);
  };
};
