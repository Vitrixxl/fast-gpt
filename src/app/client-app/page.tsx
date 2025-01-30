'use client';
import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';

const App = dynamic(() => import('../../front-end/router'), { ssr: false });
export default function Home() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  );
}
