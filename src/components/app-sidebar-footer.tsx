import { GoogleLogin } from '~/components/auth-buttons';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from '~/components/ui/sidebar';
import { sessionAtom } from '~/front-end/atoms/session.atoms';
import { useAtom } from 'jotai';
import { Button } from '~/components/ui/button';
import { LucidePlus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { createChat } from '~/front-end/api/chat.api';
import { dxdb } from '~/front-end/lib/dexie';

export const NavFooter = () => {
  const [user] = useAtom(sessionAtom);
  const navigate = useNavigate();
  const addChat = async () => {
    const id = await createChat();
    if (id) navigate(`/chat/${id}`);
  };
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuButton
          className='hover:bg-primary/90 active:bg-primary/90 selection:w-10'
          asChild
          tooltip={'New chat'}
        >
          <Button
            className='group-data-[collapsible=icon]:gap-0 transition-[gap] duration-300'
            onMouseDown={addChat}
          >
            <LucidePlus />
            <p className='transition-all duration-500 overflow-hidden group-data-[collabsible=icon]:w-0'>
              New chat
            </p>
          </Button>
        </SidebarMenuButton>
      </SidebarMenu>
      <SidebarMenu>
        {user
          ? (
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              onClick={async () => {
                await dxdb.messages.clear();
                await dxdb.chats.clear();
                signOut();
              }}
              tooltip={'Account'}
            >
              <Avatar className='rounded-lg size-8'>
                <AvatarImage
                  src={user.image as string}
                  alt='Vitrice'
                />
                <AvatarFallback className='rounded-lg'>
                  {user.name &&
                    user.name.split(' ')[0][0].toUpperCase() +
                      user.name.split(' ')[1][0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {user.name}
                </span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
            </SidebarMenuButton>
          )
          : <GoogleLogin />}
      </SidebarMenu>
    </SidebarFooter>
  );
};
