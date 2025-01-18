import { atom, useAtom } from 'jotai';
import { ChatRequestSchema } from '@/lib/validation/chat.validation';
import { ClientMessage } from '@/lib/dexie-db';

export const messagesAtom = atom<ClientMessage[]>([]);
