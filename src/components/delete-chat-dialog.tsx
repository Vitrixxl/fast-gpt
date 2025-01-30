import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { deleteChatAtom } from '~/front-end/atoms/dialog';
import { useAtom } from 'jotai';
import { useDeleteChat } from '~/front-end/features/chat/mutations/useDeleteChat';

export const DeleteChatDialog = () => {
  const [deleteChatState, setDeleteChatState] = useAtom(deleteChatAtom);
  const deleteChat = useDeleteChat();
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
        <DialogFooter>
          <div className='flex gap-2'>
            <Button
              variant={'secondary'}
              onClick={() => setDeleteChatState({ open: false, id: '' })}
            >
              Cancel
            </Button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                deleteChat();
              }}
            >
              <Button
                variant={'destructive'}
                autoFocus
              >
                Confirm
              </Button>
            </form>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
