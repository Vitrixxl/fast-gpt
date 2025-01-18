import { MessageContainer } from '@/components/message-container';
import AppLayout from '@/front-end/layout/app.layout';
import { clientDb } from '@/lib/dexie-db';
import { useSession } from 'next-auth/react';
import { createBrowserRouter, RouterProvider } from 'react-router';

// Définissez votre router avec createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/chat/:id',
        element: <MessageContainer />,
      },
    ],
  },
]);

// Votre App devient simplement
export default function App() {
  return <RouterProvider router={router} />;
}
