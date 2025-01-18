import { v4 as uuid } from 'uuid';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { clientDb } from '@/lib/dexie-db';
import { LucideBot } from 'lucide-react';

export const NavHeader = () => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
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
