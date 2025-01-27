import { atom } from 'jotai';

export const deleteChatAtom = atom({ open: false, id: '' });
export const renameChatAtom = atom({ open: false, title: '', id: '' });
