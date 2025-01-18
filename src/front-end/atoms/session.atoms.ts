import { atom } from 'jotai';
import { User } from 'next-auth';

export const sessionAtom = atom<User | null>(null);
