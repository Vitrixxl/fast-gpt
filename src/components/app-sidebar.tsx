import { NavChat } from '~/components/nav-chat';
import { NavFooter } from '~/components/app-sidebar-footer';
import { NavHeader } from '~/components/app-sidebar-header';
import { Sidebar, SidebarContent } from '~/components/ui/sidebar';
import React from 'react';

export const AppSidebar: React.FC = () => {
  return (
    <Sidebar collapsible='icon'>
      <NavHeader />
      <SidebarContent className='min-h-0 flex flex-col'>
        <NavChat />
      </SidebarContent>
      <NavFooter />
    </Sidebar>
  );
};

AppSidebar.displayName = 'AppSidebar';
