import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router';
import {
  currentChatAtom,
  isNewChatAtom,
  rateLimitAtom,
} from '~/front-end/atoms/chat';
import { forceScrollAtom } from '~/front-end/atoms/scroll';
import { createChat } from '~/front-end/features/chat/api/create-chat';
import { sendMessage } from '~/front-end/features/chat/api/sendMessage';
import { useSwitchChat } from '~/front-end/features/chat/mutations/useSwitchChat';

export const useSendMessage = () => {
  const currentChat = useAtomValue(currentChatAtom);
  const setForceScroll = useSetAtom(forceScrollAtom);
  const setIsNewChat = useSetAtom(isNewChatAtom);
  const setRateLimit = useSetAtom(rateLimitAtom);
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

    setForceScroll(true);
    setRateLimit((prev) => prev || 0 + 1);
    await sendMessage(prompt, chatId);
  };
};
