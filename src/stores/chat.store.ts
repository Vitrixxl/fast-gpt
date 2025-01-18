import { warn } from 'console';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

export const useChatStore = createWithEqualityFn<{ data: string }>(
  () => ({
    data: '',
  }),
  shallow,
);
const test = useChatStore.getState();
