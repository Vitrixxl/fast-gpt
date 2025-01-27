import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { deleteChatAtom } from '~/front-end/atoms/dialog';
import { dxdb } from '~/front-end/lib/dexie';
import { useAtom } from 'jotai';

export const DeleteChatDialog = () => {
  const [deleteChatState, setDeleteChatState] = useAtom(deleteChatAtom);
  const handleConfirm = async () => {
    await dxdb.chats.delete(deleteChatState.id);
    await dxdb.messages.where('chatId').equals(deleteChatState.id).delete();
    setDeleteChatState({ open: false, id: '' });
  };
  return (
    <Dialog
      onOpenChange={(open) =>
        setDeleteChatState((prev) => ({ open: open, id: prev.id }))}
      open={deleteChatState.open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure to delete this chat
          </DialogTitle>
          <DialogDescription>
            All the data in this chat will be destroyed forever
          </DialogDescription>
        </DialogHeader>
        <div className='flex gap-2'>
          <Button variant={'secondary'}>Cancel</Button>
          <Button variant={'destructive'} autoFocus onMouseDown={handleConfirm}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
