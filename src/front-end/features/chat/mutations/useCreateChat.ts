import { useNavigate } from 'react-router';
import { createChat } from '~/front-end/features/chat/api/create-chat';

export const useCreateChat = () => {
  const navigate = useNavigate();
  return async () => {
    const id = await createChat();
    // if (!id) return;
    // navigate(`chat/${id}`);
  };
};
