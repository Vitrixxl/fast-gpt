import { NavChat } from '@/components/nav-chat';
import { NavFooter } from '@/components/nav-footer';
import { NavHeader } from '@/components/nav-header';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { clientDb } from '@/lib/dexie-db';
import { LucideMessageSquarePlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { v4 } from 'uuid';

export const AppSidebar = () => {
  const { data } = useSession();

  return (
    <Sidebar collapsible='icon'>
      <NavHeader />
      <SidebarContent className='min-h-0 flex flex-col'>
        <NavChat />
      </SidebarContent>
      <NavFooter session={data} />
    </Sidebar>
  );
};
