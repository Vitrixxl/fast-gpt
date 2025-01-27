import { getDefaultStore, useAtom } from 'jotai';
import { useNavigate } from 'react-router';
import {
  currentChatAtom,
  messagesWithoutContentAtom,
} from '~/front-end/atoms/chat';
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
    if (id) {
      await setChatMessages(id);
    }
    setCurrentChat(id);
    navigate(`/chat/${id}`);
  };
};
