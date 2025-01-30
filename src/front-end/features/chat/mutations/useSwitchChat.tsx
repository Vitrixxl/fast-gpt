import { getDefaultStore, useAtom } from 'jotai';
import { useNavigate } from 'react-router';
import {
  currentChatAtom,
  isNewChatAtom,
  messagesWithoutContentAtom,
} from '~/front-end/atoms/chat';
import { useDeleteChat } from '~/front-end/features/chat/mutations/useDeleteChat';
import { setChatMessages } from '~/front-end/features/chat/utils';
import { dxdb } from '~/front-end/lib/dexie';

const store = getDefaultStore();
export const useSwitchChat = () => {
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useAtom(currentChatAtom);

  return async (id?: string) => {
    if (id == currentChat) return;
    if (store.get(messagesWithoutContentAtom).length == 0 && currentChat) {
      await dxdb.chats.where('id').equals(currentChat).delete();
    }
    navigate(`/chat/${id}`);
    setCurrentChat(id);
  };
};
