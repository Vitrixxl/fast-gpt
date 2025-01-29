import React from 'react';
import { useCreateChat } from '~/front-end/features/chat/mutations/useCreateChat';

export const useShortKeys = () => {
  const createChat = useCreateChat();
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.key == 'n') {
      createChat();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
