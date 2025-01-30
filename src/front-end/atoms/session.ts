import { atom } from 'jotai';
import { Session } from 'next-auth';

export const sessionAtom = atom<Session['user'] | null>(null);
