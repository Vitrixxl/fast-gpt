import { GoogleLogin } from '~/components/auth-buttons';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
} from '~/components/ui/sidebar';
import { sessionAtom } from '~/front-end/atoms/session';
import { useAtomValue } from 'jotai';
import { Button } from '~/components/ui/button';
import { LucidePlus } from 'lucide-react';
import { useCreateChat } from '~/front-end/features/chat/mutations/useCreateChat';
import Link from 'next/link';

export const NavFooter = () => {
  const user = useAtomValue(sessionAtom);
  const name = user?.name;

  const createChat = useCreateChat();
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuButton
          className='hover:bg-primary/90 active:bg-primary/90 selection:w-10 !text-primary-foreground'
          asChild
          tooltip={'New chat'}
        >
          <Button
            className='group-data-[collapsible=icon]:gap-0 transition-[gap] duration-300'
            onMouseDown={createChat}
          >
            <LucidePlus />
            <p className='transition-[width] duration-500 overflow-hidden group-data-[collabsible=icon]:w-0'>
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
              tooltip={'Account'}
              asChild
            >
              <Link href='/privacy-policy'>
                <Avatar className='rounded-lg size-8 border-border border'>
                  <AvatarImage
                    src={user.image as string}
                    alt='Vitrice'
                  />
                  <AvatarFallback className='rounded-lg'>
                    {name && (
                      name.split(' ')[0]?.[0]?.toUpperCase() +
                      (name.split(' ')[1]?.[0]?.toUpperCase() || '')
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {user.name}
                  </span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          )
          : <GoogleLogin />}
      </SidebarMenu>
    </SidebarFooter>
  );
};
