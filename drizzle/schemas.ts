import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
// Enums
export const Ai = [
  'GPT',
  'CLAUDE',
] as const;
export const Role = ['user', 'assistant'] as const;
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  premium: boolean('premium').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const accounts = pgTable('accounts', {
  userId: uuid('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
  }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey(table.provider, table.providerAccountId),
}));
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
  }),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
}, (table) => ({
  pk: primaryKey(table.identifier, table.token),
}));
export const authenticators = pgTable('authenticators', {
  credentialID: text('credential_id').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
  }),
  providerAccountId: text('provider_account_id').notNull(),
  credentialPublicKey: text('credential_public_key').notNull(),
  counter: integer('counter').notNull(),
  credentialDeviceType: text('credential_device_type').notNull(),
  credentialBackedUp: boolean('credential_backed_up').notNull(),
  transports: text('transports'),
}, (table) => ({
  pk: primaryKey(table.userId, table.credentialID),
}));
export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade',
  }),
  title: varchar('title', { length: 75 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id').notNull().references(() => chats.id, {
    onDelete: 'cascade',
  }),
  content: text('content').notNull(),
  role: text('role', { enum: Role }).default('user').notNull(),
  ai: text('ai', { enum: Ai }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  chats: many(chats),
}));
export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));
export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));
