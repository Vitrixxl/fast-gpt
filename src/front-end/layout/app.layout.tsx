import { AppSidebar } from '@/components/app-sidebar';
import { ChatForm } from '@/components/chat-input';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Outlet } from 'react-router';
import { AutoScrollContainer } from '@/components/auto-scroll-container';
import { ScrollToBottomButton } from '@/components/scroll-to-bottom-button';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useSetAtom } from 'jotai';
import { sessionAtom } from '@/front-end/atoms/session.atoms';
import { clientDb } from '@/lib/dexie-db';
import { getSync } from '@/front-end/api/sync.api';
import { useParams } from 'react-router';

export default function AppLayout() {
  const { data } = useSession();
  const setSession = useSetAtom(sessionAtom);
  const params = useParams();
  React.useLayoutEffect(() => {
    if (data) {
      setSession(data.user);
    }
  }, [data]);
  React.useEffect(() => {
    data && getSync(data.user.id);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='min-h-full w-full min-w-0 flex-1'>
        <div className='flex h-dvh w-full flex-col overflow-hidden'>
          <header className='sticky top-0 z-10 -mb-8 flex h-14 items-center gap-3  pr-2 px-2 justify-between bg-gradient-to-b from-background via-background to-transparent'>
            <SidebarTrigger />
          </header>
          {/* Main container */}

          <AutoScrollContainer // initialScrollBehavior='auto'
           // scrollViewClassName='!overflow-y-visible'
          className='relative flex w-full flex-1 overflow-x-hidden overflow-y-scroll pt-8 px-2'>
            <div className='relative mx-auto flex h-full w-full max-w-3xl flex-1 flex-col '>
              <Outlet />
              <div
                className='sticky bottom-0 mx-auto w-full bg-gradient-to-t from-background to-transparent'
                style={{
                  boxShadow: '0px -10px 10px -6px rgba(20, 26, 31, 0.8)',
                }}
              >
                <ScrollToBottomButton />
                <ChatForm />
              </div>
            </div>
          </AutoScrollContainer>
        </div>
      </main>
    </SidebarProvider>
  );
}
