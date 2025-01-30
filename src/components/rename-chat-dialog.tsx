import { useAtom } from 'jotai';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { renameChatAtom } from '~/front-end/atoms/dialog';
import { Input } from '~/components/ui/input';
import React, { FormEvent } from 'react';
import { dxdb } from '~/front-end/lib/dexie';
import { useRenameChat } from '~/front-end/features/chat/mutations/useRenameChat';

export const RenameChatDialog = () => {
  const [isOpen, setIsOpen] = useAtom(renameChatAtom);
  const [value, setValue] = React.useState(isOpen.title);
  const [error, setError] = React.useState<string | undefined>();
  const renameChat = useRenameChat();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.length < 3) {
      return setError('The name must be at least 3 caracters');
    }
    if (value.length > 75) {
      return setError('The name must be less than 75 caracters');
    }
    renameChat(value);
  };

  React.useEffect(() => {
    setValue(isOpen.title);
  }, [isOpen]);
  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen({ open, title: '', id: '' });
      }}
      open={isOpen.open}
    >
      <DialogContent autoFocus={false}>
        <DialogHeader>
          <DialogTitle>
            Rename the chat
          </DialogTitle>
        </DialogHeader>
        <form className='flex gap-4' onSubmit={handleSubmit}>
          <Input
            className='flex-1'
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          <Button>Save</Button>
        </form>
      </DialogContent>
      {error && (
        <DialogFooter>
          <p className='text-destructive'>{error}</p>
        </DialogFooter>
      )}
    </Dialog>
  );
};
