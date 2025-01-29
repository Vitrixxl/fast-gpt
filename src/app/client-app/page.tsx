'use client';
import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';
import { accessedDynamicData } from 'next/dist/server/app-render/dynamic-rendering';

const App = dynamic(() => import('../../front-end/router'), { ssr: false });
export default function Home() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  );
}
