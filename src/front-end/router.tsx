import { MessageContainer } from '~/components/message-container';
import { currentChatAtom, isNewChatAtom } from '~/front-end/atoms/chat';
import AppLayout from '~/front-end/layouts/app-layout';
import { getDefaultStore } from 'jotai';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router';
import { Welcome } from '~/components/welcome';
import { dxdb } from '~/front-end/lib/dexie';
import { setChatMessages } from '~/front-end/features/chat/utils';

const store = getDefaultStore();
// Définissez votre router avec createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        loader: (() => {
          store.set(currentChatAtom, undefined);
          return true;
        }),
        path: '/chat',
        element: <Welcome />,
      },
      {
        path: '/chat/:id',
        loader: (async ({ params: { id } }) => {
          if (!id) return;
          store.set(currentChatAtom, id);
          const exist = await dxdb.chats.where('id').equals(id).count();
          if (exist == 0) {
            return redirect('/chat');
          }
          if (store.get(isNewChatAtom)) {
            store.set(isNewChatAtom, false);
            return;
          }
          return setChatMessages(id);
        }),

        element: <MessageContainer />,
      },
    ],
  },
]);

// Votre App devient simplement
export default function App() {
  return <RouterProvider router={router} />;
}
