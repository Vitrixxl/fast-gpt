import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '~/components/ui/sidebar';
import { deleteChatAtom, renameChatAtom } from '~/front-end/atoms/dialog';
import { useAtomValue, useSetAtom } from 'jotai';
import { LucideEdit, LucideEllipsisVertical, LucideTrash } from 'lucide-react';
import React from 'react';
import { Chat } from '@prisma/client';
import { useSwitchChat } from '~/front-end/features/chat/mutations/useSwitchChat';
import { currentChatAtom } from '~/front-end/atoms/chat';
export const ChatItem = (chat: Omit<Chat, 'userId'>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const setDeleteChat = useSetAtom(deleteChatAtom);
  const setRenameChat = useSetAtom(renameChatAtom);
  const currentChat = useAtomValue(currentChatAtom);
  const switchChat = useSwitchChat();
  return (
    <SidebarMenuItem key={chat.id}>
      <SidebarMenuButton
        className={`flex gap-2 hover:[&>button]:opacity-100 h-fit py-0.5 !min-h-0 pr-0 pl-4  ${
          chat.id == currentChat ? '!bg-accent' : ''
        } `}
        onClick={() => switchChat(chat.id)}
      >
        <span className='!items-start gap-2 flex-1'>
          <span className='!whitespace-normal line-clamp-2'>
            {chat.title}
          </span>
        </span>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size='icon'
              variant={'ghost'}
              className='text-muted-foreground transition-none'
              asChild
            >
              <span>
                <LucideEllipsisVertical />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='start'
            side='right'
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(false);
                  setRenameChat({ id: chat.id, title: chat.title, open: true });
                }}
              >
                <LucideEdit />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className='hover:!bg-destructive/50'
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(false);
                  setDeleteChat({ id: chat.id, open: true });
                }}
              >
                <LucideTrash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
