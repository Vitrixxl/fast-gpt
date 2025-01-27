import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from '~/components/ui/sidebar';
import { LucideBot } from 'lucide-react';
import { useSwitchChat } from '~/front-end/features/chat/mutations/useSwitchChat';

export const NavHeader = () => {
  const switchChat = useSwitchChat();
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          onClick={() => switchChat()}
        >
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
            <LucideBot className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-base leading-tight'>
            <span className='truncate font-semibold'>
              Fast-chat
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarHeader>
  );
};
