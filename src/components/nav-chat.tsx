import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { v4 as uuid } from 'uuid';
import { clientDb } from '@/lib/dexie-db';
import { useLiveQuery } from 'dexie-react-hooks';
import { LucideMessageSquarePlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';
import { messagesAtom } from '@/front-end/atoms/chat.atoms';

export const NavChat = () => {
  const data = useLiveQuery(async () => await clientDb.chats.toArray());
  const setMessages = useSetAtom(messagesAtom);
  const navigate = useNavigate();

  const addChat = async () => {
    const id = uuid();
    await clientDb.chats.add({
      id,
      title: 'new chat' + id.substring(30),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setMessages([]);
    navigate(`/chat/${id}`);
  };

  return (
    <SidebarGroup className='flex-1 flex flex-col min-h-0'>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenuButton
        className='text-primary mb-2'
        tooltip={'New chat'}
        onClick={addChat}
      >
        <LucideMessageSquarePlus className='size-4' />
        <span className=' font-medium'>New chat</span>
      </SidebarMenuButton>
      <SidebarMenu className='flex-1 max-h-full overflow-y-auto min-h-0 group-data-[collapsible=icon]:hidden'>
        {data?.map((c) => (
          <SidebarMenuItem key={c.id}>
            <SidebarMenuButton asChild>
              <Link
                to={`/chat/${c.id}`}
                className='min-h-7 py-1 !h-auto !items-start gap-2'
              >
                <span className='!whitespace-normal line-clamp-2'>
                  {c.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
