import { ChatItem } from '~/components/chat-item';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '~/components/ui/sidebar';
import { dxdb } from '~/front-end/lib/dexie';
import { useLiveQuery } from 'dexie-react-hooks';

export const NavChat = () => {
  const data = useLiveQuery(async () => await dxdb.chats.toArray());

  return (
    <SidebarGroup className='flex-1 flex flex-col min-h-0 pr-0'>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <ScrollArea>
        <SidebarMenu className='flex-1 max-h-full  overflow-y-auto min-h-0 group-data-[collapsible=icon]:hidden pr-4'>
          {data && data.length > 0
            ? data?.sort((a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
              .map((c) => <ChatItem {...c} key={c.id} />)
            : (
              <div className='flex items-center justify-center h-full w-full p-4'>
                <p className='text-xs text-foreground/70'>
                  No chat for the moment
                </p>
              </div>
            )}
        </SidebarMenu>
      </ScrollArea>
    </SidebarGroup>
  );
};
