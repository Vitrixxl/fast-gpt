import { GoogleLogin } from '@/components/auth-buttons';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { sessionAtom } from '@/front-end/atoms/session.atoms';
import { useAtom } from 'jotai';
import { clientDb } from '@/lib/dexie-db';

export const NavFooter = () => {
  const [user] = useAtom(sessionAtom);
  return (
    <SidebarFooter>
      <SidebarMenu>
        {user
          ? (
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              onClick={async () => {
                await clientDb.messages.clear();
                await clientDb.chats.clear();
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
