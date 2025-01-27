import { getDefaultStore } from 'jotai';
import { v4 as uuid } from 'uuid';
import { TokensList } from 'marked';
import {
  assistantMessageWithContentAtom,
  currentChatAtom,
  messagesWithoutContent,
  userMessageWithContentAtom,
} from '~/front-end/atoms/chat';
import {
  AssistantMessage,
  ClientMessage,
  UserMessage,
} from '~/front-end/types/chat';
import { parseMarkdown } from '~/lib/utils';
import { dxdb } from '~/front-end/lib/dexie';
import { api } from '~/trpc/react';

const tempStore = getDefaultStore();
export class ChatService {
  constructor(
    private readonly store: typeof tempStore,
    private readonly db: typeof dxdb,
  ) {
  }

  private insertMessageContent(
    newContents: Omit<ClientMessage, 'chatId' | 'createdAt'>[],
  ) {
    let assistantMessageWithContent!:
      (Omit<ClientMessage, 'chatId' | 'createdAt' | 'content'> & {
        content: TokensList;
      })[];
    let userMessageWithContent!:
      (Omit<ClientMessage, 'chatId' | 'createdAt' | 'content'> & {
        content: TokensList;
      })[];

    newContents.forEach((m) => {
      m.role == 'user'
        ? userMessageWithContent.push({
          ...m,
          content: parseMarkdown(m.content),
        })
        : assistantMessageWithContent.push({
          ...m,
          content: parseMarkdown(m.content),
        });
    });

    this.store.set(userMessageWithContentAtom, userMessageWithContent);
    this.store.set(
      assistantMessageWithContentAtom,
      assistantMessageWithContent,
    );
  }

  private insertMessage(newMessages: Omit<ClientMessage, 'content'>[]) {
    this.store.set(messagesWithoutContent, (prev) => {
      return [...prev, ...newMessages];
    });
  }

  private switchIds(
    { response, request }: {
      response: {
        prev: string;
        next: string;
      };
      request: {
        prev: string;
        next: string;
      };
    },
  ) {
    // this.store.set(messagesAtom, (prevMessages) =>
    //   prevMessages.map((m) => {
    //     if (m.id == response.prev) return { ...m, id: response.next };
    //     if (m.id == request.prev) return { ...m, id: request.next };
    //     return m;
    //   }));
  }

  public async sendMessage(prompt: string) {
    const model = localStorage.getItem('assistant') as typeof models[number] ||
      'gpt-4o-mini';

    const chatId = this.store.get(currentChatAtom);
    if (!chatId || prompt.trim() == '') return;

    const clientRequestId = uuid();
    const clientResponseId = uuid();
    const newMessages: [
      UserMessage,
      AssistantMessage,
    ] = [{
      id: clientRequestId,
      role: 'user',
      chatId,
      content: prompt,
      createdAt: new Date(),
    }, {
      id: clientResponseId,
      role: 'assistant',
      chatId,
      content: '',
      createdAt: new Date(Date.now() + 1),
      ai: 'gpt-4o',
      loading: true,
    }];
    this.insertMessage(newMessages);
    const storedMessage = await this.db.messages.where('chatId').equals(chatId)
      .toArray().then((data) =>
        data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    const { data } = await api.chat.getResponse({ chatId });
    const temp = mutation.mutate({
      chatId,
      messages: storedMessage,
      model,
    });
    if (!data) return;
    while (true) {
      // const { done, value } = await reader.read();
      // if (done) break;
      // const chunk = decoder.decode(value);
    }
  }
}

export const chatService = new ChatService(tempStore, dxdb);
