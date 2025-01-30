import { Ai, chats, messages, Role } from '~/server/db/schema';

export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;

export type AI = typeof Ai[number];
export type ROLE = typeof Role[number];
