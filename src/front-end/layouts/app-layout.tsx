import { useSession } from 'next-auth/react';
import React from 'react';
import { useSetAtom } from 'jotai';
import { sessionAtom } from '~/front-end/atoms/session';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/app-sidebar';
import { AutoScrollContainer } from '~/components/auto-scoll';
import { ScrollToBottomButton } from '~/components/scroll-to-bottom-button';
import { Toaster } from '~/components/ui/toaster';
import { DeleteChatDialog } from '~/components/delete-chat-dialog';
import { RenameChatDialog } from '~/components/rename-chat-dialog';
import { Outlet } from 'react-router';
import { ChatForm } from '~/components/chat-form';
import { SwitchTheme } from '~/components/switch-theme';

export default function AppLayout() {
  const { data } = useSession();
  const setSession = useSetAtom(sessionAtom);
  React.useLayoutEffect(() => {
    if (data) {
      setSession(data.user);
    }
  }, [data]);
  // React.useEffect(() => {
  //   if (data) getSync(params.id);
  //   // Set eventListner for shortcut
  // }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='min-h-full w-full min-w-0 flex-1'>
        <div className='flex h-dvh w-full flex-col overflow-hidden'>
          <header className='sticky top-0 z-10 -mb-8 flex h-14 items-center gap-3  pr-2 px-2 justify-between bg-gradient-to-b from-background/50 via-background to-transparent'>
            <SidebarTrigger />
            <SwitchTheme />
          </header>
          {/* Main container */}

          <AutoScrollContainer className='relative flex w-full flex-1 overflow-x-hidden overflow-y-scroll pt-8 px-2'>
            <div className='relative mx-auto flex h-full w-full max-w-3xl flex-1 flex-col '>
              <div className='flex-1'>
                <Outlet />
              </div>
              <div
                className='sticky bottom-0 mx-auto w-full bg-gradient-to-t from-background to-transparent'
                style={{
                  boxShadow: '0px -10px 10px -6px rgba(12 10 9 , 0.8)',
                }}
              >
                <ScrollToBottomButton />
                <ChatForm />
              </div>
            </div>
          </AutoScrollContainer>
        </div>
      </main>
      <Toaster />
      <DeleteChatDialog />
      <RenameChatDialog />
    </SidebarProvider>
  );
}
