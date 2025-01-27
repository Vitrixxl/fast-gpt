import { MessageContainer } from '~/components/message-container';
import { currentChatAtom } from '~/front-end/atoms/chat';
import AppLayout from '~/front-end/layouts/app-layout';
import { getDefaultStore } from 'jotai';
import { createBrowserRouter, RouterProvider } from 'react-router';

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
      },
      {
        path: '/chat/:id',
        loader: (({ params: { id } }) => {
          if (!id) return false;
          store.set(currentChatAtom, id);
          return true;
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
