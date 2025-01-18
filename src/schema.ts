import { claudeSet, gptSet, modelsFamily } from '@/lib/models';
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { AdapterAccountType } from 'next-auth/adapters';
import { z } from 'zod';

export const chats = pgTable('chats', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id).notNull(),
  title: varchar().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const chatSchema = createSelectSchema(chats, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const messages = pgTable('messages', {
  id: uuid().primaryKey().defaultRandom(),
  content: text().notNull(),
  role: varchar({ enum: ['user', 'assistant'] }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  ai: varchar({ enum: [...modelsFamily] }),
  chatId: uuid().references(() => chats.id).notNull(),
});

export const messagesSchema = createSelectSchema(messages, {
  createdAt: z.coerce.date(),
  ai: z.optional(z.nullable(z.enum([...modelsFamily]))),
});

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  premium: boolean().default(false),
  image: text('image'),
});

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);
